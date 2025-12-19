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
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        {currentVideo ? (
          <>
            <h2>{currentVideo.title}</h2>
            <video src={currentVideo.url} controls width="100%" />
          </>
        ) : (
          <p>No hay video seleccionado</p>
        )}
      </div>

      {/* Lista de videos */}
      <div>
        <h3>Lista de videos</h3>

        {videos.map((video, index) => (
          <div
            key={index}
            onClick={() => setCurrentVideo(video)}
            style={{
              display: "flex",
              gap: "12px",
              padding: "10px",
              cursor: "pointer",
              border: "1px solid #444",
              marginBottom: "10px",
            }}
          >
            {/* Placeholder para imagen futura */}
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
              Imagen
            </div>

            {/* Info del video */}
            <div>
              <p style={{ margin: 0 }}>{video.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideosPage;
