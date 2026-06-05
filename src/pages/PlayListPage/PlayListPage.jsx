import React, { useContext, useState } from "react";
import { PlayListContext } from "../../context/PlayListContext.jsx";
import { Trash2, Edit3, RotateCcw, Plus, AlertTriangle, X } from "lucide-react";
import PlaylistViewPage from "./PlayListViewPage.jsx";

const PlaylistsPage = () => {
  const {
    playlists,
    deletedPlaylists,
    setCreatingPlayList,
    setCurrentPlaylistName,
    deletePlayList,
    permanentlyDeletePlaylist,
    recoverPlaylist,
  } = useContext(PlayListContext);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    playlistName: "",
    type: "",
  });
  const [confirmationText, setConfirmationText] = useState("");
  const [isPlayListOpen, setIsPlayListOpen] = useState(false);
  const [selectedPlayListName, setSelectedPlayListName] = useState(null);
  const handleEdit = playlistName => {
    setCurrentPlaylistName(playlistName);
    setCreatingPlayList(true);
  };

  const handleCreateNew = () => {
    setCurrentPlaylistName(null);
    setCreatingPlayList(true);
  };

  const openDeleteModal = (playlistName, type) => {
    setDeleteModal({ isOpen: true, playlistName, type });
    setConfirmationText("");
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, playlistName: "", type: "" });
    setConfirmationText("");
  };

  const handleConfirmDelete = () => {
    const text = confirmationText.trim().toLowerCase();

    if (deleteModal.type === "soft" && text === "delete") {
      deletePlayList(deleteModal.playlistName);
      closeDeleteModal();
    } else if (deleteModal.type === "hard" && text === "delete definitively") {
      permanentlyDeletePlaylist(deleteModal.playlistName);
      closeDeleteModal();
    }
  };

  const isConfirmDisabled = () => {
    const text = confirmationText.trim().toLowerCase();

    if (deleteModal.type === "soft") return text !== "delete";
    if (deleteModal.type === "hard") return text !== "delete definitively";
    return true;
  };
  const handleOpeningPlaylist = playList => {
    setIsPlayListOpen(true);
    setSelectedPlayListName(playList.playListName);
  };
  const onBack = () => {
    setIsPlayListOpen(false);
  };
  return (
    <div className="min-h-screen bg-[#121212] text-white p-8 w-full">
      {!isPlayListOpen && (
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-4xl font-bold">My Playlists</h1>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 cursor-pointer bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
              <Plus size={20} />
              Create Playlist
            </button>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-zinc-300 border-b border-zinc-800 pb-2">
              Active Playlists
            </h2>
            {playlists.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500 bg-[#1e1e1e] rounded-xl border border-zinc-800 border-dashed">
                <p>No active playlists found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playlists.map(playlist => (
                  <div
                    key={playlist.playListName}
                    className="bg-[#1e1e1e] border border-zinc-800 rounded-xl p-6 hover:border-zinc-600 transition-colors group relative flex flex-col h-full"
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleOpeningPlaylist(playlist)}
                    >
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                        {playlist.playListName}
                      </h3>
                      <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                        {playlist.description || "No description provided."}
                      </p>
                      <p className="text-sm font-semibold text-zinc-500">
                        {playlist.playListListOfSongs.length} songs
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/50">
                      <button
                        onClick={() => handleEdit(playlist.playListName)}
                        className="p-2 cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() =>
                          openDeleteModal(playlist.playListName, "soft")
                        }
                        className="p-2 cursor-pointer text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {deletedPlaylists.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-zinc-500 border-b border-zinc-800 pb-2 flex items-center gap-2">
                <Trash2 size={24} />
                Recently Deleted
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deletedPlaylists.map(playlist => (
                  <div
                    key={playlist.playListName}
                    className="bg-[#181818] border border-red-900/30 rounded-xl p-6 flex flex-col h-full opacity-80"
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-zinc-400 line-through">
                        {playlist.playListName}
                      </h3>
                      <p className="text-zinc-500 text-sm mb-4">
                        Deleted on:{" "}
                        {new Date(playlist.deletedAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-semibold text-zinc-600">
                        {playlist.playListListOfSongs.length} songs
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/50">
                      <button
                        onClick={() => recoverPlaylist(playlist.playListName)}
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                      >
                        <RotateCcw size={16} />
                        Recover
                      </button>
                      <button
                        onClick={() =>
                          openDeleteModal(playlist.playListName, "hard")
                        }
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <AlertTriangle size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#181818] border border-zinc-800 rounded-xl p-6 shadow-2xl relative">
            <button
              onClick={closeDeleteModal}
              className="absolute top-4 right-4 p-2 cursor-pointer text-zinc-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4 text-red-500">
              <AlertTriangle size={28} />
              <h3 className="text-xl font-bold text-white">
                {deleteModal.type === "soft"
                  ? "Delete Playlist"
                  : "Permanently Delete Playlist"}
              </h3>
            </div>

            <p className="text-zinc-400 mb-6 leading-relaxed">
              {deleteModal.type === "soft" ? (
                <>
                  Are you sure you want to delete{" "}
                  <strong>{deleteModal.playlistName}</strong>? It will be moved
                  to the recently deleted section for 30 days. Type{" "}
                  <span className="text-red-400 font-mono bg-red-400/10 px-2 py-1 rounded">
                    Delete
                  </span>{" "}
                  to confirm.
                </>
              ) : (
                <>
                  This action cannot be undone.{" "}
                  <strong>{deleteModal.playlistName}</strong> will be lost
                  forever. Type{" "}
                  <span className="text-red-400 font-mono bg-red-400/10 px-2 py-1 rounded">
                    Delete Definitively
                  </span>{" "}
                  to confirm.
                </>
              )}
            </p>

            <input
              type="text"
              value={confirmationText}
              onChange={e => setConfirmationText(e.target.value)}
              placeholder={
                deleteModal.type === "soft" ? "Delete" : "Delete Definitively"
              }
              className="w-full bg-[#121212] border border-zinc-700 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-red-500 transition-colors text-white"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-5 py-2.5 rounded-lg cursor-pointer text-zinc-300 hover:bg-zinc-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isConfirmDisabled()}
                className="px-5 py-2.5 rounded-lg cursor-pointer bg-red-600 text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {isPlayListOpen && (
        <PlaylistViewPage playlistName={selectedPlayListName} onBack={onBack} />
      )}
    </div>
  );
};

export default PlaylistsPage;
