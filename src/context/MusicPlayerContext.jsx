/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { createContext } from "react";
// eslint-disable-next-line react-refresh/only-export-components
export const MusicPlayerContext = createContext();
// eslint-disable-next-line react/prop-types
export default function MusicPlayerProvider({ children }) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); //This is obvious
  const [currentSong, setCurrentSong] = useState(""); //This is the url of the song
  const [listOfSongs, setListOfSongs] = useState([]); //Original list of songs
  const [currentListOfSongs, setCurrentListOfSongs] = useState([]); //Filtered songs.
  const [currentVolume, setCurrentVolume] = useState(50); //Obvious too.
  const [currentIndex, setCurrentIndex] = useState(0); //This is which song where are pointing in our listOfSongs by default 0.
  const [author, setAuthor] = useState("Author");
  const [songName, setSongName] = useState("Song");
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
  // Function to init to play songs
  const togglePlay = () => {
    if (!currentSong.length) return;
    if (isMusicPlaying) {
      setIsMusicPlaying(false);
    } else {
      setIsMusicPlaying(true);
    }
  };

  //Function to go to the next song, it's supposed to get 1 or -1.
  const handleSkip = value => {
    if (value !== 1 && value !== -1) {
      throw new Error(
        "Handle Next Song called with a value different than 1 or -1"
      );
    }
    if (!currentSong.length) return;
    setCurrentIndex(val => {
      if (val + value <= 0) {
        return val;
      }
      return val + value;
    });
  };
  const handleSelectSong = ({ url, title, artist }) => {
    if (typeof url !== "string") {
      throw new Error(
        "Handle Select Song called with a value different than a string"
      );
    }
    let newIndex = currentListOfSongs.findIndex(
      ({ title: current }) => current === title
    );
    setCurrentIndex(newIndex);
    setCurrentSong(url);
    setAuthor(artist);
    setSongName(title);
  };
  useEffect(() => {
    loadSongs();
  }, []);
  useEffect(() => {
    if (!currentSong.length) return;
    console.log(currentIndex);
    const { url, title, artist } = currentListOfSongs[currentIndex];
    console.log(currentListOfSongs[currentIndex]);
    handleSelectSong({ url, title, artist });
  }, [currentIndex]);
  return (
    <>
      <MusicPlayerContext.Provider
        value={{
          isMusicPlaying,
          currentSong,
          listOfSongs,
          currentListOfSongs,
          currentVolume,
          setIsMusicPlaying,
          setCurrentSong,
          handleSelectSong,
          handleSkip,
          togglePlay,
          author,
          songName,
        }}
      >
        {children}
      </MusicPlayerContext.Provider>
    </>
  );
}
