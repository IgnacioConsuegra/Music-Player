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
function MusicBar() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null); // This is pointing to our audio tag, so the audio player can take actions on it.
  const canvasRef = useRef(null); //Our canvas Pointer
  const musicPlayerRef = useRef(null); // This points to my AudioPlayer class
  const firstTime = useRef(false); // This it's handling the de strict mode in react.
  const { currentSong, handleSkip, currentSongInfo, setIsSongFinished } =
    useContext(MusicPlayerContext);
  const [isChevronUp, setIsChevronUp] = useState(false);
  const [songLength, setSongLength] = useState();
  const [currentTime, setCurrentTime] = useState(0);
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
  const handleSongIsFinished = () => {
    setIsSongFinished(true);
  };
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
    const audioDuration = Math.floor(audio.duration);
    const conversion = (seconds * 100) / audioDuration;
    return conversion;
  };
  const handleModifyTime = seconds => {
    audioRef.current.currentTime += seconds;
  };
  useEffect(() => {
    if (!currentSongInfo["artist"]) return;
    setCurrentTime(0);
    setTimeout(() => {
      setSongLength(Math.floor(audioRef.current.duration));
    }, 1000);
  }, [currentSongInfo]);
  return (
    <>
      <div
        className={` ${!currentSong ? "hidden" : "block"} 
      fixed z-50 bottom-9   md:bottom-[0%] left-1/2 -translate-x-1/2 w-[95%] md:w-[60%] 
    border  rounded-t-lg items-center bg-black p-4 
    pointer-events-auto flex flex-row gap-4 md:h-14`}
      >
        <audio ref={audioRef} src={currentSong} />
        {/* <button onClick={handleIncrease}>Increase</button> */}
        {/* 1. Music Info - 50% on mobile, 30% om desktop */}
        {!isChevronUp ? (
          <>
            <div className="flex basis-1/3 md:basis-[30%] shrink-0 items-center gap-3 min-w-0">
              <div
                className="animate-spin shrink-0"
                style={{
                  animationDuration: "4s",
                  animationPlayState: isMusicPlaying ? "running" : "paused",
                }}
              ></div>
              <div className="truncate text-white">
                <p className="font-bold truncate text-sm md:text-base">
                  {currentSongInfo["artist"]}
                </p>
                <p className="text-xs md:text-sm opacity-70 truncate">
                  {currentSongInfo["title"]}
                </p>
              </div>
            </div>

            {/* 2. Music Handle - 50% on mobile, 20% on desktop */}
            <div className="flex basis-1/2 md:basis-[20%] shrink-0 justify-center items-center gap-4">
              <ClickableButton className={"text-white hover:text-gray-400"}>
                <SkipBack size={20} onClick={() => handleSkip(-1)} />
              </ClickableButton>
              <ClickableButton
                onClick={handleTogglePlay}
                className="cursor-pointer text-white"
              >
                {isMusicPlaying ? <Pause size={28} /> : <Play size={28} />}
              </ClickableButton>
              <ClickableButton className={"text-white hover:text-gray-400"}>
                <SkipForward size={20} onClick={() => handleSkip(1)} />
              </ClickableButton>
            </div>

            {/* 3. Music Visualizer - hidden on mobile, show on middle screens (700px+) */}
            <div className="hidden md:flex flex-2 h-full">
              <canvas ref={canvasRef} className="w-full h-full rounded-lg " />
            </div>
          </>
        ) : (
          <div className="w-full">
            <p className="text-white">
              {formatTime(currentTime)} {formatTime(songLength)}
            </p>
            <input
              className="bg-white w-full"
              type="range"
              min="0"
              defaultValue="0"
              max="100"
              step="1"
              //
              value={handleInputChange(currentTime)}
              onChange={handleTimeChange}
            ></input>
          </div>
        )}
        <div>
          <ClickableButton onClick={handleChevronUp}>
            <ChevronsUp
              className={`text-white ${isChevronUp && "rotate-180"}`}
            />
          </ClickableButton>
        </div>
      </div>

      <div className="fixed z-50 bottom-0 left-0 w-full bg-black/95 border-t border-gray-800 p-3 md:p-4 flex flex-col md:flex-row items-center gap-4 transition-all duration-300">
        <audio ref={audioRef} src={currentSong} />

        <div className="flex w-full md:w-1/3 items-center justify-between md:justify-start gap-4">
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
            <button className="text-gray-400 hover:text-emerald-500 transition-colors">
              <Heart size={20} />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full md:w-1/3 items-center gap-2">
          <div className="flex items-center gap-4 md:gap-6">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Repeat size={18} />
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
            <span>{formatTime(currentTime)}</span>
            <input
              className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white hover:accent-emerald-500 transition-all"
              type="range"
              min="0"
              max={songLength || 100}
              value={currentTime}
              onChange={handleTimeChange}
            />
            <span>{formatTime(songLength)}</span>
          </div>
        </div>

        <div className="hidden md:flex w-full md:w-1/3 justify-end items-center">
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
