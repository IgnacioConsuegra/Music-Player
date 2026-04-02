import React, { useContext, useState, useEffect } from "react";
import { PlayListContext } from "../../context/PlayListContext.jsx";
import { Trash2, ArrowLeft, Music, Clock } from "lucide-react";
import { MusicPlayerContext } from "../../context/MusicPlayerContext.jsx";
const PlaylistViewPage = ({ playlistName, onBack }) => {
  const { playlists, removeFromPlaylist } = useContext(PlayListContext);
  const { setCurrentListOfSongs, handleSelectSong, currentSongInfo } =
    useContext(MusicPlayerContext);
  // Derive the active playlist directly from context so it always has fresh data
  const currentPlaylist = playlists.find(p => p.playListName === playlistName);

  const handleRemoveSong = url => {
    if (playlistName) {
      removeFromPlaylist({ url, playListName: playlistName });
    }
  };

  if (!currentPlaylist) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-8">
        <Music size={48} className="text-zinc-700 mb-4" />
        <h2 className="text-2xl font-bold text-zinc-500">
          No playlist selected
        </h2>
        <button
          onClick={onBack}
          className="mt-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>
      </div>
    );
  }
  const handleSongClick = ({ url, title, artist }) => {
    handleSelectSong({
      url,
      title,
      artist,
      toUpdateListOfSong: currentPlaylist.playListListOfSongs,
    });
    setCurrentListOfSongs(currentPlaylist.playListListOfSongs);
  };
  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Playlists
        </button>

        <div className="bg-gradient-to-b from-[#282828] to-[#121212] p-8 rounded-2xl border border-zinc-800/50 mb-10 flex items-end gap-6 shadow-2xl">
          <div className="w-48 h-48 bg-zinc-800 rounded-xl flex items-center justify-center shadow-lg border border-zinc-700/50 flex-shrink-0">
            <Music size={64} className="text-zinc-600" />
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">
              Playlist
            </span>
            <h1 className="text-5xl font-black text-white tracking-tight">
              {currentPlaylist.playListName}
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mt-2">
              {currentPlaylist.description || "No description provided."}
            </p>
            <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium mt-2">
              <span className="text-white">
                {currentPlaylist.playListListOfSongs.length} songs
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-6 py-3 border-b border-zinc-800 text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            <span className="w-8 text-center">#</span>
            <span>Title & Artist</span>
            <Clock size={18} className="mr-6" />
          </div>

          {currentPlaylist.playListListOfSongs.length === 0 ? (
            <div className="text-center py-16 bg-[#1e1e1e] rounded-xl border border-zinc-800/50">
              <p className="text-zinc-500 text-lg">
                This playlist is currently empty.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {currentPlaylist.playListListOfSongs.map((song, index) => (
                <div
                  key={song.url + index}
                  className={`grid grid-cols-[auto_1fr_auto] gap-4 items-center bg-[#181818] hover:bg-[#282828] ${currentSongInfo.title === song.title && "bg-[#282828]"} p-4 rounded-xl border border-transparent hover:border-zinc-700 transition-all group`}
                  onClick={() => handleSongClick(song)}
                >
                  <span className="w-8 text-center text-zinc-500 font-medium group-hover:text-white transition-colors">
                    {index + 1}
                  </span>

                  <div className="flex flex-col pr-4">
                    <span className="text-white font-semibold text-lg truncate">
                      {song.title}
                    </span>
                    <span className="text-zinc-400 text-sm truncate">
                      {song.artist}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveSong(song.url)}
                    className="p-3 text-zinc-500 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistViewPage;
