import { getError } from "./getError";
import { validateSync, ValidationError } from "class-validator";
import Account from "../classes/account";
import { plainToClass } from "class-transformer";

export const accountValidation = (accountRequest: Account): void => {
  const validationErrors: ValidationError[] = validateSync(
    plainToClass(Account, accountRequest)
  );
  if (validationErrors.length) {
    throw getError(validationErrors);
  }
};
