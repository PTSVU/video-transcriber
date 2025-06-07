import { useEffect, useState } from 'react';
import './video-player.css';

export default function VideoPlayer({ file }) {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  if (!videoUrl) return null;

  return (
    <div className="video-player">
      <video controls width="100%">
        <source src={videoUrl} type={file.type} />
        Ваш браузер не поддерживает видео тег.
      </video>
    </div>
  );
}