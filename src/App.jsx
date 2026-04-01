import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Aside from "./components/Aside/Aside.jsx";
import MusicPage from "./pages/MusicPage/MusicPage.jsx";
import VideosPage from "./pages/Videos/VideosPage.jsx";
import PdfPage from "./pages/Pdf/PdfPage.jsx";
import VerifyPage from "./pages/VerifyPage/VerifyPage.jsx";
import { Layout } from "./pages/Layout/Layout.jsx";
import EditorPage from "./pages/EditorPage/EditorPage.jsx";
import ImpostorPage from "./pages/ImpostorPage/ImpostorPage.jsx";
import Favorites from "./pages/FavoritesPage/FavoritesPage.jsx";
import PlayListPage from "./pages/PlayListPage/PlayListPage.jsx";
const App = () => {
  const [isVerified, setIsVerified] = useState(true);
  const changeIsVerified = () => {
    setIsVerified(true);
  };
  if (!isVerified) {
    return <VerifyPage passVerification={changeIsVerified} />;
  } else {
    document.title = "Melody wave";
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = "src/assets/icon.png";
  }
  return (
    // bg-[#1e1d1d]
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<MusicPage />} />
        <Route path="/songs" element={<MusicPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/pdf" element={<PdfPage />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/playlist" element={<ImpostorPage />} />
        <Route path="/impostor" element={<ImpostorPage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Route>
    </Routes>
  );
};

export default App;
