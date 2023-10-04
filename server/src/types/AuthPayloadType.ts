import { JwtPayload } from "jsonwebtoken";

export type AuthPayloadType = JwtPayload & {
  userId: number;
  tokenVersion: number;
};
