import {
  Equals,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";

export default class Account {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  customerId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Equals(100)
  ammount!: number;

  @IsNotEmpty()
  @IsString()
  @Equals("RON")
  currency!: string;
}
