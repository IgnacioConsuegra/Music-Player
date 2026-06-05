import React, { createContext, useState, useEffect } from "react";
import PlaylistCreator from "../components/PlayListCreation.jsx";
import toast from "react-hot-toast";

export const PlayListContext = createContext();

export function PlayListProvider({ children }) {
  const [playlists, setPlaylists] = useState([]);
  const [deletedPlaylists, setDeletedPlaylists] = useState([]);
  const [creatingPlayList, setCreatingPlayList] = useState(false);
  const [currentPlaylistName, setCurrentPlaylistName] = useState(null);
  const [isAddingPlayListWithNavBar, setIsAddingPlayListWithNavBar] =
    useState(false);
  const [isAddingPlayListWithHomePage, setIsAddingPlayListWithHomePage] =
    useState(false);

  useEffect(() => {
    const savedPlaylists = localStorage.getItem("myPlaylists");
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    }

    const savedDeletedPlaylists = localStorage.getItem("deletedPlaylists");
    if (savedDeletedPlaylists) {
      const parsedDeletedPlaylists = JSON.parse(savedDeletedPlaylists);
      const now = Date.now();
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

      const validDeletedPlaylists = parsedDeletedPlaylists.filter(
        playlist => now - playlist.deletedAt < thirtyDaysInMs,
      );

      if (validDeletedPlaylists.length !== parsedDeletedPlaylists.length) {
        localStorage.setItem(
          "deletedPlaylists",
          JSON.stringify(validDeletedPlaylists),
        );
      }

      setDeletedPlaylists(validDeletedPlaylists);
    }
  }, []);

  const onSave = ({ playListName, description, playListListOfSongs }) => {
    setPlaylists(prevPlaylists => {
      const existingPlaylistIndex = prevPlaylists.findIndex(
        p => p.playListName === playListName,
      );

      let updatedPlaylists;

      if (existingPlaylistIndex >= 0) {
        updatedPlaylists = [...prevPlaylists];
        updatedPlaylists[existingPlaylistIndex] = {
          playListName,
          description,
          playListListOfSongs,
        };
      } else {
        updatedPlaylists = [
          ...prevPlaylists,
          { playListName, description, playListListOfSongs },
        ];
      }

      localStorage.setItem("myPlaylists", JSON.stringify(updatedPlaylists));
      return updatedPlaylists;
    });
    setCreatingPlayList(false);
  };

  // Asegúrate de tener acceso a la variable de estado 'playlists'
  // (la que sale de const [playlists, setPlaylists] = useState(...))

  const addToPlaylist = ({ playListName, song }) => {
    console.log("Adding to playlist");
    if (!playListName.length) {
      toast.error("No playList name");
      return;
    }
    if (!song.url) {
      toast.error("No valid song added");
      return;
    }

    // 1. Calculamos todo AFUERA del setPlaylists usando la variable actual
    const existingPlaylistIndex = playlists.findIndex(
      p => p.playListName === playListName,
    );

    let updatedPlaylists;

    if (existingPlaylistIndex >= 0) {
      const existingPlaylist = playlists[existingPlaylistIndex];
      const songAlreadyExists = existingPlaylist.playListListOfSongs.some(
        s => s.url === song.url,
      );

      if (songAlreadyExists) {
        const updatedPlaylist = {
          ...existingPlaylist,
          playListListOfSongs: existingPlaylist.playListListOfSongs.filter(
            ({ url }) => url !== song.url,
          ),
        };
        updatedPlaylists = [...playlists];
        updatedPlaylists[existingPlaylistIndex] = updatedPlaylist;

        toast.success("Song removed from playList correctly");
      } else {
        const updatedPlaylist = {
          ...existingPlaylist,
          playListListOfSongs: [...existingPlaylist.playListListOfSongs, song],
        };

        updatedPlaylists = [...playlists];
        updatedPlaylists[existingPlaylistIndex] = updatedPlaylist;

        toast.success("Song added to playList correctly");
      }
    } else {
      const newPlaylist = {
        playListName,
        description: "",
        playListListOfSongs: [song],
      };
      updatedPlaylists = [...playlists, newPlaylist];
      toast.success("Playlist created and song added");
    }

    localStorage.setItem("myPlaylists", JSON.stringify(updatedPlaylists));

    setPlaylists(updatedPlaylists);
  };

  const removeFromPlaylist = ({ url, playListName }) => {
    setPlaylists(prevPlaylists => {
      const updatedPlaylists = prevPlaylists.map(playlist => {
        if (playlist.playListName === playListName) {
          return {
            ...playlist,
            playListListOfSongs: playlist.playListListOfSongs.filter(
              song => song.url !== url,
            ),
          };
        }
        return playlist;
      });

      localStorage.setItem("myPlaylists", JSON.stringify(updatedPlaylists));
      return updatedPlaylists;
    });
  };

  const deletePlayList = playListName => {
    setPlaylists(prevPlaylists => {
      const playlistToDelete = prevPlaylists.find(
        p => p.playListName === playListName,
      );

      if (playlistToDelete) {
        setDeletedPlaylists(prevDeleted => {
          const updatedDeleted = [
            ...prevDeleted,
            { ...playlistToDelete, deletedAt: Date.now() },
          ];
          localStorage.setItem(
            "deletedPlaylists",
            JSON.stringify(updatedDeleted),
          );
          return updatedDeleted;
        });
      }

      const updatedPlaylists = prevPlaylists.filter(
        p => p.playListName !== playListName,
      );
      localStorage.setItem("myPlaylists", JSON.stringify(updatedPlaylists));
      return updatedPlaylists;
    });

    if (currentPlaylistName === playListName) {
      setCurrentPlaylistName(null);
    }
  };

  const getDeletedPlaylists = () => {
    return deletedPlaylists;
  };

  const permanentlyDeletePlaylist = playListName => {
    setDeletedPlaylists(prevDeleted => {
      const updatedDeleted = prevDeleted.filter(
        p => p.playListName !== playListName,
      );
      localStorage.setItem("deletedPlaylists", JSON.stringify(updatedDeleted));
      return updatedDeleted;
    });
  };

  const recoverPlaylist = playListName => {
    setDeletedPlaylists(prevDeleted => {
      const playlistToRecover = prevDeleted.find(
        p => p.playListName === playListName,
      );

      if (playlistToRecover) {
        const { deletedAt, ...restOfPlaylist } = playlistToRecover;

        setPlaylists(prevPlaylists => {
          const updatedPlaylists = [...prevPlaylists, restOfPlaylist];
          localStorage.setItem("myPlaylists", JSON.stringify(updatedPlaylists));
          return updatedPlaylists;
        });
      }

      const updatedDeleted = prevDeleted.filter(
        p => p.playListName !== playListName,
      );
      localStorage.setItem("deletedPlaylists", JSON.stringify(updatedDeleted));
      return updatedDeleted;
    });
  };

  const getCurrentPlaylist = () => {
    return playlists.find(p => p.playListName === currentPlaylistName) || null;
  };

  const contextValue = {
    playlists,
    deletedPlaylists,
    currentPlaylistName,
    setCurrentPlaylistName,
    addToPlaylist,
    removeFromPlaylist,
    setCreatingPlayList,
    onSave,
    deletePlayList,
    getDeletedPlaylists,
    permanentlyDeletePlaylist,
    recoverPlaylist,
    getCurrentPlaylist,
    isAddingPlayListWithHomePage,
    isAddingPlayListWithNavBar,
    setIsAddingPlayListWithHomePage,
    setIsAddingPlayListWithNavBar,
  };

  return (
    <PlayListContext.Provider value={contextValue}>
      {children}
      {creatingPlayList && (
        <PlaylistCreator
          onSave={onSave}
          onClose={() => setCreatingPlayList(false)}
        />
      )}
    </PlayListContext.Provider>
  );
}

export default PlayListProvider;
