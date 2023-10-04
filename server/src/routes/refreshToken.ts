import express from "express";
require("dotenv").config();
import jwt, { Secret } from "jsonwebtoken";
import { AuthPayloadType } from "../types/AuthPayloadType";
import { User } from "../entities/User";
import { createRefreshToken, createToken } from "../utils/authToken";

const router = express.Router();

router.get("/", async (req, res) => {
  const refreshToken = req.cookies[process.env.REFRESH_TOKEN_NAME as string];

  if (!refreshToken) return res.sendStatus(401);
  try {
    console.log(process.env.REFRESH_TOKEN_SECRET);
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as Secret
    ) as AuthPayloadType;
    const existingUser = await User.findOne({
      where: {
        id: decoded.userId,
      },
    });
    if (!existingUser || existingUser.tokenVersion !== decoded.tokenVersion) {
      return res.sendStatus(401);
    }
    createRefreshToken(res, existingUser);
    return res.json({
      success: true,
      accessToken: createToken("accessToken", existingUser),
    });
  } catch (err) {
    console.log(err.message);
    return res.sendStatus(403);
  }
});
export default router;
