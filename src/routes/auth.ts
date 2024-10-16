import express from "express";
import passport from "passport";
import { login, signup } from "../controllers/authController";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);

// This route is protected, accessible only with valid JWT
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "You are authorized!" });
  }
);

export default router;
