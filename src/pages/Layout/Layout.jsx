import React, { useState } from "react";
import Aside from "../../components/Aside/Aside";
import { Outlet } from "react-router-dom";
import MusicPlayerProvider from "../../context/MusicPlayerContext";
import MusicBar from "../MusicPage/MusicBar";
import { ChevronLeft, ChevronRight } from "lucide-react";
export const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <MusicBar />
      <button
        className={` hidden absolute top-2 cursor-pointer left-40 ${
          isOpen ? " md:block" : "hidden"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <ChevronLeft className="text-white" />
      </button>
      <button
        className={`hidden absolute top-4 cursor-pointer left-4 ${
          !isOpen ? " md:block" : "hidden"
        } `}
        onClick={() => setIsOpen(true)}
      >
        <ChevronRight className="text-transparent hover:text-cyan-800" />
      </button>
      <main className="flex flex-col-reverse md:flex-row bg-[#191818] min-h-screen pb-5 w-full">
        <div
          className={`w-full md:w-[10%] ${!isOpen ? "md:hidden bg-red-500" : "md:w-[10%]"}`}
        >
          <Aside />
        </div>

        <div className={`w-full   ${!isOpen ? "w-full" : "md:w-[90%]"}`}>
          <Outlet />
        </div>
      </main>
    </>
  );
};
