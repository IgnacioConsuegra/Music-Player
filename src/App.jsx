import React from "react";
import Filters from "./components/Filters";
import Aside from "./components/Aside/Aside";
import MusicPlayerContext from "./context/MusicPlayerContext";
import Main from "./components/Main";

const App = () => {
  return (
    // bg-[#1e1d1d]
    <main className="flex bg-[#191818]">
      <MusicPlayerContext>
        <Aside />
        <Main />
      </MusicPlayerContext>
    </main>
  );
};

export default App;
