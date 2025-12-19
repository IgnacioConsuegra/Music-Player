import React from "react";

import { useRef } from "react";
import AsideButton from "./AsideButton";

export default function VideoPlayer() {
  const videoRef = useRef(null);

  return (
    <aside className="hidden md:flex w-52 text-neutral-400 p-4 md:w-[15%] md:max-w-[15%] py-8 flex-col gap-10">
      <div>
        <h2 className="text-sm mb-4 tracking-wide px-4 text-white">Library</h2>

        <ul className="space-y-2 flex flex-col">
          {/* Active item */}
          <li>
            <AsideButton>Browse</AsideButton>
          </li>
          <li>
            <AsideButton>Songs</AsideButton>
          </li>
          <li>
            <AsideButton>Albums</AsideButton>
          </li>
          <li>
            <AsideButton>Radios</AsideButton>
          </li>
        </ul>
      </div>
      <div>
        <h2 className="text-sm mb-4 tracking-wide px-4 text-white">My music</h2>

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
  );
}
