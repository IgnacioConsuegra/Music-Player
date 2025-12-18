import React from "react";

export default function ClickableButton({ children, className = "", onClick }) {
  return (
    <button
      className={`
        cursor-pointer  
        transition-all duration-150
        active:scale-95
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
