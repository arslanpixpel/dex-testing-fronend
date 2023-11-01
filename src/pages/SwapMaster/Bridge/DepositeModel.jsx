import React from "react";
import ethereum from "../../../asssets/images/ethereum-icon.svg";

function DepositeModel({ onClose }) {
  return (
    <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
      <div className="flex flex-col mb-20 rounded-md w-155 2xl:w-155 xl:w-155 bg-app-black p-10">
        <p className="text-2xl font-medium leading-normal">
          Deposit may take up to 5 minutes to complete.
        </p>
        <div className="flex gap-4 mt-14">
          <p className="text-xl font-medium leading-normal">Transactions Required:</p>
        </div>
        <div className="flex gap-4 mt-6">
          <img src={ethereum} width={40} height={40} />
          <p className="text-xl font-medium leading-normal">Deposit ETH</p>
          <p className="text-xl font-medium leading-normal text-blue-300">
            0.0051418 ETH (10.5185 USD)
          </p>
        </div>

        <div className="flex flex-row gap-10 justify-center mt-20">
          <button
            type="submit"
            className="py-4 px-20    h-16 mt-5 bg-[#37404C] rounded text-[18px] font-medium leading-normal "
            onClick={onClose}
          >
            CANCEL
          </button>

          <button
            type="submit"
            className="py-4 px-20  h-16 mt-5 bg-[#0196C9] rounded text-[18px] font-medium leading-normal "
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}

export default DepositeModel;
