import React, { useState } from "react";
import { X, Plus, RotateCcw } from "lucide-react";

const PlaylistCreator = ({ currentListOfSongs, onClose, onSave }) => {
  const [playListName, setPlayListName] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [playListListOfSongs, setPlayListListOfSongs] = useState([]);
  const [removedSongs, setRemovedSongs] = useState([]);
  const [error, setError] = useState("");

  const filteredSongs = searchQuery
    ? currentListOfSongs.filter(
        song =>
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const handleAddSong = song => {
    const isAlreadyAdded = playListListOfSongs.some(s => s.url === song.url);

    if (isAlreadyAdded) {
      setError("This song is already in the playlist.");
      return;
    }

    setPlayListListOfSongs([...playListListOfSongs, song]);
    setRemovedSongs(removedSongs.filter(s => s.url !== song.url));
    setSearchQuery("");
    setError("");
  };

  const handleRemoveSong = song => {
    setPlayListListOfSongs(playListListOfSongs.filter(s => s.url !== song.url));

    if (!removedSongs.some(s => s.url === song.url)) {
      setRemovedSongs([...removedSongs, song]);
    }

    setError("");
  };

  const handleRecoverSong = song => {
    handleAddSong(song);
  };

  const handleSave = () => {
    const playlistData = {
      playListName,
      description,
      playListListOfSongs,
    };
    onSave(playlistData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-[60%] h-[60%] flex flex-col bg-[#121212] text-white rounded-xl shadow-2xl p-6 border border-zinc-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 flex-shrink-0">
          Create New Playlist
        </h2>

        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-400">
              Playlist Name
            </label>
            <input
              type="text"
              value={playListName}
              onChange={e => setPlayListName(e.target.value)}
              placeholder="My awesome playlist..."
              className="w-full bg-[#1e1e1e] border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-400">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="A brief description..."
              className="w-full bg-[#1e1e1e] border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-white transition-colors resize-none h-20"
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="text-sm font-semibold text-zinc-400">
              Search Songs
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title or artist..."
              className="w-full bg-[#1e1e1e] border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />

            {error && (
              <span className="text-red-400 text-sm mt-1">{error}</span>
            )}

            {searchQuery && filteredSongs.length > 0 && (
              <div className="absolute top-[80px] left-0 right-0 bg-[#282828] border border-zinc-700 rounded-lg max-h-48 overflow-y-auto z-20 shadow-xl">
                {filteredSongs.map((song, index) => (
                  <div
                    key={index}
                    onClick={() => handleAddSong(song)}
                    className="flex items-center justify-between p-3 hover:bg-[#3e3e3e] cursor-pointer transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{song.title}</span>
                      <span className="text-xs text-zinc-400">
                        {song.artist}
                      </span>
                    </div>
                    <Plus size={18} className="text-zinc-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-400">
              Added Songs ({playListListOfSongs.length})
            </label>
            {playListListOfSongs.length === 0 ? (
              <p className="text-zinc-500 text-sm italic py-2">
                No songs added yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {playListListOfSongs.map((song, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#1e1e1e] p-3 rounded-lg border border-zinc-700/50 group hover:bg-[#282828] transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{song.title}</span>
                      <span className="text-xs text-zinc-400">
                        {song.artist}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveSong(song)}
                      className="p-2 text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {removedSongs.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-sm font-semibold text-zinc-400">
                Removed Songs
              </label>
              <div className="flex flex-col gap-2 opacity-60">
                {removedSongs.map((song, index) => (
                  <div
                    key={index}
                    onClick={() => handleRecoverSong(song)}
                    className="flex items-center justify-between bg-[#1e1e1e] p-3 rounded-lg border border-zinc-700/30 cursor-pointer hover:bg-[#282828] transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold line-through text-zinc-500">
                        {song.title}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {song.artist}
                      </span>
                    </div>
                    <RotateCcw size={18} className="text-zinc-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-end flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={!playListName || playListListOfSongs.length === 0}
            className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            Create Playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCreator;
