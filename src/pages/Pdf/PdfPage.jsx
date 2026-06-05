import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export default function PdfPage() {
  const [activeEpub, setActiveEpub] = useState(null);

  const handleOpenEpub = epub => {
    console.log("Opening epub : ", epub);
    setActiveEpub(epub);
  };
  const goBackHome = () => {
    setActiveEpub(null);
    return;
  };

  return (
    <>
      {activeEpub ? (
        <EpubReader activeEpub={activeEpub} goBackHome={goBackHome} />
      ) : (
        <EpubDashboard handleOpenEpub={handleOpenEpub} />
      )}
    </>
  );
}

const EpubDashboard = ({ handleOpenEpub }) => {
  const [continueReading, setContinueReading] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [epubList, setEpubList] = useState([]);

  useEffect(() => {
    const loadEpubs = async () => {
      try {
        const res = await fetch("/epubList.json");
        const epubs = await res.json();
        setEpubList(epubs);
      } catch (error) {
        console.error("Error loading epub:", error);
      }
    };

    loadEpubs();

    const saved = JSON.parse(localStorage.getItem("continueReading")) || [];
    setContinueReading(saved);
  }, []);

  const handleRemove = (e, targetUrl) => {
    e.stopPropagation();
    const updated = continueReading.filter(item => item.url !== targetUrl);
    setContinueReading(updated);
    localStorage.setItem("continueReading", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans w-full">
      <div className="max-w-3xl mx-auto mb-12 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search EPUBs..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-[#1a1a1a] text-white rounded-full py-3 pl-12 pr-6 outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder-gray-500"
        />
      </div>

      {continueReading.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-orange-500">
            Continue reading
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {continueReading.map(epub => (
              <div
                key={epub.url}
                className="relative flex-none w-72 cursor-pointer group rounded-lg overflow-hidden transition-transform hover:scale-105 bg-[#121212]"
                onClick={() => handleOpenEpub(epub)}
              >
                <img
                  src={epub.coverUrl}
                  alt={epub.title}
                  className="w-full h-40 object-cover opacity-80 group-hover:opacity-100"
                />

                <button
                  onClick={e => handleRemove(e, epub.url)}
                  className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-20"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-800">
                  <div
                    className="h-full bg-orange-600 transition-all"
                    style={{
                      width: `${(epub.currentPage / epub.totalPages) * 100}%`,
                    }}
                  />
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-200 truncate">
                    {epub.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Page {epub.currentPage} of {epub.totalPages}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">All EPUBs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {epubList
            .filter(epub =>
              epub.title.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map(epub => {
              const dynamicCover = `https://placehold.co/300x450/1a1a1a/FFF?text=${encodeURIComponent(epub.title)}`;
              return (
                <div
                  key={epub.url}
                  className="cursor-pointer group transition-transform hover:scale-105"
                  onClick={() => handleOpenEpub(epub)}
                >
                  <img
                    src={dynamicCover}
                    alt={epub.title}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-sm font-medium text-gray-200 truncate">
                    {epub.title}
                  </h3>
                </div>
              );
            })}

          {epubList.filter(epub =>
            epub.title.toLowerCase().includes(searchTerm.toLowerCase()),
          ).length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              No EPUBs found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import ePub from "epubjs";

export function EpubReader({ activeEpub, goBackHome }) {
  const [url] = useState(activeEpub?.url || activeEpub?.epubUrl || "");
  const [bookTitle] = useState(activeEpub?.title || "Unknown Book");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [readingTime, setReadingTime] = useState(() => {
    const savedData = localStorage.getItem(`epub_meta_${url}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      return parsed.readingTime || 0;
    }
    return 0;
  });

  const viewerRef = useRef(null);
  const renditionRef = useRef(null);
  const bookRef = useRef(null);

  const [toc, setToc] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentChapterName, setCurrentChapterName] = useState("Loading...");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPageNum, setCurrentPageNum] = useState(1);

  const [bookmarks, setBookmarks] = useState(() => {
    const savedData = localStorage.getItem(`epub_meta_${url}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      return parsed.bookmarks || [];
    }
    return [];
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setReadingTime(prevTime => prevTime + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!url || !viewerRef.current) return;

    const book = ePub(url);
    bookRef.current = book;

    const rendition = book.renderTo(viewerRef.current, {
      width: "100%",
      height: "100%",
      spread: "none",
      manager: "continuous",
      flow: "paginated",
      allowScriptedContent: true,
    });

    renditionRef.current = rendition;

    const savedData = localStorage.getItem(`epub_meta_${url}`);
    let initialCfi = null;
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.currentLocation) {
        initialCfi = parsed.currentLocation;
      }
    }

    rendition.display(initialCfi || undefined);

    book.loaded.navigation.then(({ toc }) => {
      setToc(toc);
    });

    book.ready
      .then(() => {
        return book.locations.generate(1600);
      })
      .then(locations => {
        setTotalPages(locations.length);
        if (rendition.location) {
          const currentPage = book.locations.locationFromCfi(
            rendition.location.start.cfi,
          );
          setCurrentPageNum(currentPage);
        }
      });

    rendition.on("relocated", location => {
      const cfi = location.start.cfi;
      setCurrentLocation(cfi);

      if (book.locations.length() > 0) {
        const page = book.locations.locationFromCfi(cfi);
        setCurrentPageNum(page);
      }

      const baseHref = location.start.href.split("#")[0];
      const currentNavItem = book.navigation.toc.find(
        item => item.href.split("#")[0] === baseHref,
      );

      if (currentNavItem) {
        setCurrentChapterName(currentNavItem.label.trim());
      } else {
        setCurrentChapterName("Reading...");
      }
    });

    return () => {
      book.destroy();
    };
  }, [url]);

  useEffect(() => {
    if (!url || totalPages === 0) return;

    const metaData = {
      readingTime,
      currentLocation,
      currentPageNum,
      bookmarks,
    };
    localStorage.setItem(`epub_meta_${url}`, JSON.stringify(metaData));

    const continueReadingList =
      JSON.parse(localStorage.getItem("continueReading")) || [];
    const existingItem =
      continueReadingList.find(
        item => item.url === url || item.epubUrl === url,
      ) || {};
    const updatedList = continueReadingList.filter(
      item => item.url !== url && item.epubUrl !== url,
    );

    updatedList.unshift({
      ...existingItem,
      title: bookTitle,
      url: url,
      epubUrl: url,
      currentPage: currentPageNum,
      totalPages: totalPages,
    });

    localStorage.setItem("continueReading", JSON.stringify(updatedList));
  }, [
    readingTime,
    currentLocation,
    currentPageNum,
    bookmarks,
    url,
    bookTitle,
    totalPages,
  ]);

  const formatTime = totalSeconds => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs + ":" : ""}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const next = () => {
    if (renditionRef.current) renditionRef.current.next();
  };

  const prev = () => {
    if (renditionRef.current) renditionRef.current.prev();
  };

  const goTo = hrefOrCfi => {
    if (renditionRef.current) renditionRef.current.display(hrefOrCfi);
  };

  const addBookmark = () => {
    if (!currentLocation) return;

    const newBookmark = {
      id: Date.now(),
      cfi: currentLocation,
      label: `Page ${currentPageNum} - ${currentChapterName}`,
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    if (!bookmarks.some(b => b.cfi === currentLocation)) {
      setBookmarks([...bookmarks, newBookmark]);
    }
  };

  const removeBookmark = idToRemove => {
    setBookmarks(bookmarks.filter(b => b.id !== idToRemove));
  };

  const clearBookData = () => {
    localStorage.removeItem(`epub_meta_${url}`);

    const continueReadingList =
      JSON.parse(localStorage.getItem("continueReading")) || [];
    const updatedList = continueReadingList.filter(
      item => item.url !== url && item.epubUrl !== url,
    );
    localStorage.setItem("continueReading", JSON.stringify(updatedList));

    setReadingTime(0);
    setBookmarks([]);
    setCurrentLocation(null);
    setCurrentPageNum(1);

    if (toc.length > 0 && renditionRef.current) {
      goTo(toc[0].href);
    }
  };

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-900 overflow-hidden font-sans w-full ">
      {isSidebarOpen && (
        <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-full select-none">
          <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h2 className="font-medium text-sm text-neutral-500 uppercase tracking-wider">
              Library
            </h2>
          </div>

          <div className="p-4 border-b border-neutral-200 max-h-64 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-neutral-400 uppercase">
                Bookmarks
              </span>
              <button
                onClick={addBookmark}
                className="text-xs bg-neutral-900 hover:bg-neutral-800 text-white px-2 py-1 rounded transition-colors"
              >
                Bookmark Page
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {bookmarks.length === 0 ? (
                <p className="text-xs text-neutral-400 italic">
                  No bookmarks saved.
                </p>
              ) : (
                <ul className="space-y-1">
                  {bookmarks.map(bookmark => (
                    <li
                      key={bookmark.id}
                      className="flex justify-between items-center p-2 rounded text-sm hover:bg-neutral-50 group transition-colors"
                    >
                      <button
                        onClick={() => goTo(bookmark.cfi)}
                        className="text-left text-neutral-600 hover:text-neutral-950 truncate flex-1"
                        title={bookmark.label}
                      >
                        {bookmark.label}
                        <span className="block text-xs text-neutral-400 mt-0.5">
                          {bookmark.createdAt}
                        </span>
                      </button>
                      <button
                        onClick={() => removeBookmark(bookmark.id)}
                        className="text-neutral-300 hover:text-neutral-600 pl-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto space-y-1">
            <span className="text-xs font-semibold text-neutral-400 uppercase block mb-3">
              Chapters
            </span>
            {toc.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">
                Loading chapters...
              </p>
            ) : (
              toc.map((chapter, index) => (
                <button
                  key={chapter.id || index}
                  onClick={() => goTo(chapter.href)}
                  className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    currentChapterName === chapter.label.trim()
                      ? "bg-neutral-100 text-neutral-900 font-medium"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  {chapter.label.trim()}
                </button>
              ))
            )}
          </nav>

          <div className="p-4 border-t border-neutral-200">
            <button
              onClick={clearBookData}
              className="w-full text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2 rounded transition-colors font-medium"
            >
              Clear Book Data
            </button>
          </div>
        </aside>
      )}
      <main className="flex-1 flex flex-col h-full bg-white relative overflow-y-hidden">
        <header className="h-14 border-b border-neutral-100 flex items-center px-6 bg-white select-none">
          <div className="flex items-center space-x-2 mr-6">
            <button
              onClick={goBackHome}
              className="p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 rounded transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </button>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 rounded transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <path d="M9 3v18" />
              </svg>
            </button>
          </div>

          <div className="text-sm text-neutral-500 truncate min-w-[180px]">
            Reading page number{" "}
            <span className="font-medium text-neutral-800">
              {currentPageNum}
            </span>{" "}
            /{" "}
            <span className="font-medium text-neutral-800">
              {totalPages || "..."}
            </span>
          </div>

          <div
            className="text-base font-medium text-neutral-800 truncate px-4 flex-1 text-center"
            title={currentChapterName}
          >
            {currentChapterName}
          </div>

          <div className="flex items-center space-x-2 text-sm text-neutral-500 min-w-[180px] justify-end">
            <span>⏱️ Reading time:</span>
            <span className="font-mono bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200 text-neutral-800">
              {formatTime(readingTime)}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-hidden px-12 py-8 flex justify-center bg-white">
          <div ref={viewerRef} className="w-full max-w-3xl h-full"></div>
        </div>

        <footer className="h-16 border-t border-neutral-100 flex justify-between items-center px-8 bg-neutral-50 select-none">
          <button
            onClick={prev}
            className="px-4 py-2 bg-white border border-neutral-200 rounded text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors shadow-sm"
          >
            Previous
          </button>

          <span className="text-xs text-neutral-400">
            Local Reading Mode Active
          </span>

          <button
            onClick={next}
            className="px-4 py-2 bg-white border border-neutral-200 rounded text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors shadow-sm"
          >
            Next
          </button>
        </footer>
      </main>
    </div>
  );
}
