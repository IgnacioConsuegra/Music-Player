import React from "react";
import Aside from "../../components/Aside/Aside";
import { Outlet } from "react-router-dom";
export const Layout = ({ children }) => {
  return (
    <main className="flex bg-[#191818] min-h-screen">
      <Aside />
      <Outlet />
    </main>
  );
};
