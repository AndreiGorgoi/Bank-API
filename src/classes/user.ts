import { IsNotEmpty, IsString } from "class-validator";

export default class User {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
