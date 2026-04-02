import React, { useState, useEffect, useRef } from "react";
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const BackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export default function VideosPage() {
  const [db, setDb] = useState([]);
  const [view, setView] = useState("home");
  const [activeSeries, setActiveSeries] = useState(null);
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState({});
  async function loadVideos() {
    try {
      const res = await fetch("./data.json");
      const data = await res.json();
      setDb(data);
      const saved = localStorage.getItem("watchProgress");
      if (saved) setProgress(JSON.parse(saved));
    } catch (error) {
      console.error("Error loading songs:", error);
    }
  }
  useEffect(() => {
    loadVideos();
  }, []);

  if (db.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const saveProgress = (seriesId, episodeId, time) => {
    const newProgress = { ...progress, [seriesId]: { episodeId, time } };
    setProgress(newProgress);
    localStorage.setItem("watchProgress", JSON.stringify(newProgress));
  };

  const navigateToSeries = series => {
    setActiveSeries(series);
    setView("series");
    window.scrollTo(0, 0);
  };

  const navigateToPlayer = (series, episode) => {
    setActiveSeries(series);
    setActiveEpisode(episode);
    setView("player");
    window.scrollTo(0, 0);
  };

  const filteredDB = db.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()),
  );
  const categories = [...new Set(db.map(s => s.category))];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-orange-500 selection:text-white pb-20 w-full">
      {view === "home" && (
        <HomeView
          db={filteredDB}
          categories={categories}
          search={search}
          setSearch={setSearch}
          progress={progress}
          onSelectSeries={navigateToSeries}
          onSelectEpisode={navigateToPlayer}
        />
      )}

      {view === "series" && activeSeries && (
        <SeriesView
          series={activeSeries}
          onBack={() => setView("home")}
          onPlay={ep => navigateToPlayer(activeSeries, ep)}
          progress={progress[activeSeries.id]}
        />
      )}

      {view === "player" && activeSeries && activeEpisode && (
        <PlayerView
          series={activeSeries}
          episode={activeEpisode}
          onBack={() => navigateToSeries(activeSeries)}
          onPlay={ep => navigateToPlayer(activeSeries, ep)}
          saveProgress={saveProgress}
          savedTime={
            progress[activeSeries.id]?.episodeId === activeEpisode.id
              ? progress[activeSeries.id]?.time
              : 0
          }
        />
      )}
    </div>
  );
}

