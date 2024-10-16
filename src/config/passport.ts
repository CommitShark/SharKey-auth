import passport from "passport";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import User from "../models/User";
import { JwtPayload } from "../@types/shared";
import ApiError from "../lib/ApiError";
import httpStatus from "http-status";

const verifyFn: VerifyFunction = async (
  email: string,
  password: string,
  done
) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return done(
        new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials."),
        false
      );

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return done(
        new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials."),
        false
      );

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

passport.use(new LocalStrategy({ usernameField: "email" }, verifyFn));

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET as string,
    },
    async (jwtPayload: JwtPayload, done) => {
      try {
        const user = await User.findByPk(jwtPayload.id);
        if (!user) return done(null, false, { message: "User not found." });

        // Compare token versions
        if (Number(jwtPayload.tokenVersion) !== Number(user.tokenVersion)) {
          return done(null, false, { message: "Token has been invalidated." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
