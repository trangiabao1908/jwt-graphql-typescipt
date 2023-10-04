import { User } from "../entities/User";
import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { RegisterInput } from "../types/RegisterInput";
import argon2 from "argon2";
import { UserMutationResponse } from "../types/UserMutationReponse";
import { LoginInput } from "../types/LoginInput";
import { createRefreshToken, createToken } from "../utils/authToken";
import { Context } from "../types/Context";
@Resolver(UserMutationResponse)
export class UserResolver {
  @Query(() => [User])
  async getAllUser(): Promise<User[]> {
    const users = await User.find();
    return users;
  }
  @Mutation(() => UserMutationResponse)
  async register(
    @Arg("registerInput")
    registerInput: RegisterInput
  ): Promise<UserMutationResponse> {
    const { username, password } = registerInput;
    if (!username || !password) {
      return {
        code: 400,
        success: false,
        message: "Please enter a username or password",
      };
    }
    const existingUser = await User.findOne({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      return {
        code: 400,
        success: false,
        message: "Username already exists",
      };
    }
    const hash = await argon2.hash(password);
    const newUser = User.create({
      username,
      password: hash,
    });
    await newUser.save();

    return {
      code: 200,
      success: true,
      message: "User registered successfully",
      user: newUser,
    };
  }

  @Mutation(() => UserMutationResponse)
  async login(
    @Arg("loginInput")
    loginInput: LoginInput,
    @Ctx() { res }: Context
  ): Promise<UserMutationResponse> {
    try {
      const { username, password } = loginInput;
      const existingUser = await User.findOne({
        where: {
          username,
        },
      });
      if (!existingUser) {
        return {
          code: 400,
          success: false,
          message: "User not found",
        };
      }
      const isvalidPassword = await argon2.verify(
        existingUser.password,
        password
      );
      if (!isvalidPassword) {
        return {
          code: 400,
          success: false,
          message: "Wrong Password",
        };
      }
      createRefreshToken(res, existingUser);
      return {
        code: 200,
        success: true,
        message: "Login successful",
        user: existingUser,
        accessToken: createToken("accessToken", existingUser),
      };
    } catch (error) {
      console.log(error);
      throw new Error("Something is Wrong!");
    }
  }

  @Mutation(() => UserMutationResponse)
  async logout(
    @Arg("userId", (_type) => ID) userId: number,
    @Ctx() { res }: Context
  ): Promise<UserMutationResponse> {
    const existinguser = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!existinguser) {
      return {
        code: 400,
        success: false,
      };
    }
    existinguser.tokenVersion += 1;
    await existinguser.save();
    res.clearCookie(process.env.REFRESH_TOKEN_NAME as string, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/refresh_token",
    });
    return {
      code: 200,
      success: true,
    };
  }
}
