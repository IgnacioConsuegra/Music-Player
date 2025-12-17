import React, { useContext } from "react";
import SongItem from "./SongItem";
import { MusicPlayerContext } from "../context/MusicPlayerContext";

const Main = () => {
  const { currentListOfSongs } = useContext(MusicPlayerContext);

  return (
    <section className="bg-black text-white w-full md:w-[70%] border-2 border-yellow-white md:rounded-tl-[40px] md:rounded-bl-[40px] p-8">
      {/* Popular playList section */}
      <section className="hidden md:block">
        <h1>Popular playList</h1>
      </section>
      {/* Popular Artist sections */}
      <section className="hidden md:block">
        <h2>Popular Artist</h2>
      </section>
      {/* SongsSection */}
      <section>
        <h2>Recently played</h2>
        <div className="flex flex-col gap-4">
          {currentListOfSongs.map((value, index) => {
            return (
              <SongItem
                key={index}
                artist={value.artist}
                category={value.category}
                title={value.title}
                url={value.url}
              />
            );
          })}
        </div>
      </section>
    </section>
  );
};

export default Main;
