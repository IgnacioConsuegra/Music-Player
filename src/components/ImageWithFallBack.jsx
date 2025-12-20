import React, { useState } from "react";

const ImageWithFallback = ({ src, fallback, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallback)}
      className={className}
    />
  );
};

export default ImageWithFallback;
