import React from "react";
import { Routes, Route } from "react-router-dom";
import Aside from "./components/Aside/Aside.jsx";
import MusicPage from "./pages/MusicPage/MusicPage.jsx";
import VideosPage from "./pages/Videos/VideosPage.jsx";
import PdfPage from "./pages/Pdf/PdfPage.jsx";
import { Layout } from "./pages/Layout/Layout.jsx";
import EditorPage from "./pages/EditorPage/EditorPage.jsx";
import ImpostorPage from "./pages/ImpostorPage/ImpostorPage.jsx";
const App = () => {
  return (
    // bg-[#1e1d1d]
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<MusicPage />} />
        <Route path="/songs" element={<MusicPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/pdf" element={<PdfPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/impostor" element={<ImpostorPage />} />
      </Route>
    </Routes>
  );
};

export default App;
