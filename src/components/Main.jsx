import React, { useContext } from "react";
import SongItem from "./SongItem";
import { MusicPlayerContext } from "../context/MusicPlayerContext";
import MusicBar from "./MusicBar";
import PopularArtists from "./PopularArtists";
import PopularThemes from "./PopularThemes";

const Main = () => {
  const { currentListOfSongs } = useContext(MusicPlayerContext);

  return (
    <section className="bg-black text-white w-full lg:w-full md:w-[70%] md:max-w-[70%]  md:border-2 border-yellow-white md:rounded-tl-[40px] md:rounded-bl-[40px] p-8 min-h-125">
      {/* Popular playList section */}
      <section className="hidden md:block">
        <h1>Popular playList</h1>
      </section>
      {/* Popular Artist sections */}
      <PopularArtists
        artists={[
          {
            name: "Sinatra",
            image:
              "https://m.media-amazon.com/images/M/MV5BYzFiNzVkMzQtNzljOS00NWUzLWI0YWYtZTllZjEwYTE1MjhmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
          },
          {
            name: "Sinatra",
            image:
              "https://m.media-amazon.com/images/M/MV5BYzFiNzVkMzQtNzljOS00NWUzLWI0YWYtZTllZjEwYTE1MjhmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
          },
          {
            name: "Sinatra",
            image:
              "https://m.media-amazon.com/images/M/MV5BYzFiNzVkMzQtNzljOS00NWUzLWI0YWYtZTllZjEwYTE1MjhmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
          },
          {
            name: "Sinatra",
            image:
              "https://m.media-amazon.com/images/M/MV5BYzFiNzVkMzQtNzljOS00NWUzLWI0YWYtZTllZjEwYTE1MjhmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
          },
          {
            name: "Sinatra",
            image:
              "https://m.media-amazon.com/images/M/MV5BYzFiNzVkMzQtNzljOS00NWUzLWI0YWYtZTllZjEwYTE1MjhmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
          },
          {
            name: "Sinatra",
            image:
              "https://m.media-amazon.com/images/M/MV5BYzFiNzVkMzQtNzljOS00NWUzLWI0YWYtZTllZjEwYTE1MjhmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
          },
          {
            name: "Sinatra",
            image:
              "https://m.media-amazon.com/images/M/MV5BYzFiNzVkMzQtNzljOS00NWUzLWI0YWYtZTllZjEwYTE1MjhmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
          },
        ]}
      />
      <PopularThemes
        artists={[
          {
            name: "Sinatra",
            image:
              "https://m.media-amazon.com/images/M/MV5BYzFiNzVkMzQtNzljOS00NWUzLWI0YWYtZTllZjEwYTE1MjhmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
          },
          {
            name: "Sinatra",
            image:
              "https://m.media-amazon.com/images/M/MV5BYzFiNzVkMzQtNzljOS00NWUzLWI0YWYtZTllZjEwYTE1MjhmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
          },
          {
            name: "Sinatra",
            image:
              "https://m.media-amazon.com/images/M/MV5BYzFiNzVkMzQtNzljOS00NWUzLWI0YWYtZTllZjEwYTE1MjhmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
          },
          {
            name: "Sinatra",
            image:
              "https://m.media-amazon.com/images/M/MV5BYzFiNzVkMzQtNzljOS00NWUzLWI0YWYtZTllZjEwYTE1MjhmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
          },
          {
            name: "Sinatra",
            image:
              "https://m.media-amazon.com/images/M/MV5BYzFiNzVkMzQtNzljOS00NWUzLWI0YWYtZTllZjEwYTE1MjhmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
          },
          {
            name: "Sinatra",
            image:
              "https://m.media-amazon.com/images/M/MV5BYzFiNzVkMzQtNzljOS00NWUzLWI0YWYtZTllZjEwYTE1MjhmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
          },
          {
            name: "Sinatra",
            image:
              "https://m.media-amazon.com/images/M/MV5BYzFiNzVkMzQtNzljOS00NWUzLWI0YWYtZTllZjEwYTE1MjhmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
          },
        ]}
      />
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
      {/* Music player section */}
      <MusicBar url={"../public/music/alicia.mp3"} />
    </section>
  );
};

export default Main;
