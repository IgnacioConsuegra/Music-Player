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
      onClick={e => {
        if (e.target.closest("[data-ignore-click]")) return;
        if (onClick) onClick(e);
      }}
    >
      {children}
    </button>
  );
}
