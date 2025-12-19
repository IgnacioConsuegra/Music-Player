import React from "react";
import Main from "./Main";
import MusicPlayerProvider from "../../context/MusicPlayerContext.jsx";

const MusicPage = () => {
  return (
    <>
      <MusicPlayerProvider>
        <Main />
      </MusicPlayerProvider>
    </>
  );
};

export default MusicPage;
