import React, { useState, useEffect, useRef } from "react";

const formatTime = seconds => {
  if (!seconds) return "00:00";
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

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

const NextIcon = () => (
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
    <polygon points="5 4 15 12 5 20 5 4" />
    <line x1="19" y1="5" x2="19" y2="19" />
  </svg>
);

export default function VideosPage() {
  const [db, setDb] = useState([]);
  const [view, setView] = useState("home");
  const [activeSeries, setActiveSeries] = useState(null);
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState({});
  const [completed, setCompleted] = useState({});

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

  if (db.length === 0)
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );

  const saveProgress = (seriesId, episodeId, time) => {
    const newProgress = { ...progress, [seriesId]: { episodeId, time } };
    setProgress(newProgress);
    localStorage.setItem("watchProgress", JSON.stringify(newProgress));
  };

  const markAsCompleted = (seriesId, episodeId) => {
    setCompleted(prev => {
      const seriesCompleted = prev[seriesId] || [];
      if (!seriesCompleted.includes(episodeId)) {
        const newCompleted = {
          ...prev,
          [seriesId]: [...seriesCompleted, episodeId],
        };
        localStorage.setItem("watchedEpisodes", JSON.stringify(newCompleted));
        return newCompleted;
      }
      return prev;
    });

    setProgress(prev => {
      const newProgress = { ...prev };
      if (newProgress[seriesId]?.episodeId === episodeId) {
        delete newProgress[seriesId];
        localStorage.setItem("watchProgress", JSON.stringify(newProgress));
      }
      return newProgress;
    });
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
  const removeProgress = seriesId => {
    setProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[seriesId];
      localStorage.setItem("watchProgress", JSON.stringify(newProgress));
      return newProgress;
    });
  };
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-orange-500 selection:text-white pb-8 w-full">
      {view === "home" && (
        <HomeView
          db={filteredDB}
          categories={categories}
          search={search}
          setSearch={setSearch}
          progress={progress}
          completed={completed}
          onSelectSeries={navigateToSeries}
          onSelectEpisode={navigateToPlayer}
          onRemoveProgress={removeProgress} // <-- Add this
        />
      )}

      {view === "series" && activeSeries && (
        <SeriesView
          series={activeSeries}
          onBack={() => setView("home")}
          onPlay={ep => navigateToPlayer(activeSeries, ep)}
          progress={progress[activeSeries.id]}
          completed={completed[activeSeries.id] || []}
        />
      )}

      {view === "player" && activeSeries && activeEpisode && (
        <PlayerView
          series={activeSeries}
          episode={activeEpisode}
          onBack={() => navigateToSeries(activeSeries)}
          onPlay={ep => navigateToPlayer(activeSeries, ep)}
          saveProgress={saveProgress}
          markAsCompleted={markAsCompleted}
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
  completed,
  onSelectSeries,
  onSelectEpisode,
  onRemoveProgress,
}) {
  const CloseIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
  const continueWatching = Object.entries(progress)
    .map(([seriesId, data]) => {
      const isCompleted = completed[seriesId]?.includes(data.episodeId);
      if (isCompleted) return null;

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
            {continueWatching.map(({ series, episode, time }) => (
              <div
                key={series.id}
                onClick={() => onSelectEpisode(series, episode)}
                className="cursor-pointer group relative"
              >
                <div className="aspect-video bg-neutral-800 rounded-lg overflow-hidden relative">
                  <img
                    src={episode.thumbnail}
                    alt={episode.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* NEW DELETE BUTTON */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onRemoveProgress(series.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                  >
                    <CloseIcon />
                  </button>

                  <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 text-xs rounded text-orange-500 font-semibold">
                    {series.title}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-xs rounded text-white font-mono">
                    {formatTime(time)}
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

function SeriesView({ series, onBack, onPlay, progress, completed }) {
  const sortedEpisodes = [...series.episodes].sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true }),
  );

  return (
    <div>
      <div className="relative min-h-[50vh] flex flex-col justify-end w-full">
        {/* Image container handles the background */}
        <div className="absolute inset-0 z-0">
          <img
            src={series.mainPhoto}
            alt={series.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
        </div>

        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-2 bg-black/50 hover:bg-black/80 rounded-full backdrop-blur-sm transition-all z-20"
        >
          <BackIcon />
        </button>

        {/* Content container is now relative to flow naturally */}
        <div className="relative z-10 w-full p-8 max-w-7xl mx-auto pt-32">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg leading-tight">
            {series.title}
          </h1>
          <div className="max-w-3xl">
            <p className="text-neutral-200 text-base md:text-lg leading-relaxed drop-shadow-md">
              {series.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold mb-6 border-b border-neutral-800 pb-4">
          Episodes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEpisodes.map((ep, idx) => {
            const isCompleted = completed.includes(ep.id);
            return (
              <div
                key={ep.id}
                onClick={() => onPlay(ep)}
                className={`flex gap-4 p-4 rounded-xl cursor-pointer transition-colors group ${isCompleted ? "bg-neutral-900/40 opacity-60 hover:opacity-100" : "hover:bg-neutral-900"}`}
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
                  {progress?.episodeId === ep.id && !isCompleted && (
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
            );
          })}
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
  markAsCompleted,
  savedTime,
}) {
  const videoRef = useRef(null);
  const lastSavedRef = useRef(0);
  const [countdown, setCountdown] = useState(null);

  const sortedEpisodes = [...series.episodes].sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true }),
  );
  const currentIndex = sortedEpisodes.findIndex(ep => ep.id === episode.id);
  const nextEpisode = sortedEpisodes[currentIndex + 1];

  useEffect(() => {
    setCountdown(null);
    if (videoRef.current && savedTime > 0) {
      videoRef.current.currentTime = savedTime;
    }
  }, [episode.id]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      if (nextEpisode) onPlay(nextEpisode);
      else onBack();
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, nextEpisode, onPlay, onBack]);

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

  const handleEnded = () => {
    markAsCompleted(series.id, episode.id);
    setCountdown(5);
  };

  const skipToNext = () => {
    if (nextEpisode) onPlay(nextEpisode);
    else onBack();
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="w-full bg-black relative group flex justify-center items-center">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-2 bg-black/50 hover:bg-black/80 rounded-full backdrop-blur-sm transition-all z-20 opacity-0 group-hover:opacity-100"
        >
          <BackIcon />
        </button>

        {countdown !== null && (
          <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              {nextEpisode
                ? `Up next in ${countdown}...`
                : `Returning to series in ${countdown}...`}
            </h3>
            {nextEpisode && (
              <button
                onClick={skipToNext}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition-colors"
              >
                Play Now
              </button>
            )}
          </div>
        )}

        <video
          ref={videoRef}
          src={episode.url}
          controls
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          className="w-full max-h-[75vh] object-contain outline-none"
        />
      </div>

      <div className="max-w-7xl w-full mx-auto px-8 py-8 flex-1 bg-neutral-950">
        <div className="flex justify-between items-start mb-12">
          <div>
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
          <button
            onClick={skipToNext}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-lg text-neutral-300 hover:text-white transition-colors"
          >
            <span>{nextEpisode ? "Next Episode" : "Back to Series"}</span>
            <NextIcon />
          </button>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-6 border-b border-neutral-800 pb-4">
            Up Next
          </h3>
          <div className="flex flex-col gap-2">
            {sortedEpisodes.map((ep, idx) => (
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
