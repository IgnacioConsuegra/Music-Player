import React, { useContext } from "react";
import SongItem from "./SongItem.jsx";
import { MusicPlayerContext } from "../../context/MusicPlayerContext.jsx";
import PopularArtists from "./PopularArtists";
import PopularCategory from "./PopularCategory";
import { RotateCcw } from "lucide-react";
import ClickableButton from "../../components/ClickableButton.jsx";
const Main = () => {
  const { currentListOfSongs, currentListOfArtist, handleResetFilters } =
    useContext(MusicPlayerContext);
  return (
    <section
      className={`bg-black min-h-screen text-white w-full lg:w-full md:w-[85%] md:max-w-[85%]  
        md:border-2 border-transparent md:rounded-tl-[40px] md:rounded-bl-[40px] p-8 pb-30 `}
    >
      {/* Popular playList section */}
      <section className="hidden md:block">
        <h1>Popular playList</h1>
      </section>
      {/* Popular Artist sections */}
      <PopularArtists artistList={currentListOfArtist} />
      <PopularCategory />
      {/* SongsSection */}
      <section className="overflow-hidden">
        <h2 className="flex gap-2">
          List of songs{" "}
          <ClickableButton>
            <RotateCcw
              className="cursor-pointer"
              onClick={handleResetFilters}
            />
          </ClickableButton>
        </h2>
        <div className="flex flex-col gap-4">
          {currentListOfSongs.map((value, index) => {
            return (
              <ClickableButton key={index}>
                <SongItem
                  artist={value.artist}
                  category={value.category}
                  title={value.title}
                  url={value.url}
                />
              </ClickableButton>
            );
          })}
        </div>
      </section>
      {/* Music player section */}
    </section>
  );
};

export default Main;
