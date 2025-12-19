import React from "react";
import { Routes, Route } from "react-router-dom";
import Aside from "./components/Aside/Aside.jsx";
import MusicPage from "./pages/MusicPage/MusicPage.jsx";
import VideosPage from "./pages/Videos/VideosPage.jsx";
const App = () => {
  return (
    // bg-[#1e1d1d]
    <main className="flex bg-[#191818]">
      <Aside />
      <Routes>
        <Route path="/" element={<MusicPage />} />
        <Route path="/songs" element={<MusicPage />} />
        <Route path="/videos" element={<VideosPage />} />
      </Routes>
    </main>
  );
};

export default App;
