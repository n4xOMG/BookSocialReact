import React from "react";

export const CursorSvg = ({ color }) => (
  <svg
    width="24"
    height="36"
    viewBox="0 0 24 36"
    fill="none"
    stroke="white"
    strokeWidth="1.5"
    style={{
      fill: color || "#000",
      filter: "drop-shadow(0px 1px 1px rgba(0,0,0,0.3))",
    }}
  >
    <path d="M5.65376 12.3271L5.46443 0.500057L18.4953 14.5072L12.1023 15.0547L18.6361 22.0937L15.4053 24.9325L8.87156 17.8935L5.65376 12.3271Z" />
  </svg>
);
