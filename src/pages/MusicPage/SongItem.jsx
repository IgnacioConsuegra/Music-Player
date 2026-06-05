import React, { useContext } from "react";
import { MusicPlayerContext } from "../../context/MusicPlayerContext.jsx";
import { AudioLines, Plus } from "lucide-react";
const SongItem = ({
  artist,
  title,
  url,
  toUpdateListOfSong,
  handleSongClick,
  handleOnPlusSign,
}) => {
  const { handleSelectSong, currentSong } = useContext(MusicPlayerContext);
  return (
    <div
      onClick={e => {
        if (e.target.closest("[data-ignore-click]")) return;
        handleSelectSong({ url, title, artist, toUpdateListOfSong });
        handleSongClick({ url, title, artist });
      }}
      className={`text-black ${
        url == currentSong ? "bg-cyan-800" : "bg-white"
      } cursor-pointer flex h-20 items-center border-2 rounded-2xl p-6 gap-3 `}
    >
      <div>
        <AudioLines />
      </div>
      <div className="grid grid-cols-3 items-center w-full">
        <p className="text-left">{artist}</p>
        <p className="text-center font-bold">{title}</p>

        <button data-ignore-click className="flex justify-end cursor-pointer">
          <Plus
            className="relative z-50 hover:size-8"
            onClick={e => {
              e.stopPropagation();
              handleOnPlusSign({ url, title, artist });
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default SongItem;
