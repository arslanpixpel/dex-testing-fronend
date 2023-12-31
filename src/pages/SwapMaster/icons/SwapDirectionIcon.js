import React from "react";

export const SwapDirectionIcon = () => (
  <svg
    className="w-10 h-10 text-white-800 "
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <polyline points="15 4 19 4 19 8" />
    <line x1="14.75" y1="9.25" x2="19" y2="4" />
    <line x1="5" y1="19" x2="9" y2="15" />
    <polyline points="15 19 19 19 19 15" />
    <line x1="5" y1="5" x2="19" y2="19" />
  </svg>
);
