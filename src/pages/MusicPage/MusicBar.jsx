import React, { useContext, useEffect, useRef, useState } from "react";
import { AudioPlayer } from "../../lib/oscillator.js";
import { MusicPlayerContext } from "../../context/MusicPlayerContext.jsx";
import { Play, Pause, SkipForward, SkipBack, Disc3 } from "lucide-react";
import ClickableButton from "../../components/ClickableButton.jsx";
function MusicBar() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null); // This is pointing to our audio tag, so the audio player can take actions on it.
  const canvasRef = useRef(null); //Our canvas Pointer
  const musicPlayerRef = useRef(null); // This points to my AudioPlayer class
  const firstTime = useRef(false); // This it's handling the de strict mode in react.
  const { currentSong, handleSkip, currentSongInfo, setIsSongFinished } =
    useContext(MusicPlayerContext);

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
      handleTogglePlay
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

  return (
    <div
      className={` ${!currentSong ? "hidden" : "block"} 
      fixed z-50 bottom-9   md:bottom-[0%] left-1/2 -translate-x-1/2 w-[95%] md:w-[60%] 
     border  rounded-t-lg items-center bg-black p-4 
     
    pointer-events-auto flex flex-row gap-4 md:h-14`}
    >
      <audio ref={audioRef} src={currentSong} />
      {/* <button onClick={handleIncrease}>Increase</button> */}
      {/* 1. Music Info - 50% on mobile, 30% om desktop */}
      <div className="flex basis-1/3 md:basis-[30%] shrink-0 items-center gap-3 min-w-0">
        <div
          className="animate-spin shrink-0"
          style={{
            animationDuration: "4s",
            animationPlayState: isMusicPlaying ? "running" : "paused",
          }}
        >
          <Disc3 />
        </div>
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
      <div className="hidden md:flex flex-1 h-full">
        <canvas ref={canvasRef} className="w-full h-full rounded-lg " />
      </div>
    </div>
  );
}

export default MusicBar;
