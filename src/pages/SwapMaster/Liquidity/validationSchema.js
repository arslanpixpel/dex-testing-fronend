import * as yup from "yup";

// Utils
import { isHEX } from "../../../utils/format";

// Constants
import { LIQUIDITY_FORM_FIELDS, LIQUIDITY_ADD_TOKEN_FORM_FIELDS } from "./constants";
import { CCD_DECIMALS, PIXPEL_CONTRACT_ADDRESS } from "../../../config";

const baseInputSchema = yup
  .number()
  .transform((value, rawValue) => (rawValue === "" ? undefined : value))
  .positive()
  .test("TooManyDecimals", (value, { createError, options }) => {
    const { maxFromDecimals, maxToDecimals } = options.context;
    const decimalsByField = {
      [LIQUIDITY_FORM_FIELDS.from]: maxFromDecimals,
      [LIQUIDITY_FORM_FIELDS.to]: maxToDecimals,
      [LIQUIDITY_FORM_FIELDS.lp]: CCD_DECIMALS,
    };

    const maxDecimals = decimalsByField[options.path] || CCD_DECIMALS;
    const decimals = String(value).split?.(".")[1]?.length || 0;

    if (decimals > maxDecimals) {
      return createError({ message: `${options.path}: too many decimals` });
    }

    return true;
  });

const baseAddTokenIndexSchema = yup
  .number()
  .typeError("Contract Index must be an Integer")
  .required("Contract Index is required field")
  .transform((value, rawValue) => {
    return rawValue === "" ? undefined : value;
  })
  .positive()
  .test(
    "SwapContractIndex",
    "Contract Index cannot be the same as swap contract index",
    value => value !== Number(PIXPEL_CONTRACT_ADDRESS.index),
  );

const baseAddTokenIdSchema = yup
  .string()
  .test("HEX", "Token Id must be empty or hex", value => value === "" || isHEX(value));

export const validationSchema = yup.object().shape({
  [LIQUIDITY_FORM_FIELDS.lp]: baseInputSchema
    .test("Required", (value, { createError, options }) => {
      const isUnstakeMode = options.context.isUnstakeMode;

      if (!isUnstakeMode) return true;

      if (typeof value === "undefined") {
        return createError({ message: `${options.path} is required field` });
      }

      return true;
    })
    .test("Balance", "Not enough balance", (value, context) => {
      const { balanceLp, isUnstakeMode } = context.options.context;

      if (!isUnstakeMode) return true;

      return value <= balanceLp;
    }),
  [LIQUIDITY_FORM_FIELDS.from]: baseInputSchema
    .required()
    .test("Balance", "Not enough balance", (value, context) => {
      const { balanceFrom, isUnstakeMode } = context.options.context;

      if (isUnstakeMode) return true;

      return value <= balanceFrom;
    }),
  [LIQUIDITY_FORM_FIELDS.to]: baseInputSchema
    .required()
    .test("Balance", "Not enough balance", (value, context) => {
      const { balanceTo, isUnstakeMode } = context.options.context;

      if (isUnstakeMode) return true;

      return value <= balanceTo;
    }),
});

export const validationCreatTokenSchema = yup.object().shape({
  [LIQUIDITY_ADD_TOKEN_FORM_FIELDS.tokenIndex]: baseAddTokenIndexSchema,
  [LIQUIDITY_ADD_TOKEN_FORM_FIELDS.tokenId]: baseAddTokenIdSchema,
});
