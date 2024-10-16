import express from "express";
import passport from "passport";
import { body } from "express-validator";
import { login, signup } from "../controllers/authController";

const router = express.Router();

router.post(
  "/login",
  body("email").notEmpty().trim().isEmail(),
  body("password").isString(),
  login
);

router.post(
  "/signup",
  body("email").notEmpty().trim().isEmail(),
  body("password").isString().isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
  body("firstName").isString().notEmpty(),
  body("lastName").isString().notEmpty(),
  signup
);

// This route is protected, accessible only with valid JWT
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "You are authorized!" });
  }
);

export default router;
