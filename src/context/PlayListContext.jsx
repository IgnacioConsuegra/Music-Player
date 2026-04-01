import React, { createContext, useState, useEffect } from "react";

export const PlayListContext = createContext();

/* eslint-disable no-unused-vars */
// eslint-disable-next-line react/prop-types
export function PlayListProvider({ children }) {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const savedPlaylists = localStorage.getItem("myPlaylists");
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    }
  }, []);

  const addToPlaylist = ({ url, title, artist, playListName }) => {
    setPlaylists(prevPlaylists => {
      const existingPlaylistIndex = prevPlaylists.findIndex(
        p => p.name === playListName,
      );

      let updatedPlaylists;

      if (existingPlaylistIndex >= 0) {
        // --- PLAYLIST EXISTS ---
        const existingPlaylist = prevPlaylists[existingPlaylistIndex];

        // Optional: Check if the song is already in this playlist to avoid duplicates
        const songAlreadyExists = existingPlaylist.songs.some(
          song => song.url === url,
        );
        if (songAlreadyExists) {
          console.warn("Song is already in this playlist!");
          return prevPlaylists; // Do nothing if it's a duplicate
        }

        // Add the new song to the existing playlist's 'songs' array
        const updatedPlaylist = {
          ...existingPlaylist,
          songs: [...existingPlaylist.songs, { url, title, artist }],
        };

        // Replace the old playlist object with the updated one
        updatedPlaylists = [...prevPlaylists];
        updatedPlaylists[existingPlaylistIndex] = updatedPlaylist;
      } else {
        // --- PLAYLIST DOES NOT EXIST ---
        // Create a completely new playlist object
        const newPlaylist = {
          name: playListName,
          songs: [{ url, title, artist }],
        };

        updatedPlaylists = [...prevPlaylists, newPlaylist];
      }

      // Save to localStorage and update state
      localStorage.setItem("myPlaylists", JSON.stringify(updatedPlaylists));
      return updatedPlaylists;
    });
  };

  // 4. Remove a song from a specific playlist
  const removeFromPlaylist = ({ url, playListName }) => {
    setPlaylists(prevPlaylists => {
      const updatedPlaylists = prevPlaylists.map(playlist => {
        // Only modify the playlist that matches the name
        if (playlist.name === playListName) {
          return {
            ...playlist,
            // Filter out the song with the matching URL
            songs: playlist.songs.filter(song => song.url !== url),
          };
        }
        return playlist;
      });

      localStorage.setItem("myPlaylists", JSON.stringify(updatedPlaylists));
      return updatedPlaylists;
    });
  };

  // 5. Bundle it all in the context value
  const contextValue = {
    playlists, // This replaces listOfFavorites
    addToPlaylist,
    removeFromPlaylist,
  };

  return (
    <PlayListContext.Provider value={contextValue}>
      {children}
    </PlayListContext.Provider>
  );
}
