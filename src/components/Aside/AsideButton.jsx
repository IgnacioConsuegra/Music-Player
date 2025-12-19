import React from "react";
import ClickableButton from "../ClickableButton";

const AsideButton = ({ children }) => {
  return (
    <ClickableButton className="hover:bg-[#373834] hover:text-yellow-200  cursor-pointer rounded-full px-4 py-2">
      {children}
    </ClickableButton>
  );
};

export default AsideButton;
