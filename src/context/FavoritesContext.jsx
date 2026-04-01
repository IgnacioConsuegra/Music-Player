import React, { createContext, useState, useEffect } from "react";

export const FavoritesContext = createContext();

/* eslint-disable no-unused-vars */
// eslint-disable-next-line react/prop-types
export default function FavoritesProvider({ children }) {
  const [listOfFavorites, setListOfFavorites] = useState([]);
  useEffect(() => {
    const savedFavorites = localStorage.getItem("listOfFavorites");
    if (savedFavorites) {
      setListOfFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const addToFavorites = ({ url, title, artist }) => {
    console.log(url, title, artist);
    const isDuplicate = listOfFavorites.some(song => song.url === url);

    if (isDuplicate) {
      removeFromFavorites({ url });
      return;
    }

    const copyList = [...listOfFavorites, { url, title, artist }];

    setListOfFavorites(copyList);
    localStorage.setItem("listOfFavorites", JSON.stringify(copyList));
  };

  const removeFromFavorites = ({ url }) => {
    console.log(url);
    const copyList = listOfFavorites.filter(value => value?.url !== url);
    setListOfFavorites(copyList);
    localStorage.setItem("listOfFavorites", JSON.stringify(copyList));
  };

  const contextValue = {
    listOfFavorites,
    addToFavorites,
    removeFromFavorites,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}
