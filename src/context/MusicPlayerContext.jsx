/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { createContext } from "react";
// eslint-disable-next-line react-refresh/only-export-components
export const MusicPlayerContext = createContext();
// eslint-disable-next-line react/prop-types
export default function MusicPlayerProvider({ children }) {
  const [listOfSongs, setListOfSongs] = useState([]); //Original list of songs
  const [currentListOfSongs, setCurrentListOfSongs] = useState([]); //Filtered songs, here will be the songs that are in our favorites/playList
  const [currentSong, setCurrentSong] = useState(""); //This is the url of the song (Maybe we can change it to handle the url, artist name and song title)
  const [currentSongInfo, setCurrentSongInfo] = useState({});

  const [currentIndex, setCurrentIndex] = useState(0); //This is which song where are pointing in our listOfSongs by default 0.
  const [isSongFinished, setIsSongFinished] = useState(false); //Necessary to change the song.

  const currentSongUrlCopy = useRef();

  //This loads the songs the first time the page is loaded(Necessary)
  async function loadSongs() {
    try {
      const res = await fetch("./songs.json");
      const songs = await res.json();
      setListOfSongs(songs);
      setCurrentListOfSongs(songs);
    } catch (error) {
      console.error("Error loading songs:", error);
    }
  }

  //Function to go to the next song, it's supposed to get 1 or -1. (Necessary)
  function handleSkip(value = 1) {
    if (value !== 1 && value !== -1) {
      throw new Error(
        "Handle Next Song called with a value different than 1 or -1",
      );
    }
    if (!currentSong.length) return;
    if (!currentListOfSongs.length) return;

    setCurrentIndex(val => {
      let newIndex = value + val;
      if (newIndex >= currentListOfSongs.length && val === 0) {
        setCurrentSong("");
        return 0;
      }
      if (newIndex >= currentListOfSongs.length) {
        return 0;
      }
      const next = val + value;
      return Math.max(0, Math.min(next, currentListOfSongs.length - 1));
    });
  }
  // This function will be executed once the user click a song.
  const handleSelectSong = ({ url, title, artist }) => {
    if (typeof url !== "string") {
      throw new Error(
        "Handle Select Song called with a value different than a string",
      );
    }
    let newIndex = currentListOfSongs.findIndex(
      ({ title: current }) => current === title,
    );
    currentSongUrlCopy.current = url;
    setCurrentSongInfo({ url, title, artist });
    setCurrentIndex(newIndex);
    setCurrentSong(url);
  };

  useEffect(() => {
    loadSongs();
  }, []);

  useEffect(() => {
    if (!currentSong.length) return;
    if (!currentListOfSongs.length) return;
    if (!currentIndex || currentIndex > currentListOfSongs.length) return;
    const { url, title, artist } = currentListOfSongs[currentIndex];
    handleSelectSong({ url, title, artist });
  }, [currentIndex]);

  useEffect(() => {
    if (!currentSong.length && currentSongUrlCopy.current) {
      setCurrentSong(currentSongUrlCopy.current);
    }
  }, [currentSong]);

  useEffect(() => {
    if (isSongFinished) {
      handleSkip(1);
      setIsSongFinished(false);
    }
  }, [isSongFinished]);
  return (
    <>
      <MusicPlayerContext.Provider
        value={{
          currentSong,
          listOfSongs,
          currentListOfSongs,
          setCurrentSong,
          handleSelectSong,
          handleSkip,
          currentSongInfo,
          setIsSongFinished,
          setCurrentListOfSongs,
        }}
      >
        {children}
      </MusicPlayerContext.Provider>
    </>
  );
}
