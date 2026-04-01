/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { createContext } from "react";
// eslint-disable-next-line react-refresh/only-export-components
export const MusicPlayerContext = createContext();
// eslint-disable-next-line react/prop-types
export default function MusicPlayerProvider({ children }) {
  const [listOfSongs, setListOfSongs] = useState([]); //Original list of songs
  const [currentListOfSongs, setCurrentListOfSongs] = useState([]); //Filtered songs.
  const [currentSong, setCurrentSong] = useState(""); //This is the url of the song (Maybe we can change it to handle the url, artist name and song title)
  const [currentSongInfo, setCurrentSongInfo] = useState({});

  const [currentIndex, setCurrentIndex] = useState(0); //This is which song where are pointing in our listOfSongs by default 0.
  const [isSongFinished, setIsSongFinished] = useState(false); //Necessary to change the song.
  const [currentCategory, setCurrentCategory] = useState("All"); //This will give you the list of categories
  const [currentArtist, setCurrentArtist] = useState("All"); // This will handle the list of artist.

  const [currentListOfArtist, setCurrentListOfArtist] = useState([]);
  const [currentListOfCategories, setCurrentListOfCategories] = useState([]);

  const currentSongUrlCopy = useRef();

  //This loads the songs the first time the page is loaded(Necessary)
  async function loadSongs() {
    try {
      const res = await fetch("./songs.json");
      const songs = await res.json();
      setListOfSongs(songs);
      setCurrentListOfSongs(songs);
      handleArtistAndCategories(songs);
    } catch (error) {
      console.error("Error loading songs:", error);
    }
  }
  const handleArtistAndCategories = list => {
    const { categoryList, artistList } = getArtistAndCAtegories(list);
    setCurrentListOfCategories(Object.keys(categoryList));
    setCurrentListOfArtist(Object.keys(artistList));
  };
  const getArtistAndCAtegories = list => {
    const categoryList = {};
    list.forEach(({ category }) => {
      if (!(category in categoryList)) categoryList[category] = 0;
      categoryList[category] += 1;
    });
    const artistList = {};
    list.forEach(({ artist }) => {
      if (!(artist in artistList)) artistList[artist] = 0;
      artistList[artist] += 1;
    });
    return { categoryList, artistList };
  };

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
  const handleChangeArtist = artistName => {
    if (artistName === currentArtist) {
      handleResetArtist();
      return;
    }
    setCurrentArtist(artistName);
  };
  const handleChangeCategory = categoryName => {
    if (categoryName === currentCategory) {
      handleResetCategory();
      return;
    }
    setCurrentCategory(categoryName);
    let newList = listOfSongs.filter(
      ({ category }) => category === categoryName,
    );
    setCurrentListOfSongs(newList);
  };
  const applyCurrentFilters = () => {
    let newList = listOfSongs;
    if (currentArtist !== "All") {
      newList = newList.filter(({ artist }) => artist === currentArtist);
    }
    if (currentCategory !== "All") {
      newList = newList.filter(({ category }) => category === currentCategory);
    }
    setCurrentListOfSongs(newList);
  };

  const handleResetArtist = () => {
    setCurrentArtist("All");
    let newList = listOfSongs;
    if (currentCategory !== "All") {
      newList = newList.filter(({ category }) => category === currentCategory);
    }
    setCurrentListOfSongs(newList);
  };
  const handleResetCategory = () => {
    setCurrentCategory("All");
    let newList = listOfSongs;
    if (currentArtist !== "All") {
      newList = newList.filter(({ artists }) => artists === currentArtist);
    }
    setCurrentListOfSongs(newList);
  };

  const handleResetFilters = () => {
    setCurrentListOfSongs(listOfSongs);
  };

  useEffect(() => {
    loadSongs();
  }, []);

  useEffect(() => {
    if (!currentSong.length) return;
    const { url, title, artist } = currentListOfSongs[currentIndex];
    handleSelectSong({ url, title, artist });
  }, [currentIndex]);

  useEffect(() => {
    if (!currentSong.length && currentSongUrlCopy.current) {
      setCurrentSong(currentSongUrlCopy.current);
    }
  }, [currentSong]);
  useEffect(() => {
    applyCurrentFilters();
  }, [currentArtist, currentCategory]);
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
          handleChangeArtist,
          currentListOfArtist,
          currentListOfCategories,
          handleChangeCategory,
          handleResetFilters,
          handleResetArtist,
          handleResetCategory,
          currentArtist,
          currentCategory,
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
