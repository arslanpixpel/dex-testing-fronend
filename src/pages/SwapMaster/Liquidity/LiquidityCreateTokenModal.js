import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

// Constants
import { LIQUIDITY_ADD_TOKEN_FORM_FIELDS, LIQUIDITY_ADD_TOKEN_FORM_ID } from "./constants";

// Components
import Loader from "../../../components/Loader/Loader";
import { MainButton } from "../../../components/Button/MainButton";
import Input from "../../../components/Input/Input";
import { LineIcon } from "../../../components/TokenSelectInput/icons";

// Utils
import { pixpelRequest } from "../../../utils/axios";
import { validationCreatTokenSchema } from "./validationSchema";
import { capitalizeString, getModalOverflow } from "../../../utils/common";
import { getTokenList } from "../utils";

// Hooks
import { useLiquidityInputsHandlers } from "./hooks";

// Actions
import { setIsLiquidityModalOpen } from "../../../store/reducers/SwapMaster/liquiditySlice";

const LiquidityCreateTokenModal = () => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const isShowModal = useSelector(s => s.liquidity.modals.createToken.isOpen);
  const modalData = useSelector(s => s.liquidity.modals.createToken.modalData);
  const methods = useForm({
    defaultValues: {
      [LIQUIDITY_ADD_TOKEN_FORM_FIELDS.tokenIndex]: "",
      [LIQUIDITY_ADD_TOKEN_FORM_FIELDS.tokenId]: "",
    },
    resolver: yupResolver(validationCreatTokenSchema),
    mode: "all",
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
    setValue,
    setError,
  } = methods;
  const { onAddTokenInput } = useLiquidityInputsHandlers({
    setValue,
  });

  if (!isShowModal) return null;

  const closeModal = () => {
    dispatch(setIsLiquidityModalOpen({ modal: "createToken", isOpen: false }));
    setIsSuccess(false);
    reset();
    setIsProcessing(false);
  };

  const errorMessage = Object.values(errors)
    .map(({ message }) => message)
    .join(", ");

  const handeSetIsSuccess = () => {
    setIsSuccess(false);
    reset();
    dispatch(
      setIsLiquidityModalOpen({
        modal: "createToken",
        isOpen: false,
      }),
    );
  };

  const onSubmit = async data => {
    const { tokenId, tokenIndex } = data;
    const request = {
      tokenIndex: tokenIndex.toString(),
      tokenId,
    };

    try {
      setIsProcessing(true);
      const response = await pixpelRequest.post("/tokens/add", request);
      dispatch(getTokenList());
      setIsProcessing(false);
      setIsSuccess(true);
      dispatch(
        setIsLiquidityModalOpen({
          modal: "createToken",
          isOpen: true,
          modalData: response.data.response,
        }),
      );
    } catch (err) {
      setIsProcessing(false);
      setError("tokenId", { type: "custom", message: err.response.data.message });

      return [];
    }
  };

  return (
    <div className={`fixed inset-0 z-10 ${getModalOverflow()}`}>
      <div className="fixed inset-0 w-full h-full bg-black opacity-40" onClick={closeModal} />
      <div className="flex items-center min-h-screen px-5 py-8">
        <div className="relative flex flex-col w-full sm:p-[50px] xs:p-[40px] 1xs:p-[30px] 2xs:p-[20px] p-[10px] mx-auto md1:text-lg 2xs:text-sm bg-app-black-modal rounded-xl md1:w-125">
          <div className="flex mb-5">
            <div className="text-xl font-medium 2xs:text-2xl">
              {isSuccess ? "Success Added Token" : "Add Token"}
            </div>
          </div>
          <div className={"flex-auto bg-app-black-modal"}>
            {isSuccess ? (
              <>
                <div className="flex flex-col gap-1 px-3 py-2 rounded-md 2xs:py-5 2xs:px-7 bg-app-black mb-7">
                  <div className="flex flex-row gap-3 1xs:justify-between 2xs:w-auto">
                    <div className="flex 1xs:w-26 ">
                      <div className="text-xs font-medium 2xs:text-base text-slate-400">Token</div>
                    </div>
                    <div className="flex w-56">
                      <div className="text-xs font-medium 2xs:text-base">{modalData.symbol}</div>
                    </div>
                  </div>
                </div>
                <MainButton
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center rounded-md cursor-pointer h-14 bg-app-green hover:bg-app-green disabled:cursor-wait"
                  onClick={handeSetIsSuccess}
                >
                  {isProcessing && <Loader size="md" />}
                  <div className="text-lg font-medium">Close</div>
                </MainButton>
              </>
            ) : (
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} id={LIQUIDITY_ADD_TOKEN_FORM_ID}>
                  <div className="flex flex-row items-center w-full h-16 rounded bg-app-black-button mb-8">
                    <div className="h-16 px-5 flex items-center">Contract Index</div>
                    <div className="flex">
                      <LineIcon />
                    </div>
                    <div className={"flex-auto bg-app-black-button"}>
                      <Input
                        name={LIQUIDITY_ADD_TOKEN_FORM_FIELDS.tokenIndex}
                        className={"w-full h-14 bg-app-black-button input-autofill"}
                        placeholder="1234"
                        onInput={onAddTokenInput}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row items-center w-full h-16 rounded bg-app-black-button mb-8">
                    <div className="h-16 px-5 flex items-center">Token Id</div>
                    <div className="flex">
                      <LineIcon />
                    </div>
                    <div className={"flex-auto bg-app-black-button"}>
                      <Input
                        name={LIQUIDITY_ADD_TOKEN_FORM_FIELDS.tokenId}
                        className={"w-full h-14 bg-app-black-button input-autofill"}
                        placeholder="empty or HEX"
                        onInput={onAddTokenInput}
                      />
                    </div>
                  </div>
                  <MainButton
                    type="submit"
                    disabled={!!errorMessage || isSubmitting}
                    className="w-full p-4 h-14 mt-5 bg-app-green hover:bg-app-green text-lg disabled:bg-app-black-button"
                    form={LIQUIDITY_ADD_TOKEN_FORM_ID}
                  >
                    {isProcessing && <Loader size="md" />}
                    {capitalizeString(errorMessage) || "Supply"}
                  </MainButton>
                </form>
              </FormProvider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityCreateTokenModal;
