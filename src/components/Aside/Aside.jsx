import React from "react";

import AsideButton from "./AsideButton";
import { Link } from "react-router-dom";
import { Music, Video, BookOpen } from "lucide-react";
const Aside = () => {
  return (
    <>
      <aside className="hidden md:flex md:w-[15%] md:max-w-[15%] w-52 text-neutral-400 p-4  py-8 flex-col gap-10">
        <div>
          <h2 className="text-sm mb-4 tracking-wide px-4 text-white">Media</h2>

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
            <Link to="/pdf">
              <li>
                <AsideButton>Pdf</AsideButton>
              </li>
            </Link>
          </ul>
        </div>
        <div>
          <h2 className="text-sm mb-4 tracking-wide px-4 text-white">Others</h2>

          <ul className="space-y-2 flex flex-col">
            {/* Active item */}

            <Link to="/favorites">
              <AsideButton>Favorites</AsideButton>
            </Link>
            <Link to="/playlist">
              <AsideButton>My Playlists</AsideButton>
            </Link>
            <Link to="/impostor">
              <AsideButton>Impostor game</AsideButton>
            </Link>
            <Link to="/editor">
              <li>
                <AsideButton>Code editor</AsideButton>
              </li>
            </Link>
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
          <Link to="/pdf">
            <li>
              <AsideButton>
                <BookOpen />
              </AsideButton>
            </li>
          </Link>
        </ul>
      </aside>
    </>
  );
};

export default Aside;
