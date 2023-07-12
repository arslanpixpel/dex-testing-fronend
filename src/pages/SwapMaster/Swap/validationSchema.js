import * as yup from "yup";
import { SWAP_FORM_FIELDS } from "./constants";

export const validationSchema = yup.object().shape({
  [SWAP_FORM_FIELDS.from]: yup
    .number()
    .transform((value, rawValue) => (rawValue === "" ? undefined : value))
    .required()
    .positive()
    .test("TooManyDecimals", (value, { createError, options }) => {
      const maxDecimals = options.context.maxFromDecimals;
      const decimals = String(value).split?.(".")[1]?.length || 0;

      if (decimals > maxDecimals) {
        return createError({ message: `${options.path}: too many decimals` });
      }

      return true;
    })
    .test("Balance", "Not enough balance", (value, { options }) => {
      const maxFromAmount = options.context.maxFromAmount;

      return value <= maxFromAmount;
    }),
});
