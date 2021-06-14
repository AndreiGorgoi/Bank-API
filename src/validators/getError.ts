import { ValidationError } from "class-validator";
import ErrorResponse from "../classes/errorResponse";
export const getError = (validationErrors: ValidationError[]): any => {
  validationErrors.map((validationError: ValidationError) => {
    validationError.constraints
      ? validationError.constraints
      : getError(validationError.children);
  });
};
