import { useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

// Components
import SwapForm from "./SwapForm";

// Utils
import { getMaxCcdAmount } from "./utils";

// Constants
import { SWAP_FORM_FIELDS } from "./constants";
import { validationSchema } from "./validationSchema";

const SwapFormContainer = () => {
  const balanceFrom = useSelector(s => s.swap.balance.from);
  const tokenFrom = useSelector(s => s.swap.tokenFrom);
  const isCCD = !tokenFrom.address;

  const methods = useForm({
    defaultValues: {
      [SWAP_FORM_FIELDS.from]: 0,
      [SWAP_FORM_FIELDS.to]: 0,
    },
    resolver: yupResolver(validationSchema),
    context: {
      maxFromAmount: isCCD ? getMaxCcdAmount(balanceFrom) : balanceFrom,
      maxFromDecimals: tokenFrom.decimals,
    },
    mode: "all",
  });

  return (
    <FormProvider {...methods}>
      <SwapForm />
    </FormProvider>
  );
};

export default SwapFormContainer;
