import React, { useState } from "react";
import BuyModal from "../Wallet/Modal/BuyModal";

const BuyButton = props => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-app-green rounded-md hover:cursor-pointer w-32">
        <div
          className="flex items-center gap-2 h-10 px-4 justify-center"
          onClick={() => {
            setShowModal(true);
          }}
        >
          {props.title}
        </div>
      </div>
      {<BuyModal showModal={showModal} setShowModal={setShowModal} />}
    </>
  );
};

export default BuyButton;
