import React, { useContext } from "react";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useRef } from "react";
import { MusicPlayerContext } from "../../context/MusicPlayerContext.jsx";
import ClickableButton from "../../components/ClickableButton.jsx";

const PopularCategory = () => {
  const scrollRef = useRef(null);
  const {
    handleChangeCategory,
    handleResetCategory,
    currentListOfCategories,
    currentCategory,
  } = useContext(MusicPlayerContext);
  const scroll = direction => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="relative group py-8 px-4 text-white w-full ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex gap-2 text-xl font-bold">
          List of Categories{" "}
          <ClickableButton>
            <RotateCcw
              className="cursor-pointer"
              onClick={handleResetCategory}
            />
          </ClickableButton>
        </h2>
        <button className="text-sm text-gray-400 hover:underline">
          See all
        </button>
      </div>

      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-white/20"
      >
        <ChevronLeft size={24} className="cursor-pointer" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-white/20"
      >
        <ChevronRight size={24} className="cursor-pointer" />
      </button>

      <div
        ref={scrollRef}
        className="flex flex-row overflow-x-auto gap-4 scroll-smooth no-scrollbar w-full md:overflow-x-hidden"
      >
        {currentListOfCategories.map((category, index) => (
          <ClickableButton key={index}>
            <div
              className="flex-none w-32 md:w-40 text-center cursor-pointer group/item"
              onClick={() => handleChangeCategory(category)}
            >
              <div className="relative mb-3">
                <img
                  src={`https://m.media-amazon.com/images/M/MV5BYzFiNzVkMzQtNzljOS00NWUzLWI0YWYtZTllZjEwYTE1MjhmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg`}
                  alt={category}
                  className={`w-full aspect-square object-cover rounded-full border-2 
                      ${
                        category === currentCategory
                          ? "border-3 border-[#444]"
                          : "border-transparent"
                      }
  
                    group-hover/item:border-white
                    transition-all duration-300`}
                />
              </div>
              <p className="text-sm font-medium truncate">{category}</p>
            </div>
          </ClickableButton>
        ))}
      </div>
    </section>
  );
};
export default PopularCategory;
