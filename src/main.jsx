import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import MusicPlayerProvider from "./context/MusicPlayerContext.jsx";
import FavoritesProvider from "./context/FavoritesContext.jsx";
import PlayListProvider from "./context/MusicPlayerContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <MusicPlayerProvider>
        <FavoritesProvider>
          <PlayListProvider>
            <App />
          </PlayListProvider>
        </FavoritesProvider>
      </MusicPlayerProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
