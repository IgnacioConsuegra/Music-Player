import React, { useState, useEffect, useRef } from "react";

export default function IdleTimer() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [graceLeft, setGraceLeft] = useState(120);
  const audioRef = useRef(new Audio("music/bell.mp3"));

  useEffect(() => {
    // Volume at 20% and Enable Looping
    audioRef.current.volume = 0.01;
    audioRef.current.loop = true;
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!showPrompt) {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setShowPrompt(true);
            audioRef.current.play().catch(() => {});
            return 0;
          }
          return prev - 1;
        });
      } else {
        setGraceLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleClose();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [showPrompt]);

  const handleReset = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setShowPrompt(false);
    setTimeLeft(1800);
    setGraceLeft(600);
  };

  const handleClose = () => {
    audioRef.current.pause();
    window.close();
    setTimeout(() => {
      window.location.href = "about:blank";
    }, 500);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-[90%] max-w-[300px] sm:w-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm sm:text-base">
            "Still here?"
          </span>
          <span className="text-neutral-500 text-xs">
            Closing in {Math.floor(graceLeft / 60)}m {graceLeft % 60}s
          </span>
        </div>

        <button
          onClick={handleReset}
          className="bg-orange-500 hover:bg-orange-600 text-white p-2 sm:p-3 rounded-xl transition-all active:scale-95 flex items-center justify-center group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:scale-110 transition-transform"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
