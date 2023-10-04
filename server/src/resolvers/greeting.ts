import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { Context } from "../types/Context";
import { User } from "../entities/User";
@Resolver()
export class GreetingResolver {
  @Query(() => String)
  @UseMiddleware(AuthMiddleware)
  async hello(@Ctx() ctx: Context): Promise<string> {
    const { user } = ctx;
    const userFound = await User.findOne({
      where: {
        id: user.userId,
      },
    });
    return `Hello ${userFound ? userFound.username : "World"}`;
  }
}
