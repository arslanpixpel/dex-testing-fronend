import React, { useState, useEffect } from "react";

const DropDownButton = ({ initialContent, contentList, fontSize, textColor, backgroundColor }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [selectedContent, setSelectedContent] = useState(initialContent);
  const [bgColor, setBgColor] = useState("bg-app-black");
  const [font, setFont] = useState("");

  useEffect(() => {
    setFont(fontSize);
  }, [fontSize]);

  useEffect(() => {
    setBgColor(backgroundColor);
  }, [backgroundColor]);

  const handleDropDown = () => {
    if (showDropDown) {
      setShowDropDown(false);
    } else {
      setShowDropDown(true);
    }
  };

  const selectHandleClick = contentTitle => {
    setSelectedContent(contentTitle);
    setShowDropDown(false);
  };

  return (
    <>
      <div
        className={"cursor-pointer " + bgColor + (showDropDown ? " rounded-t" : " rounded")}
        onClick={handleDropDown}
      >
        <div className="flex px-1 rounded-xl gap-28 items-center justify-between py-4 w-full">
          <div className={font + " font-medium " + textColor}>{selectedContent}</div>
          <div className="flex">
            {/* <svg
              className="w-full h-7 text-gray-700 scroll-m-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="7"
              viewBox="0 0 11 7"
              fill="none"
            >
              <path
                d="M1 1L5.5 5.5L10 1"
                stroke="#717A8B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="relative">
          {showDropDown === true ? (
            <div className="absolute inset-0 z-10">
              <div className="fixed inset-0 w-full h-full" onClick={handleDropDown}></div>
              <div className={bgColor + " flex flex-col rounded-b-xl  overflow-y-scroll max-h-44"}>
                {contentList.map((content, idx) => {
                  return (
                    <div
                      key={idx}
                      className="relative flex justify-start px-5 py-5"
                      onClick={() => {
                        selectHandleClick(content.title);
                      }}
                    >
                      <div className={"text-base font-medium hover:text-app-blue " + textColor}>
                        {content.title}
                      </div>
                      {idx !== contentList.length - 1 && (
                        <div className="absolute left-0 right-0 bottom-0 h-1 bg-[#717A8B] rounded-b-lg"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default DropDownButton;
