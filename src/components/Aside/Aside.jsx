import React from "react";

import AsideButton from "./AsideButton";
import { Link } from "react-router-dom";
import { Music, Video } from "lucide-react";
const Aside = () => {
  return (
    <>
      <aside className="hidden md:flex md:w-[15%] md:max-w-[15%] w-52 text-neutral-400 p-4  py-8 flex-col gap-10">
        <div>
          <h2 className="text-sm mb-4 tracking-wide px-4 text-white">
            Library
          </h2>

          <ul className="space-y-2 flex flex-col">
            {/* Active item */}
            <Link to="/videos">
              <li>
                <AsideButton>Videos</AsideButton>
              </li>
            </Link>
            <Link to="/songs">
              <li>
                <AsideButton>Songs</AsideButton>
              </li>
            </Link>
            <li>
              <AsideButton>Albums</AsideButton>
            </li>
            <li>
              <AsideButton>Radios</AsideButton>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm mb-4 tracking-wide px-4 text-white">
            My music
          </h2>

          <ul className="space-y-2 flex flex-col">
            {/* Active item */}
            <li>
              <AsideButton>Recent</AsideButton>
            </li>
            <li>
              <AsideButton>Favorites</AsideButton>
            </li>
            <li>
              <AsideButton>My Playlist</AsideButton>
            </li>
          </ul>
        </div>
      </aside>
      <aside
        className={`fixed bottom-0 h-10 w-full z-50  text-white bg-black md:hidden `}
      >
        <ul className="flex flex-row w-full align-middle justify-center-safe">
          {/* Active item */}
          <Link to="/songs">
            <li>
              <AsideButton>
                <Music />
              </AsideButton>
            </li>
          </Link>
          <Link to="/videos">
            <li>
              <AsideButton>
                <Video />
              </AsideButton>
            </li>
          </Link>
        </ul>
      </aside>
    </>
  );
};

export default Aside;
