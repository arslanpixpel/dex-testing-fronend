// import React, { useState, useEffect } from "react";
// import { getShortTokenName } from "../../utils/format";

// const ImageDropDownButton = props => {
//   const [showDropDown, setShowDropDown] = useState(false);
//   const [selectedContent, setSelectedContent] = useState(props.initialContent);
//   const [bgColor, setBgColor] = useState("bg-app-black");

//   useEffect(() => {
//     setSelectedContent(props.initialContent);
//   }, [props.initialContent]);

//   useEffect(() => {
//     setBgColor(props.backgroundColor);
//   }, [props.backgroundColor]);

//   const handleDropDown = () => {
//     if (showDropDown) {
//       setShowDropDown(false);
//     } else {
//       setShowDropDown(true);
//     }
//   };

//   const selectHandleClick = content => {
//     setSelectedContent(content);
//     props.settokenFrom(content);
//     setShowDropDown(false);
//   };

//   return (
//     <div
//       className={
//         bgColor + (showDropDown ? " rounded-t-md" : " rounded-md") + " items-center cursor-pointer"
//       }
//       onClick={handleDropDown}
//     >
//       <div className="flex items-center justify-between px-6 py-4 rounded-md gap-2">
//         <div className="flex gap-2 h-3/5 items-center">
//           <img
//             src={selectedContent?.images?.thumbnail?.url}
//             alt=""
//             className="w-7 h-7 rounded-full"
//           />
//           <div className="text-base font-medium">{selectedContent?.symbol}</div>
//         </div>
//         <div className="flex items-center">
//           {/* <svg
//             className="w-7 h-7 text-gray-700"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//           </svg> */}
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="11"
//             height="7"
//             viewBox="0 0 11 7"
//             fill="none"
//           >
//             <path
//               d="M1 1L5.5 5.5L10 1"
//               stroke="#717A8B"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </div>
//       </div>
//       <div className="relative">
//         {showDropDown === true ? (
//           <div className="absolute inset-0 z-10">
//             <div className="fixed inset-0 w-full h-full" onClick={handleDropDown}></div>
//             <div className={bgColor + " flex flex-col rounded-b-md"}>
//               {props.contentList.map((content, idx) => {
//                 return (
//                   <div
//                     key={idx}
//                     className="relative flex flex-row items-center justify-start gap-1 px-30 py-5"
//                     onClick={() => {
//                       selectHandleClick(content);
//                     }}
//                   >
//                     <img className="h-7" src={content.images?.thumbnail?.url} alt="" />
//                     <div className="text-base font-medium hover:text-app-blue">{content.title}</div>
//                     <div className={`text-base font-medium ${"hover:text-app-blue"}`}>
//                       {getShortTokenName(content.symbol)}
//                     </div>
//                     {idx !== props.contentList.length - 1 && (
//                       <div className="absolute left-0 right-0 bottom-0 h-1 bg-[#717A8B] rounded-b-lg"></div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ) : null}
//       </div>
//     </div>
//   );
// };

// export default ImageDropDownButton;

import React, { useState, useEffect } from "react";
import { getShortTokenName } from "../../utils/format";
import { useSelector } from "react-redux";

const ImageDropDownButton = props => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [bgColor, setBgColor] = useState("bg-app-black");
  const tokenTo = useSelector(s => s.swap.limitdata.tokenTo);
  const tokenFrom = useSelector(s => s.swap.limitdata.tokenFrom);

  useEffect(() => {
    setBgColor(props.backgroundColor);
  }, [props.backgroundColor]);

  const handleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  const selectHandleClick = content => {
    if (props.dropdownType === "from") {
      props.setSelectedTokenFrom(content);
    } else if (props.dropdownType === "to") {
      props.setSelectedTokenTo(content);
    }

    setShowDropDown(false);
  };

  return (
    <div
      className={
        bgColor + (showDropDown ? " rounded-t-md" : " rounded-md") + " items-center cursor-pointer"
      }
      onClick={handleDropDown}
    >
      <div className="flex items-center justify-between px-6 py-4 rounded-md gap-2">
        <div className="flex gap-2 h-3/5 items-center">
          <img
            src={
              props.dropdownType === "from"
                ? tokenFrom?.images?.thumbnail?.url
                : // ? tokenFrom.images?.thumbnail.url
                  // : props.initialContent.images.thumbnail.url
                  tokenTo?.images?.thumbnail?.url
              // ? tokenTo?.images?.thumbnail?.url
              // : props.initialContent2?.images?.thumbnail?.url
            }
            alt=""
            className="w-7 h-7 rounded-full"
          />
          <div className="text-base font-medium">
            {getShortTokenName(
              props.dropdownType === "from"
                ? tokenFrom?.symbol
                : // ? tokenFrom?.symbol
                  // : props.initialContent?.symbol
                  tokenTo?.symbol,
              // ? tokenTo?.symbol
              // : props.initialContent2?.symbol
            )}
          </div>
        </div>
        <div className="flex items-center">
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
          <div className="absolute inset-0 z-10 min-w-max ml-[-140px]">
            <div className="fixed inset-0 w-full h-full" onClick={handleDropDown}></div>
            <div className={bgColor + " flex flex-col rounded-b-md "}>
              {props.contentList.map((content, idx) => {
                return (
                  <div
                    key={idx}
                    className="relative flex flex-row items-center justify-start gap-1 py-5 pl-2 pr-2 "
                    onClick={() => {
                      selectHandleClick(content);
                    }}
                  >
                    <img className="h-7" src={content?.images?.thumbnail?.url} alt="" />
                    <div className="text-base font-medium hover:text-app-blue">{content.title}</div>
                    <div className={`text-base font-medium ${"hover:text-app-blue"}`}>
                      {getShortTokenName(content.symbol)}
                    </div>
                    {idx !== props.contentList.length - 1 && (
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
  );
};

export default ImageDropDownButton;
