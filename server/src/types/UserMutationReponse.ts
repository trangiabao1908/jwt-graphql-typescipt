import { Field, ObjectType } from "type-graphql";
import { IMutationResponse } from "./MutatationReponse";
import { User } from "../entities/User";
@ObjectType({ implements: IMutationResponse })
export class UserMutationResponse implements IMutationResponse {
  code: number;
  success: boolean;
  message?: string;

  @Field((_type) => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  accessToken?: string;
}
