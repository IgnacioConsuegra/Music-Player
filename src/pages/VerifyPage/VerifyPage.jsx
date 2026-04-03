import React, { useEffect, useState } from "react";
import { Bot, Wrench, Settings, FileX } from "lucide-react";

const VerifyPage = ({ passVerification }) => {
  const [clickCount, setClickCount] = useState(0);
  const [text, setText] = useState("");
  const handleBotClick = () => {
    setClickCount(clickCount + 1);
  };
  const handleAddText = e => {
    setText(e.target.value.toLowerCase());
  };
  useEffect(() => {
    if (text.toLowerCase() === "cristo es rey".toLowerCase()) {
      alert("Efectivamente, Cristo es rey.");
      passVerification();
    }
  }, [text]);
  return (
    <div className="min-h-screen bg-white font-sans text-[#202124] flex flex-col pt-24 px-6 md:pt-[18vh]">
      <div className="mx-auto max-w-[600px] w-full text-left">
        <div className="mb-8 text-[#5f6368]" onClick={() => handleBotClick()}>
          <img src="error.png" alt="" />
        </div>

        <h1 className="text-2xl md:text-[28px] font-normal leading-tight mb-4">
          This site can't be reached
        </h1>

        <p className="text-[15px] mb-4">
          <span className="font-bold">dzvh41ynmrqaa.cloudfront.net</span>
          's server IP address could not be found.
        </p>

        <button className="text-[#1a73e8] text-[15px] hover:underline bg-transparent border-none p-0 cursor-pointer mb-8">
          Try running Windows Network Diagnostics.
        </button>

        <p className="text-[13px] text-[#5f6368] mb-10">
          DNS_PROBE_FINISHED_NXDOMAIN
          {clickCount >= 10 && (
            <input type="text" className="" onChange={e => handleAddText(e)} />
          )}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="bg-[#1a73e8] hover:bg-[#1b6add] text-white px-6 py-2 rounded text-[14px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a73e8]"
        >
          Reload
        </button>
      </div>
    </div>
  );
};

export default VerifyPage;
