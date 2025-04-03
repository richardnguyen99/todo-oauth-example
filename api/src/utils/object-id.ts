import { isValidObjectId } from "mongoose";

export const isObjectId = (value: string | string[]): boolean => {
  // Check if the value is a string or an array of strings
  if (Array.isArray(value)) {
    return value.every((v) => isObjectId(v));
  } else if (typeof value === "string") {
    return isValidObjectId(value);
  }
  return false;
};
