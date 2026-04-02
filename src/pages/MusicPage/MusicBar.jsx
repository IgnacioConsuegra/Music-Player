import React, { useContext, useEffect, useRef, useState } from "react";
import { AudioPlayer } from "../../lib/oscillator.js";
import { MusicPlayerContext } from "../../context/MusicPlayerContext.jsx";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Disc3,
  ChevronsUp,
} from "lucide-react";

import { Heart, Plus, Repeat, RotateCw, RotateCcw } from "lucide-react";
import ClickableButton from "../../components/ClickableButton.jsx";
import { FavoritesContext } from "../../context/FavoritesContext.jsx";
function MusicBar() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null); // This is pointing to our audio tag, so the audio player can take actions on it.
  const canvasRef = useRef(null); //Our canvas Pointer
  const musicPlayerRef = useRef(null); // This points to my AudioPlayer class
  const firstTime = useRef(false); // This it's handling the de strict mode in react.
  const {
    currentSong,
    handleSkip,
    currentSongInfo,
    setIsSongFinished,
    repeatSong,
    setRepeatSong,
  } = useContext(MusicPlayerContext);
  const { addToFavorites, listOfFavorites } = useContext(FavoritesContext);
  const [isChevronUp, setIsChevronUp] = useState(false);
  const [songLength, setSongLength] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [finishedSong, setFinishedSong] = useState(false);
  useEffect(() => {
    //Don't remove this if no matter what otherwise Everything it's gonna break.
    if (import.meta.env.DEV) {
      if (!firstTime.current) {
        firstTime.current = true;
        return;
      }
    }

    musicPlayerRef.current = new AudioPlayer(
      audioRef.current,
      canvasRef.current,
      handleSongIsPlaying,
      handleSongIsPaused,
      handleSongIsFinished,
      handleTogglePlay,
      handleUpdateProgress,
    );

    return () => {
      musicPlayerRef.current?.destroy();
      musicPlayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!currentSong.length) {
      return;
    }
    musicPlayerRef.current.playAudio();
    handleSongIsPlaying(true);
  }, [currentSong]);

  const handleTogglePlay = () => {
    musicPlayerRef.current.togglePlay();
  };
  function handleSongIsFinished() {
    setFinishedSong(true);
  }
  useEffect(() => {
    if (finishedSong) {
      if (repeatSong) {
        musicPlayerRef.current?.repeatSong();
      } else {
        setIsSongFinished(true);
      }
      setFinishedSong(false);
    }
  }, [finishedSong]);
  const handleSongIsPlaying = () => {
    setIsMusicPlaying(true);
  };
  const handleSongIsPaused = () => {
    setIsMusicPlaying(false);
  };
  const handleUpdateProgress = time => {
    setCurrentTime(time);
  };
  const handleChevronUp = () => {
    setSongLength(Math.floor(audioRef.current.duration));
    setIsChevronUp(!isChevronUp);
  };
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const handleTimeChange = e => {
    const value = Number(e.target.value);
    const audio = audioRef.current;
    const audioDuration = Math.floor(audio.duration);
    const conversion = (audioDuration * value) / 100;
    audioRef.current.currentTime = conversion;
  };
  const handleInputChange = seconds => {
    const audio = audioRef.current;
    if (!audio) return 0;
    const audioDuration = Math.floor(audio.duration);
    if (!audioDuration) return 0;
    const conversion = (seconds * 100) / audioDuration;
    return conversion || 0;
  };
  const handleModifyTime = seconds => {
    audioRef.current.currentTime += seconds;
  };
  useEffect(() => {
    if (!currentSongInfo["artist"]) return;
    setCurrentTime(0);
  }, [currentSongInfo]);
  return (
    <>
      <div className="fixed z-50 bottom-0 left-0 w-full bg-black/95 border-t border-gray-800 p-3 md:p-4 flex flex-col md:flex-row items-center gap-4 transition-all duration-300">
        <audio
          ref={audioRef}
          src={currentSong}
          onLoadedMetadata={() =>
            setSongLength(Math.floor(audioRef.current.duration))
          }
        />

        <div
          className={`flex w-full md:w-1/3 ${isChevronUp && "md:w-3/12"}  items-center justify-between md:justify-start gap-4`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="truncate text-white">
              <p className="font-bold truncate text-sm md:text-base">
                {currentSongInfo["title"]}
              </p>
              <p className="text-xs md:text-sm text-gray-400 truncate">
                {currentSongInfo["artist"]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 md:ml-4">
            <button
              className="text-gray-400 hover:text-emerald-500 transition-colors"
              onClick={() => addToFavorites(currentSongInfo)}
            >
              <Heart
                size={20}
                className={`${listOfFavorites.some(value => value.url === currentSongInfo.url) && "fill-emerald-500 text-emerald-500"}`}
              />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Plus size={20} />
            </button>
            <button
              onClick={handleChevronUp}
              className="md:hidden text-gray-400 hover:text-white transition-colors"
            >
              <ChevronsUp
                size={24}
                className={`transition-transform duration-300 ${isChevronUp ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>
        <div
          className={`flex flex-col w-full md:w-1/3 items-center gap-2 ${isChevronUp && "hidden"}`}
        >
          <div className="flex items-center gap-4 md:gap-6">
            <button
              className={`text-gray-400 hover:text-white transition-colors `}
            >
              <Repeat
                size={18}
                className={`${repeatSong && "fill-emerald-500 text-emerald-500"}`}
                onClick={() => setRepeatSong(repeatSong => !repeatSong)}
              />
            </button>

            {/* Delay 10 seconds */}

            <button
              onClick={() => handleModifyTime(-5)}
              className="text-gray-400 hover:text-white transition-colors"
              title="delay 10 seconds"
            >
              <RotateCcw size={18} />
            </button>
            {/* Last song  */}

            <button
              onClick={() => handleSkip(-1)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <SkipBack size={24} fill="currentColor" />
            </button>
            {/* Pause button */}
            <button
              onClick={handleTogglePlay}
              className="text-black bg-white rounded-full p-2 hover:scale-105 transition-transform"
            >
              {isMusicPlaying ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play size={24} fill="currentColor" className="ml-0.5" />
              )}
            </button>

            {/* Next button */}
            <button
              onClick={() => handleSkip(1)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <SkipForward size={24} fill="currentColor" />
            </button>

            {/* Fast forward 10 seconds */}
            <button
              onClick={() => handleModifyTime(5)}
              className="text-gray-400 hover:text-white transition-colors"
              title="fast forward 10s"
            >
              <RotateCw size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full max-w-md text-xs text-gray-400 font-mono">
            <span>{formatTime(currentTime) || 0}</span>
            <input
              className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white hover:accent-emerald-500 transition-all"
              type="range"
              min="0"
              max="100"
              step="1"
              //
              value={handleInputChange(currentTime)}
              onChange={handleTimeChange}
            />
            <span>{formatTime(songLength)}</span>
          </div>
        </div>
        {/* Canvas */}
        <div
          className={`flex flex-col w-full  md:w-7/12 max-h-full items-center gap-2 ${!isChevronUp && "hidden "}`}
        >
          <canvas ref={canvasRef} className="w-full h-8 rounded-lg " />
        </div>
        <div
          className={`hidden md:flex w-full ${isChevronUp && "md:w-2/12"} md:w-1/3 justify-end items-center`}
        >
          <button
            onClick={handleChevronUp}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ChevronsUp
              size={24}
              className={`transition-transform duration-300 ${isChevronUp ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>
    </>
  );
}

export default MusicBar;
