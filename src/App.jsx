import React from "react";
import Filters from "./components/Filters";
import Aside from "./components/Aside";
import MusicPlayerContext from "./context/MusicPlayerContext";
import Main from "./components/Main";

const App = () => {
  return (
    <main className="flex">
      <MusicPlayerContext>
        <Aside />
        <Main />
      </MusicPlayerContext>
    </main>
  );
};

export default App;
