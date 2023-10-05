import argon2 from "argon2";
import {
  Arg,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
  createUnionType,
} from "type-graphql";
import { User } from "../entities/User";
import { Context } from "../types/Context";
import { LoginInput } from "../types/LoginInput";
import { RegisterInput } from "../types/RegisterInput";
import { UserMutationResponse } from "../types/UserMutationReponse";
import { createRefreshToken, createToken } from "../utils/authToken";
import { Like } from "typeorm";

const SearchResultUnion = createUnionType({
  name: "SearchResult",
  types: () => [User] as const,
  resolveType: (value) => {
    if ("username" in value) {
      return "User";
    }
    return undefined;
  },
});

@Resolver(UserMutationResponse)
export class UserResolver {
  @Query(() => [User])
  async getAllUser(): Promise<User[]> {
    const users = await User.find();
    return users;
  }
  @Query(() => [SearchResultUnion])
  async search(
    @Arg("pharse") pharse: string
  ): Promise<Array<typeof SearchResultUnion>> {
    try {
      if (pharse !== "") {
        const names = await User.find({
          where: {
            username: Like(`%${pharse}%`),
          },
        });
        return [...names];
      }
      return [];
    } catch (err) {
      console.log(err);
      throw new Error("Could not find user");
    }
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
