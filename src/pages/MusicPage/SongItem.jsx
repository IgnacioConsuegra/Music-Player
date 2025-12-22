import React, { useContext } from "react";
import { MusicPlayerContext } from "../../context/MusicPlayerContext.jsx";
import { AudioLines, Plus } from "lucide-react";
const SongItem = ({ artist, title, url }) => {
  const { handleSelectSong, currentSong } = useContext(MusicPlayerContext);
  return (
    <div
      onClick={() => handleSelectSong({ url, title, artist })}
      className={` text-black  ${
        url == currentSong ? "bg-cyan-800" : "bg-white"
      } 
        cursor-pointer flex h-20 items-center 
        border-2 rounded-2xl p-6 gap-3 `}
    >
      <div>
        <AudioLines />
      </div>
      <div className="grid grid-cols-3 items-center w-full">
        <p className="text-left">{artist}</p>
        <p className="text-center font-bold">{title}</p>
        <div className="flex justify-end">
          <Plus />
        </div>
      </div>
    </div>
  );
};

export default SongItem;
