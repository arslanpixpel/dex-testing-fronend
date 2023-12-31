import React, { useState } from "react";
import { gamingList } from "../dataList";
import SwapButton from "../StartAccount/SwapButton";
import BuyButton from "../StartAccount/BuyButton";
import TradeButton from "../StartAccount/TradeButton";
import WithdrawModal from "../Modal/WithdrawModal";
import TransferModal from "../Modal/TransferModal";
import { useAppContext } from "../../../contexts/AppContext";

const GamingTable = () => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const context = useAppContext();

  const handleDepositClick = () => {
    context.setSelectedIndex(1);
  };

  const handleTransferClick = () => {
    setShowTransferModal(true);
  };

  const handleWithdrawClick = () => {
    setShowWithdrawModal(true);
  };

  return (
    <div>
      <div className="overflow-x-auto relative w-full mt-10">
        <table className="table-auto text-left">
          <thead>
            <tr>
              <td className="text-gray-400 px-6">Coin</td>
              <td className="text-gray-400 px-6">Game</td>
              <td className="text-gray-400 px-6">Rewards</td>
              <td className="text-gray-400 px-6">Deposits</td>
              <td className="text-gray-400 px-6">Available</td>
              <td className="flex gap-1 px-6">
                <div className="text-gray-400">DAW</div>
                <svg
                  className="h-5 w-5 text-gray-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {" "}
                  <path stroke="none" d="M0 0h24v24H0z" /> <circle cx="12" cy="12" r="9" />{" "}
                  <line x1="12" y1="17" x2="12" y2="17.01" />{" "}
                  <path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4" />
                </svg>
              </td>
              <td className="text-gray-400 w-1/6 px-6">Action</td>
            </tr>
          </thead>
          <tbody>
            {gamingList.map((menu, idx) => {
              return (
                <tr
                  key={idx}
                  className={idx !== gamingList.length - 1 ? "border-b-2 border-app-black" : ""}
                >
                  <td className="py-5 px-6">
                    <div className="w-max">{menu.coin}</div>
                  </td>
                  <td className="px-6">
                    <div className="w-max">{menu.game}</div>
                  </td>
                  <td className="px-6">
                    <div className="w-max">{menu.reward}</div>
                  </td>
                  <td className="px-6">
                    <div className="w-max">{menu.deposit}</div>
                  </td>
                  <td className="px-6">
                    <div className="w-max">{menu.available}</div>
                  </td>
                  <td className="px-6">
                    <div className="w-max">{menu.daw}</div>
                  </td>
                  <td className="px-6">
                    <div className="flex gap-4">
                      <BuyButton title="Deposit" handleClick={handleDepositClick} />
                      <TradeButton title="Withdraw" handleClick={handleWithdrawClick} />
                      <SwapButton title="Transfer" handleClick={handleTransferClick} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {<WithdrawModal showModal={showWithdrawModal} setShowModal={setShowWithdrawModal} />}
      {<TransferModal showModal={showTransferModal} setShowModal={setShowTransferModal} />}
    </div>
  );
};

export default GamingTable;
