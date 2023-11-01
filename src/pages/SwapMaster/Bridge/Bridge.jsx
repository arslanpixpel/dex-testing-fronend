import React, { useState } from "react";
import { SwapDirectionIcon } from "../icons/SwapDirectionIcon";
// import DropDownButton from "../../../components/DropDown/DropDownButton";
// import ImageDropDownButton from "../../../components/DropDown/ImageDropDownButton";
import { ArrowIcon } from "../../../components/TokenSelectInput/icons";
import EthereumIcon from "../../../asssets/images/ethereum-icon.svg";
import concordiumicon from "../../../asssets/images/concordium-icon.svg";
//import DepositeModel from "./DepositeModel";

const Bridge = () => {
  const [convert, setConvert] = useState(false);
  //const [depositeModel, setDepositeModel] = useState(false);

  const handleConvert = () => {
    setConvert(!convert);
  };

  // const handledepositemodelclose = () => {
  //   setDepositeModel(false);
  // };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-6">
        <div className="flex flex-col sm:p-[50px] xs:p-[40px] 1xs:p-[30px] 2xs:p-[20px] p-[10px] bg-app-black rounded-xl">
          <div className="flex flex-col justify-between 2xs:flex-row">
            <div className="text-lg font-semibold ">From</div>
            <div className="flex flex-row items-center text-gray-600"></div>
          </div>
          {convert ? (
            <div className="flex flex-row items-center justify-between h-16 py-[30px] pl-2 mt-3 rounded-lg xs:pl-8 bg-app-black-button">
              <div className="flex flex-row items-center justify-between ">
                <div className="flex flex-col gap-2 w-[220px] ">
                  <div className="flex gap-2 -ml-3">
                    <img src={concordiumicon} alt="" width={20} height={20} />
                    <p className="font-medium leading-normal">CONCODIUM</p>
                  </div>
                </div>
                <input className="w-full text-xs bg-app-black-button placeholder:text-gray-400 xs:placeholder:text-base" />
              </div>
              <div className="flex-none mr-4 ">
                <ArrowIcon />
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-between h-16 py-[30px] pl-4 mt-3 rounded-lg xs:pl-8 bg-app-black-button">
              <div className="flex flex-row items-center justify-between ">
                <div className="flex flex-col gap-2 w-[200px] ">
                  <div className="flex gap-2 -ml-3">
                    <img src={EthereumIcon} alt="" width={20} height={20} />
                    <p className="font-medium leading-normal">ETHEREUM</p>
                  </div>
                </div>
                <input className="w-full text-xs bg-app-black-button placeholder:text-gray-400 xs:placeholder:text-base" />
              </div>
              <div className="flex-none mr-4 cursor-pointer ">
                <ArrowIcon />
              </div>
            </div>
          )}
          <div className="flex flex-row  justify-center mx-auto bg-app-blue-second rounded-md  cursor-pointer hover:bg-[#50D0FB] py-[12px] px-[78px] w-20 mt-4 ">
            <button>Connect</button>
          </div>
          <div className="flex justify-center w-full mt-[25px] -mb-10">
            <div
              className="flex items-center justify-center rounded-full cursor-pointer full bg-app-black-button hover:bg-[#717A8B]"
              style={{ marginBottom: "10px", width: "53px", height: "53px" }}
              onClick={() => {
                handleConvert();
              }}
            >
              <SwapDirectionIcon />
            </div>
          </div>
          {convert ? (
            <div className="flex flex-col mt-4 border-app-block">
              <div className="flex flex-row justify-start gap-2 mt-5">
                <div className="text-lg font-semibold ">To</div>
              </div>
              <div className="flex flex-col justify-start  mt-3 sm:flex-row">
                <div className="flex flex-row items-center justify-between w-full h-16 pl-8 rounded-lg bg-app-black-button py-[30px]">
                  <div className="flex flex-col gap-2 w-[200px] ">
                    <div className="flex gap-2 -ml-3">
                      <img src={EthereumIcon} alt="" width={20} height={20} />
                      <p className="font-medium leading-normal">ETHEREUM</p>
                    </div>
                    {/* <div className="bg-app-blue-second rounded-md text-center cursor-pointer w-32 hover:bg-[#50D0FB]">
                    <button>Connect</button>
                  </div> */}
                  </div>
                  <div className="w-3/4">
                    <input className="w-full bg-app-black-button" />
                  </div>
                  <div className="flex-none mr-4 cursor-pointer ">
                    <ArrowIcon />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col mt-4 border-app-block">
              <div className="flex flex-row justify-start gap-2 mt-5">
                <div className="text-lg font-semibold ">To</div>
              </div>
              <div className="flex flex-col justify-start  mt-3 sm:flex-row">
                <div className="flex flex-row items-center justify-between w-full h-16 pl-8 rounded-lg bg-app-black-button py-[30px]">
                  <div className="flex flex-col gap-2 w-[200px] ">
                    <div className="flex gap-2 -ml-3">
                      <img src={concordiumicon} alt="" width={20} height={20} />
                      <p className="font-medium leading-normal">CONCODIUM</p>
                    </div>
                    {/* <div className="bg-app-blue-second rounded-md text-center cursor-pointer w-32 hover:bg-[#50D0FB]">
                    <button>Connect</button>
                  </div> */}
                  </div>
                  <div className="w-3/4">
                    <input className="w-full bg-app-black-button" />
                  </div>
                  <div className="flex-none mr-4 cursor-pointer ">
                    <ArrowIcon />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-row  justify-center mx-auto bg-app-blue-second rounded-md  cursor-pointer hover:bg-[#50D0FB] py-[12px] px-[78px] w-20 my-4">
            <button>Connect</button>
          </div>

          <div className="flex flex-row items-center justify-between h-16 pl-8  rounded-lg bg-app-black-button py-[50px]">
            <div className="flex flex-col gap-2 ">
              <div className="flex flex-row w-40 gap-2">
                <p>Select Token</p>
                <ArrowIcon />
              </div>
              <div>
                <div className="text-3xl">0</div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between w-3/4">
              <input className="w-full bg-app-black-button xs:placeholder:text-base placeholder:text-xs placeholder:text-gray-400" />
            </div>
            <h1 className="text-cyan-600 font-bold mr-4 -mt-10 cursor-pointer">Max</h1>
          </div>

          <div className="flex items-center justify-center h-16 mt-5 rounded-md cursor-pointer bg-app-blue hover:bg-[#50D0FB] ">
            <button
              className="text-lg"
              // onClick={() => {
              //   setDepositeModel(true);
              // }}
            >
              {convert ? "Deposit" : " Withdraw"}
            </button>
          </div>
        </div>
        <div className="flex  justify-center items-center px-[21px] py-[10px] bg-[#29313C] rounded-xl mt-10 w-[263px] font-normal  ">
          <button>TRANSACTION HISTORY</button>
        </div>
      </div>
      {/* {depositeModel && (
        <div className="flex flex-col items-center">
          <DepositeModel onClose={handledepositemodelclose} />
        </div>
      )} */}
    </>
  );
};

export default Bridge;
