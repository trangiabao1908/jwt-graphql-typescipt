import { Request, Response } from "express";

import { AuthPayloadType } from "./AuthPayloadType";
export interface Context {
  req: Request;
  res: Response;
  user: AuthPayloadType;
}
