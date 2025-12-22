import React from "react";
import Main from "./Main";
import MusicPlayerProvider from "../../context/MusicPlayerContext.jsx";
import MusicBar from "./MusicBar.jsx";

const MusicPage = () => {
  return (
    <>
      <MusicPlayerProvider>
        <Main />
        <MusicBar />
      </MusicPlayerProvider>
    </>
  );
};

export default MusicPage;
