import React from "react";
//import EthereumIcon from "../../asssets/images/ethereum-icon.svg";
import bitcoin from "../../asssets/images/UserHome/bnb.png";

function Poolcard() {
  return (
    <div className="flex justify-center">
      <div
        className={`flex flex-col mb-[120px] rounded-md w-155 2xl:w-155 xl:w-155 bg-app-black sm:p-[50px] xs:p-[40px] 1xs:p-[30px] 2xs:p-[20px] p-[10px]`}
      >
        <p className="text-[24px] font-medium leading-normal  ">You are creating a pool</p>
        <div className="flex gap-4 my-2 mt-8 items-center">
          <div>
            <img src={bitcoin} alt="" />
          </div>
          <p className="text-[48px] font-medium leading-normal">BNB/PIXP</p>
        </div>
        <div className="flex flex-col gap-2 mt-5 text-sm">
          <div className="flex bg-app-black-button p-4 px-6 rounded flex-row justify-between">
            <p>BNB Deposited</p>
            <p className="text-app-blue">0.103576</p>
          </div>
          <div className="flex bg-app-black-button p-4 px-6 rounded flex-row justify-between">
            <p>PIXP Deposited</p>
            <p className="text-app-blue">20</p>
          </div>
          <div className="flex bg-app-black-button p-4 px-6 rounded flex-row justify-between">
            <p>Rates</p>
            <div className="flex flex-col text-end">
              <p className="text-app-blue">1 BNB = 193.1 PIXP</p>
              <p className="text-app-blue">1 PIXP = 0.005179 BNB</p>
            </div>
          </div>
          <div className="flex bg-app-black-button p-4 px-6 rounded flex-row justify-between">
            <p>Share of Pool</p>
            <p className="text-app-blue">100%</p>
          </div>
        </div>
        <button
          type="submit"
          className="p-4 h-16 mt-5 bg-[#2EBD85] rounded text-[18px] font-medium leading-normal hover:bg-[#1FF19F]"
        >
          Create Pool & Supply
        </button>
      </div>
    </div>
  );
}

export default Poolcard;
