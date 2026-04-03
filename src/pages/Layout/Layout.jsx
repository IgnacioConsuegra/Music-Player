import React from "react";
import Aside from "../../components/Aside/Aside";
import { Outlet } from "react-router-dom";
import MusicPlayerProvider from "../../context/MusicPlayerContext";
import MusicBar from "../MusicPage/MusicBar";
export const Layout = ({ children }) => {
  return (
    <>
      <MusicBar />
      <main className="flex flex-col-reverse md:flex-row bg-[#191818] min-h-screen pb-5">
        <Aside />
        <Outlet />
      </main>
    </>
  );
};
