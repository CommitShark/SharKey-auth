import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";
import dotenv from "dotenv";
import { matchedData } from "express-validator";
import { ISignupInput } from "../@types/request-inputs";
import { asyncHandler } from "../middlewares/async";
import { myValidationResult } from "../lib/utils";
import ApiError from "../lib/ApiError";
import httpStatus from "http-status";
import passport from "passport";
import logger from "../config/logger.config";
import sequelize from "../db/init";

dotenv.config();

export const login = asyncHandler(async (req: Request, res: Response, next) => {
  const result = myValidationResult(req);

  if (!result.isEmpty()) {
    throw new ApiError(
      httpStatus.UNPROCESSABLE_ENTITY,
      result.array().join(". ")
    );
  }

  return await new Promise((success, rej) => {
    passport.authenticate(
      "local",
      { session: false },
      (err: any, user: User | null, info: any) => {
        console.log("login", user, info, err);

        if (err || !user) {
          logger.error(JSON.stringify(err));

          rej(
            err ??
              new ApiError(
                httpStatus.BAD_REQUEST,
                info ? info.message : "Login failed"
              )
          );
        } else {
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              tokenVersion: user.tokenVersion,
            },
            process.env.JWT_SECRET as string,
            {
              expiresIn: "1h",
            }
          );

          return success(res.json({ token }));
        }
      }
    )(req, res, next);
  });
});

export const logout = asyncHandler(async (req, res) => {
  const userId = req.userData.id;

  await User.update(
    { tokenVersion: sequelize.literal("tokenVersion + 1") },
    { where: { id: userId } }
  );
  res.status(httpStatus.OK).json({ message: "Logged out successfully." });
});

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const result = myValidationResult(req);

  if (!result.isEmpty()) {
    // handle validation errors
    return res.send("Please fix the request");
  }

  const data = matchedData<ISignupInput>(req);

  const { email, password, firstName, lastName } = data;

  const userExist = await User.findOne({ where: { email } });

  if (userExist) {
    res.status(400).json({ error: "User already exists." });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      tokenVersion: 0,
    });
    res.json(user);
  }
});
