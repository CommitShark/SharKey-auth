import { ILocation } from "./shared";

export interface ISignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ILoginInput {
  email: string;
  password: string;
  location?: ILocation;
}
