import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";
import dotenv from "dotenv";
import { matchedData } from "express-validator";
import { ILoginInput, ISignupInput } from "../@types/request-inputs";
import { asyncHandler } from "../middlewares/async";
import { myValidationResult } from "../lib/utils";

dotenv.config();

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = myValidationResult(req);

  if (!result.isEmpty()) {
    // handle validation errors
    return res.send("Please fix the request");
  }

  const { email, password } = matchedData<ILoginInput>(req);

  const user = await User.findOne({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid email or password" });
  }
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
    });
    res.json(user);
  }
});
