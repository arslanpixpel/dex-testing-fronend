import React from "react";

const TokenButton = ({ handleClick, title, idx, selected }) => {
  const className = "rounded-md hover:bg-app-blue active:bg-app-black-light cursor-pointer";

  return (
    <div
      className={className + (selected ? " bg-app-blue" : " bg-app-black-button")}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center gap-2 xl:px-8 lg:px-6 px-4 py-3">
        {title}
      </div>
    </div>
  );
};

export default TokenButton;
