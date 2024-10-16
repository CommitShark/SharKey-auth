import { ResultFactory, validationResult } from "express-validator";

export const myValidationResult: ResultFactory<string> =
  validationResult.withDefaults({
    formatter: (error) => error.msg as string,
  });
