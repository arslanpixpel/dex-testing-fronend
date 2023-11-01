import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";

// Components
import Input from "../Input/Input";

// Hooks
import { useOutsideClick } from "../../hooks/useOutsideClick";

// Utils
import { getShortTokenName } from "../../utils/format";
import { isSameToken } from "../../pages/SwapMaster/utils";

// Actions
import { setIsLiquidityModalOpen } from "../../store/reducers/SwapMaster/liquiditySlice";

// Icons
import { LineIcon, ArrowIcon } from "./icons";

const TokenSelectInput = ({
  name,
  selectedToken,
  disabledToken,
  onTokenSelect,
  tokenList,
  isWithMaxButton = false,
  onMaxHandler,
  backgroundColor = "bg-app-black",
  readOnly,
  isSelectDisabled = false,
  onInput,
  isAddToken = false,
}) => {
  const dispatch = useDispatch();
  const [isDropDownOpened, setIsDropDownOpened] = useState(false);
  const dropDownRef = useRef();

  const toggleDropDown = useCallback(() => {
    setIsDropDownOpened(prevOpened => !prevOpened);
  }, []);

  const selectHandleClick = content => {
    onTokenSelect?.(content);
  };

  const closeDropDown = useCallback(() => {
    if (isDropDownOpened) {
      setIsDropDownOpened(false);
    }
  }, [isDropDownOpened]);

  const handleOpenCreateTokenModal = () => {
    dispatch(
      setIsLiquidityModalOpen({
        modal: "createToken",
        isOpen: true,
      }),
    );
  };

  useOutsideClick(dropDownRef, closeDropDown);

  return (
    <div
      className={"flex flex-row items-center w-full h-16 rounded cursor-pointer " + backgroundColor}
      ref={dropDownRef}
    >
      <div className="flex-none">
        <div
          className={(isDropDownOpened ? "rounded-t-md " : "rounded-md ") + backgroundColor}
          onClick={isSelectDisabled ? undefined : toggleDropDown}
        >
          <div className="flex flex-row h-16 px-5 py-5">
            <div className="flex flex-row" title={selectedToken.symbol}>
              <img
                className="w-6 h-6"
                src={
                  selectedToken.images?.thumbnail?.url ||
                  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                }
                alt=""
              />
              <div className="mx-1 text-base font-medium">
                {getShortTokenName(selectedToken.symbol)}
              </div>
            </div>
            <div
              className={classNames("flex", {
                "opacity-0": isSelectDisabled,
              })}
            >
              <ArrowIcon />
            </div>
          </div>
          <div className="relative">
            {isDropDownOpened && (
              <div className="absolute inset-0 z-10">
                <div className={"flex flex-col w-64 rounded-b-md " + backgroundColor}>
                  {isAddToken && (
                    <button
                      type="button"
                      className={
                        backgroundColor +
                        " relative flex flex-row items-center justify-start gap-5 px-5 pt-3 disabled:opacity-50 text-app-blue font-medium"
                      }
                      onClick={handleOpenCreateTokenModal}
                    >
                      + ADD TOKEN
                    </button>
                  )}
                  <div className="w-full px-5 mt-5 mb-3">
                    <div className="border-t w-full border-gray-500" />
                  </div>
                  {tokenList.map((content, idx) => {
                    const isDisabled = isSameToken(content, disabledToken);

                    return (
                      <button
                        key={idx}
                        disabled={isDisabled}
                        type="button"
                        className={
                          backgroundColor +
                          " relative flex flex-row items-center justify-start gap-5 px-5 py-3 disabled:opacity-50"
                        }
                        onClick={() => {
                          selectHandleClick(content);
                        }}
                        title={content.symbol}
                      >
                        <img className="h-6" src={content.images?.thumbnail?.url} alt="" />
                        <div
                          className={`text-base font-medium ${
                            isDisabled ? "" : "hover:text-app-blue"
                          }`}
                        >
                          {getShortTokenName(content.symbol)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex">
        <LineIcon />
      </div>
      <div className={"flex-auto " + backgroundColor}>
        <Input
          name={name}
          className={"w-full input-autofill " + backgroundColor}
          readOnly={readOnly}
          onInput={onInput}
        />
      </div>
      {isWithMaxButton && !!onMaxHandler && (
        <button
          type="button"
          className="flex mx-5 text-app-blue font-medium"
          onClick={onMaxHandler}
        >
          MAX
        </button>
      )}
    </div>
  );
};

export default TokenSelectInput;
