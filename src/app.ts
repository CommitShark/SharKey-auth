import express from "express";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import dotenv from "dotenv";
import "./config/passport"; // Initialize passport strategies

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(morgan(process.env.NODE_ENV !== "production" ? "dev" : "combined"));

app.use(
  session({
    secret: process.env.JWT_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoutes);

export default app;
