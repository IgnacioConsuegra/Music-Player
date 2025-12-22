import React, { useEffect, useState } from "react";

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);

  const loadVideos = async () => {
    try {
      const res = await fetch("/videos.json");
      const data = await res.json();
      setVideos(data);
      setCurrentVideo(data[0] || null);
    } catch (error) {
      console.error("Error loading videos:", error);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);
  useEffect(() => {
    console.log(videos, currentVideo);
  }, [videos, currentVideo]);

  return (
    <section className="text-white h-screen p-5 ">
      <div className="md:pb-5">
        {currentVideo ? (
          <>
            <h1 className="text-center text-2xl md:pb-2">
              {currentVideo.title}
            </h1>
            <video src={currentVideo.url} controls width="100%" />
          </>
        ) : (
          <p>Not select video</p>
        )}
      </div>

      <div>
        <h3 className="text-white">List of videos</h3>

        {videos.map((video, index) => (
          <div
            key={index}
            onClick={() => setCurrentVideo(video)}
            className={`flex gap-2 p-2 cursor-pointer border border-[#444] mb-8`}
          >
            <div
              style={{
                width: "120px",
                height: "70px",
                backgroundColor: "#222",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#777",
                fontSize: "12px",
              }}
            >
              Image
            </div>

            <div>
              <p style={{ margin: 0 }}>{video.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideosPage;
