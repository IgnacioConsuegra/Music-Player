/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import { Search, AudioLines, Heart } from "lucide-react";
import { FavoritesContext } from "../../context/FavoritesContext";
import SongItem from "../MusicPage/SongItem";
import { MusicPlayerContext } from "../../context/MusicPlayerContext";
import ClickableButton from "../../components/ClickableButton";
export default function Favorites() {
  const { setCurrentListOfSongs } = useContext(MusicPlayerContext);
  const [searchQuery, setSearchQuery] = useState("");
  const { listOfFavorites, addToFavorites, removeFromFavorites } =
    useContext(FavoritesContext);
  const filteredSongs = listOfFavorites.filter(
    song =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const handleClick = () => {
    console.log(filteredSongs);
    setCurrentListOfSongs(filteredSongs);
  };
  return (
    <div className="w-full min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">My Favorites</h1>

        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search favorites..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-zinc-700 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filteredSongs.map((song, index) => (
          <ClickableButton
            key={`${song.artist}${song.title}`}
            onClick={handleClick}
          >
            <SongItem artist={song.artist} title={song.title} url={song.url} />
          </ClickableButton>
          // <div
          //   key={index}
          //   className="flex items-center w-full bg-white text-black rounded-2xl p-4 hover:bg-gray-100 transition-colors"
          // >
          //   <div className="flex items-center gap-4 w-1/3">
          //     <AudioLines className="w-5 h-5 text-gray-500" />
          //     <span className="text-gray-500 text-sm">{song.artist}</span>
          //   </div>

          //   <div className="flex-1 text-center font-bold text-sm">
          //     {song.title}
          //   </div>

          //   <div className="w-1/3 flex justify-end">
          //     <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
          //       <Heart className="w-5 h-5 fill-black text-black" />
          //     </button>
          //   </div>
          // </div>
        ))}

        {filteredSongs.length === 0 && (
          <div className="text-center text-gray-500 mt-10 text-sm">
            No favorite songs found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
