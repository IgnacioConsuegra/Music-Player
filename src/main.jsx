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
import { Toaster } from "react-hot-toast";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider>
        <MusicPlayerProvider>
          <FavoritesProvider>
            <PlayListProvider>
              <div>
                <Toaster />
              </div>

              <App />
              <IdleTimer />
            </PlayListProvider>
          </FavoritesProvider>
        </MusicPlayerProvider>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
