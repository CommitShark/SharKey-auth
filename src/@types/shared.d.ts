import { Request } from "express";
import { User } from "../models/User";

interface ILocation {
  longitude: number;
  latitude: number;
}

interface JwtPayload {
  id: number;
  email: string;
  tokenVersion: number;
}
