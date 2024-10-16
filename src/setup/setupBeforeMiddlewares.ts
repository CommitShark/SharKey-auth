import { type Application } from "express";
import morgan_config from "../config/morgan.config";

export default function setupBeforeMiddlewares(app: Application): void {
  app.use(morgan_config);
}
