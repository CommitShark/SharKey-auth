import { type Request, type Express } from "express";
import CustomUser from "../../models/User";

declare global {
  namespace Express {
    export interface Request {
      userData: CustomUser;
    }
  }
}
