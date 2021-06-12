import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsNumber,
  IsPositive,
  Equals,
} from "class-validator";
export default class Transfer {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  fromAccountId!: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  toAccountId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  ammount!: number;

  @IsNotEmpty()
  @IsString()
  @Equals("RON")
  currency!: string;
}