function HomeView({
  db,
  categories,
  search,
  setSearch,
  progress,
  onSelectSeries,
  onSelectEpisode,
}) {
  const continueWatching = Object.entries(progress)
    .map(([seriesId, data]) => {
      const series = db.find(s => s.id === seriesId);
      if (!series) return null;
      const episode = series.episodes.find(e => e.id === data.episodeId);
      return { series, episode, time: data.time };
    })
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8">
      <div className="relative mb-12">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search series..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-neutral-900 text-white rounded-full py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        />
      </div>

      {search === "" && continueWatching.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Continue Watching</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {continueWatching.map(({ series, episode }) => (
              <div
                key={series.id}
                onClick={() => onSelectEpisode(series, episode)}
                className="cursor-pointer group"
              >
                <div className="aspect-video bg-neutral-800 rounded-lg overflow-hidden relative">
                  <img
                    src={episode.thumbnail}
                    alt={episode.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 text-xs rounded text-orange-500 font-semibold">
                    {series.title}
                  </div>
                </div>
                <h3 className="mt-2 font-medium text-neutral-300 group-hover:text-orange-500 transition-colors">
                  {episode.title}
                </h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {search === "" && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {db
              .filter(s => s.isFeatured)
              .map(series => (
                <SeriesCard
                  key={series.id}
                  series={series}
                  onClick={() => onSelectSeries(series)}
                />
              ))}
          </div>
        </section>
      )}

      {categories.map(cat => {
        const catSeries = db.filter(s => s.category === cat);
        if (catSeries.length === 0) return null;
        return (
          <section key={cat} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{cat}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {catSeries.map(series => (
                <SeriesCard
                  key={series.id}
                  series={series}
                  onClick={() => onSelectSeries(series)}
                />
              ))}
            </div>
          </section>
        );
      })}

      <section>
        <h2 className="text-2xl font-bold mb-6">All Series</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {db.map(series => (
            <SeriesCard
              key={series.id}
              series={series}
              onClick={() => onSelectSeries(series)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function SeriesCard({ series, onClick }) {
  return (
    <div onClick={onClick} className="cursor-pointer group">
      <div className="aspect-[16/9] bg-neutral-800 rounded-lg overflow-hidden">
        <img
          src={series.mainPhoto}
          alt={series.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="mt-3 font-semibold text-neutral-200 group-hover:text-white">
        {series.title}
      </h3>
      <p className="text-sm text-neutral-500">{series.category}</p>
    </div>
  );
}

function SeriesView({ series, onBack, onPlay, progress }) {
  return (
    <div>
      <div className="relative h-[50vh] w-full">
        <img
          src={series.mainPhoto}
          alt={series.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />

        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-2 bg-black/50 hover:bg-black/80 rounded-full backdrop-blur-sm transition-all"
        >
          <BackIcon />
        </button>

        <div className="absolute bottom-0 left-0 w-full p-8 max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">{series.title}</h1>
          <p className="text-neutral-300 max-w-3xl text-lg leading-relaxed">
            {series.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold mb-6 border-b border-neutral-800 pb-4">
          Episodes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {series.episodes.map((ep, idx) => (
            <div
              key={ep.id}
              onClick={() => onPlay(ep)}
              className="flex gap-4 p-4 rounded-xl hover:bg-neutral-900 cursor-pointer transition-colors group"
            >
              <div className="relative w-40 aspect-video bg-neutral-800 rounded-md overflow-hidden shrink-0">
                <img
                  src={ep.thumbnail}
                  alt={ep.title}
                  className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="white"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                {progress?.episodeId === ep.id && (
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-orange-500"
                    style={{ width: "100%" }}
                  />
                )}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm text-neutral-500 mb-1">
                  E{idx + 1}
                </span>
                <h3 className="font-medium text-neutral-200 group-hover:text-orange-500">
                  {ep.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayerView({
  series,
  episode,
  onBack,
  onPlay,
  saveProgress,
  savedTime,
}) {
  const videoRef = useRef(null);
  const lastSavedRef = useRef(0);

  useEffect(() => {
    if (videoRef.current && savedTime > 0) {
      videoRef.current.currentTime = savedTime;
    }
  }, [savedTime, episode]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    if (
      current - lastSavedRef.current >= 10 ||
      current < lastSavedRef.current
    ) {
      saveProgress(series.id, episode.id, current);
      lastSavedRef.current = current;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black w-full">
      <div className="w-full bg-black relative group">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-2 bg-black/50 hover:bg-black/80 rounded-full backdrop-blur-sm transition-all z-10 opacity-0 group-hover:opacity-100"
        >
          <BackIcon />
        </button>
        <video
          ref={videoRef}
          src={episode.url}
          controls
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          className="w-full max-h-[75vh] object-contain outline-none"
        />
      </div>

      <div className="max-w-7xl w-full mx-auto px-8 py-8 flex-1 bg-neutral-950">
        <div className="mb-12">
          <h2
            className="text-orange-500 font-semibold mb-2 hover:underline cursor-pointer"
            onClick={onBack}
          >
            {series.title}
          </h2>
          <h1 className="text-3xl font-bold text-white mb-4">
            {episode.title}
          </h1>
          <p className="text-neutral-400">{series.description}</p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-6 border-b border-neutral-800 pb-4">
            Up Next
          </h3>
          <div className="flex flex-col gap-2">
            {series.episodes.map((ep, idx) => (
              <div
                key={ep.id}
                onClick={() => onPlay(ep)}
                className={`flex gap-4 p-4 rounded-xl cursor-pointer transition-colors ${ep.id === episode.id ? "bg-neutral-900 border border-neutral-800" : "hover:bg-neutral-900"}`}
              >
                <div className="w-32 aspect-video bg-neutral-800 rounded-md overflow-hidden shrink-0 relative">
                  <img
                    src={ep.thumbnail}
                    alt={ep.title}
                    className="w-full h-full object-cover"
                  />
                  {ep.id === episode.id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                        Playing
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm text-neutral-500 mb-1">
                    Episode {idx + 1}
                  </span>
                  <h4
                    className={`font-medium ${ep.id === episode.id ? "text-orange-500" : "text-neutral-200"}`}
                  >
                    {ep.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
