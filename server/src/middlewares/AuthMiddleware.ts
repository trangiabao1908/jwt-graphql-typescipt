import { AuthenticationError } from "type-graphql";
import { Context } from "./../types/Context";
import { MiddlewareFn } from "type-graphql/build/typings/typings/Middleware";
import jwt, { Secret } from "jsonwebtoken";
import { AuthPayloadType } from "src/types/AuthPayloadType";
export const AuthMiddleware: MiddlewareFn<Context> = async (
  { context },
  next
) => {
  try {
    const accessTokenHeader = context.req.header("Authorization");
    const accessToken = accessTokenHeader && accessTokenHeader.split(" ")[1];
    if (!accessToken) {
      throw new AuthenticationError("Not authenticated");
    }
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESSTOKEN_SECRET as Secret
    ) as AuthPayloadType;
    context.user = decoded;
    return next();
  } catch (err) {
    throw new AuthenticationError(`Failed to authenticate, ${err.message}`);
  }
};
