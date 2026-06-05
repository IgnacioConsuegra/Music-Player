import React, { useContext, useState, useEffect } from "react";
import SongItem from "./SongItem.jsx";
import { MusicPlayerContext } from "../../context/MusicPlayerContext.jsx";
import PopularArtists from "./PopularArtists";
import PopularCategory from "./PopularCategory";
import { RotateCcw, Search, X } from "lucide-react";
import ClickableButton from "../../components/ClickableButton.jsx";
import { PlayListContext } from "../../context/PlayListContext.jsx";

const Main = () => {
  const { listOfSongs, setCurrentListOfSongs, currentSong, handleSelectSong } =
    useContext(MusicPlayerContext);
  const {
    isAddingPlayListWithHomePage,
    setIsAddingPlayListWithHomePage,
    playlists,
    addToPlaylist,
  } = useContext(PlayListContext);
  const [currentCategory, setCurrentCategory] = useState("All"); //This will give you the list of categories
  const [currentArtist, setCurrentArtist] = useState("All"); // This will handle the list of artist.
  const [currentListOfArtist, setCurrentListOfArtist] = useState([]);
  const [currentListOfCategories, setCurrentListOfCategories] = useState([]);
  const [thisCurrentListOfSongs, setThisCurrentListOfSongs] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [selectedSongAtPlusIcon, setSelectedSongAtPlusIcon] = useState({});
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
    return newList;
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
  const handleSongClick = ({ url, title, artist }) => {
    handleSelectSong({
      url,
      title,
      artist,
      toUpdateListOfSong: thisCurrentListOfSongs,
    });
    setCurrentListOfSongs(thisCurrentListOfSongs);
  };
  const handleSearchBarChange = () => {
    let currentList = applyCurrentFilters();
    const searchLower = userSearch.toLowerCase();
    currentList = currentList.filter(song => {
      const matchTitle = song.title.toLowerCase().includes(searchLower);
      const matchArtist = song.artist.toLowerCase().includes(searchLower);
      const matchCategory = song.category.toLowerCase().includes(searchLower);

      return matchTitle || matchArtist || matchCategory;
    });
    setThisCurrentListOfSongs(currentList);
  };
  const handleOnPlusSign = ({ url, title, artist }) => {
    console.log("Executing");
    setSelectedSongAtPlusIcon({ url, title, artist });
    setIsAddingPlayListWithHomePage(true);
  };
  useEffect(() => {
    setThisCurrentListOfSongs(listOfSongs);
    handleArtistAndCategories(listOfSongs);
  }, [listOfSongs]);
  useEffect(() => {
    applyCurrentFilters();
  }, [currentArtist, currentCategory]);

  useEffect(() => {
    handleSearchBarChange();
  }, [userSearch]);
  return (
    <section
      className={`bg-black min-h-screen text-white lg:w-full w-full
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
      <section>
        <div className="flex row justify-between mt-2 ">
          <h2 className="flex gap-2 ">
            List of songs{" "}
            <ClickableButton>
              <RotateCcw
                className="cursor-pointer"
                onClick={handleResetFilters}
              />
            </ClickableButton>
          </h2>
          <div className="flex ">
            <input
              type="text"
              placeholder="Search..."
              value={userSearch}
              className="w-full border border-black outline-none cursor-pointer"
              onInput={value => setUserSearch(value.target.value)}
            />
            <Search className="relative right-10" />
            <X
              className="relative right-10 bottom-5 hover:bg-red-600 cursor-pointer rounded-full text-gray-500 hover:text-white"
              onClick={() => setUserSearch("")}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          {thisCurrentListOfSongs.map((value, index) => {
            return (
              <SongItem
                artist={value.artist}
                category={value.category}
                title={value.title}
                url={value.url}
                handleSongClick={handleSongClick}
                handleOnPlusSign={handleOnPlusSign}
                key={index}
              />
            );
          })}
        </div>
      </section>
      {/* Music player section */}
      {isAddingPlayListWithHomePage && playlists.length > 0 && (
        <div className="fixed inset-0 z-102 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="relative bg-[#121212] border border-gray-800 rounded-xl shadow-2xl flex flex-col w-full max-w-md p-6 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Playlists{" "}
              </h2>
              <h3>
                {selectedSongAtPlusIcon.title} {selectedSongAtPlusIcon.artist}
              </h3>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[60vh] pr-1">
              {playlists.map((playlist, index) => {
                const { playListName, playListListOfSongs = [] } = playlist;
                const isSongAlreadyAdded = playListListOfSongs.some(
                  item =>
                    item.title === selectedSongAtPlusIcon.title &&
                    item.artist === selectedSongAtPlusIcon.artist,
                );

                return (
                  <div
                    key={`${playListName}-${index}`}
                    className={`px-4 py-3 rounded-lg whitespace-nowrap transition-colors duration-200 flex items-center justify-between cursor-pointer ${
                      isSongAlreadyAdded
                        ? "text-gray-400 bg-gray-800/40 hover:bg-gray-800 hover:text-gray-200"
                        : "text-gray-200 bg-gray-800/20 hover:bg-[#0b5c6b] hover:text-white"
                    }`}
                    onClick={() =>
                      addToPlaylist({
                        playListName,
                        song: selectedSongAtPlusIcon,
                      })
                    }
                  >
                    <span className="font-medium text-base">
                      {playListName}
                    </span>

                    {isSongAlreadyAdded && (
                      <span className="text-xs uppercase tracking-wider text-gray-500 ml-4 font-bold cursor-pointer">
                        Already added
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              className="absolute -top-4 -right-4 bg-gray-800 border border-gray-700 rounded-full p-2 shadow-md flex items-center justify-center hover:bg-red-500 transition-colors group cursor-pointer"
              onClick={() => setIsAddingPlayListWithHomePage(false)}
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors cursor-pointer" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Main;
