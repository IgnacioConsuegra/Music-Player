import React, { useEffect, useState } from "react";
import { Bot, Wrench, Settings } from "lucide-react";

const VerifyPage = ({ passVerification }) => {
  useEffect(() => {
    document.title = "Error";
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = "https://www.google.com/favicon.ico";
  });
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
      alert("Cristo es rey");
      passVerification();
    }
  }, [text]);
  return (
    <div className="min-h-screen bg-white font-sans flex items-center justify-center p-6 md:p-12">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-16 md:gap-24">
        <div className="flex-1">
          <div className="text-[64px] font-medium tracking-tighter mb-6 select-none">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </div>

          <h1 className="text-2xl mb-6 text-[#333]">
            <strong className="font-bold">404.</strong>{" "}
            <span className="text-[#777]">Page not found</span>
          </h1>

          <p className="text-lg leading-relaxed text-[#333]">
            <span className="font-mono">The requested URL</span> was not found
            on <br className="hidden sm:block" />
            our servers.{" "}
            <span className="text-[#777]">
              That's all we <br className="hidden sm:block" /> know.
            </span>
            {clickCount >= 10 && (
              <input
                type="text"
                className=""
                onChange={e => handleAddText(e)}
              />
            )}
          </p>
        </div>

        <div className="flex-1 flex justify-center md:justify-start w-full relative">
          <div
            className="relative w-96 h-96 text-[#4285F4]/70"
            onClick={() => handleBotClick()}
          >
            <Bot
              size={160}
              strokeWidth={1.5}
              className="absolute top-12 left-1/2 -translate-x-1/2 rotate-[15deg] text-gray-500"
            />

            <Wrench
              size={48}
              strokeWidth={1.5}
              className="absolute top-16 left-6 -rotate-45"
            />
            <Settings
              size={44}
              strokeWidth={1.5}
              className="absolute bottom-16 left-12 rotate-90"
            />
            <Settings
              size={28}
              strokeWidth={1.5}
              className="absolute bottom-20 right-20 rotate-180"
            />
            <Wrench
              size={38}
              strokeWidth={1.5}
              className="absolute bottom-8 right-32 rotate-[60deg]"
            />

            <div className="absolute top-48 left-12 w-10 h-3 border-2 border-[#4285F4]/70 rounded rotate-12" />
            <div className="absolute bottom-14 left-32 w-12 h-4 border-2 border-[#4285F4]/70 rounded -rotate-12" />
            <div className="absolute top-36 right-12 w-6 h-6 rounded-full border-2 border-[#4285F4]/70" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
