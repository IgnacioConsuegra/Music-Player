/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { createContext } from "react";
// eslint-disable-next-line react-refresh/only-export-components
export const MusicPlayerContext = createContext();
// eslint-disable-next-line react/prop-types
export default function MusicPlayerProvider({ children }) {
  const [isMusingPlaying, setIsMusingPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState("");
  const [listOfSongs, setListOfSongs] = useState([]);
  const [currentListOfSongs, setCurrentListOfSongs] = useState([]);
  const [currentVolume, setCurrentVolume] = useState(50);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);
  async function loadSongs() {
    try {
      const res = await fetch("./songs.json");
      const songs = await res.json();
      setListOfSongs(songs);
      setCurrentListOfSongs(songs);
      setCurrentSong(songs[0]["url"]);
    } catch (error) {
      console.error("Error loading songs:", error);
    }
  }
  const handlePlay = value => {
    setIsMusingPlaying(value);
  };
  const handleNextSong = value => {
    setCurrentIndex(val => val + value);
  };
  const handleSelectSong = value => {
    setCurrentSong(value);
  };
  useEffect(() => {
    loadSongs();
  }, []);
  useEffect(() => {
    if (isMusingPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isMusingPlaying]);
  useEffect(() => {
    if (!currentListOfSongs.length) return;
    console.log("changed current Index");
    setCurrentSong(currentListOfSongs[currentIndex]);
  }, [currentIndex]);
  useEffect(() => {
    console.log(currentSong);
    if (!currentSong.length) return;
    audioRef.current.play();
  }, [currentSong]);
  return (
    <>
      <MusicPlayerContext.Provider
        value={{
          isMusingPlaying,
          currentSong,
          listOfSongs,
          currentListOfSongs,
          currentVolume,
          setIsMusingPlaying,
          setCurrentSong,
          handleSelectSong,
        }}
      >
        {children}
        <audio src={currentSong} ref={audioRef}></audio>
        {/* <button onClick={() => handlePlay(true)}>Start</button> */}
        {/* <button onClick={() => handlePlay(false)}>Stop</button> */}
      </MusicPlayerContext.Provider>
    </>
  );
}
