import { User } from "../entities/User";
import jwt, { Secret } from "jsonwebtoken";
import { Response } from "express";
require("dotenv").config();

export const createToken = (
  type: "accessToken" | "refreshToken",
  user: User
) => {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      ...(type === "refreshToken" ? { tokenVersion: user.tokenVersion } : {}),
    },
    type === "accessToken"
      ? (process.env.ACCESSTOKEN_SECRET as Secret)
      : (process.env.REFRESH_TOKEN_SECRET as Secret),
    {
      expiresIn: type === "accessToken" ? "15s" : "60m",
    }
  );
  return accessToken;
};
export const createRefreshToken = (res: Response, user: User) => {
  res.cookie(
    process.env.REFRESH_TOKEN_NAME as string,
    createToken("refreshToken", user),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/refresh_token",
    }
  );
};
