import React, { useContext, useState, useEffect } from "react";
import SongItem from "./SongItem.jsx";
import { MusicPlayerContext } from "../../context/MusicPlayerContext.jsx";
import PopularArtists from "./PopularArtists";
import PopularCategory from "./PopularCategory";
import { RotateCcw } from "lucide-react";
import ClickableButton from "../../components/ClickableButton.jsx";

const Main = () => {
  const { listOfSongs, setCurrentListOfSongs } = useContext(MusicPlayerContext);
  const [currentCategory, setCurrentCategory] = useState("All"); //This will give you the list of categories
  const [currentArtist, setCurrentArtist] = useState("All"); // This will handle the list of artist.
  const [currentListOfArtist, setCurrentListOfArtist] = useState([]);
  const [currentListOfCategories, setCurrentListOfCategories] = useState([]);
  const [thisCurrentListOfSongs, setThisCurrentListOfSongs] = useState([]);
  const handleChangeArtist = artistName => {
    if (artistName === currentArtist) {
      handleResetArtist();
      return;
    }
    setCurrentArtist(artistName);
    let newList = listOfSongs.filter(({ artist }) => artist === artistName);
    setThisCurrentListOfSongs(newList);
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
    setThisCurrentListOfSongs(newList);
  };
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
  const applyCurrentFilters = () => {
    let newList = listOfSongs;
    if (currentArtist !== "All") {
      newList = newList.filter(({ artist }) => artist === currentArtist);
    }
    if (currentCategory !== "All") {
      newList = newList.filter(({ category }) => category === currentCategory);
    }
    setThisCurrentListOfSongs(newList);
  };

  const handleResetArtist = () => {
    setCurrentArtist("All");
    let newList = listOfSongs;
    if (currentCategory !== "All") {
      newList = newList.filter(({ category }) => category === currentCategory);
    }
    setThisCurrentListOfSongs(newList);
  };
  const handleResetCategory = () => {
    setCurrentCategory("All");
    let newList = listOfSongs;
    if (currentArtist !== "All") {
      newList = newList.filter(({ artists }) => artists === currentArtist);
    }
    setThisCurrentListOfSongs(newList);
  };

  const handleResetFilters = () => {
    setThisCurrentListOfSongs(listOfSongs);
    setCurrentArtist("All");
    setCurrentCategory("All");
  };
  useEffect(() => {
    setThisCurrentListOfSongs(listOfSongs);
    handleArtistAndCategories(listOfSongs);
  }, [listOfSongs]);
  useEffect(() => {
    applyCurrentFilters();
  }, [currentArtist, currentCategory]);

  return (
    <section
      className={`bg-black min-h-screen text-white w-full lg:w-full md:w-[85%] md:max-w-[85%]  
        md:border-2 border-transparent md:rounded-tl-[40px] md:rounded-bl-[40px] p-8 pb-30 `}
    >
      {/* Popular playList section */}
      <section className="hidden md:block"></section>
      {/* Popular Artist sections */}
      <PopularArtists
        currentArtist={currentArtist}
        currentListOfArtist={currentListOfArtist}
        handleChangeArtist={handleChangeArtist}
        handleResetArtist={handleResetArtist}
      />
      {/* Categories sections */}
      <PopularCategory
        currentCategory={currentCategory}
        currentListOfCategories={currentListOfCategories}
        handleChangeCategory={handleChangeCategory}
        handleResetCategory={handleResetCategory}
      />
      {/* SongsSection */}
      <section className="overflow-hidden">
        <h2 className="flex gap-2">
          List of songs{" "}
          <ClickableButton>
            <RotateCcw
              className="cursor-pointer"
              onClick={handleResetFilters}
            />
          </ClickableButton>
        </h2>
        <div className="flex flex-col gap-4">
          {thisCurrentListOfSongs.map((value, index) => {
            return (
              <ClickableButton key={index}>
                <SongItem
                  artist={value.artist}
                  category={value.category}
                  title={value.title}
                  url={value.url}
                />
              </ClickableButton>
            );
          })}
        </div>
      </section>
      {/* Music player section */}
    </section>
  );
};

export default Main;
