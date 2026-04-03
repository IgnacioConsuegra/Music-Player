import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import MusicPlayerProvider from "./context/MusicPlayerContext.jsx";
import FavoritesProvider from "./context/FavoritesContext.jsx";
import PlayListProvider from "./context/PlayListContext.jsx";
import IdleTimer from "./components/IdleTimer.jsx";
import ConfigProvider from "./context/ConfigContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider>
        <MusicPlayerProvider>
          <FavoritesProvider>
            <PlayListProvider>
              <App />
              <IdleTimer />
            </PlayListProvider>
          </FavoritesProvider>
        </MusicPlayerProvider>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
