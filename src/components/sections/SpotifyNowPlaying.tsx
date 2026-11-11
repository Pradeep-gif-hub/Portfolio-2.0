import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Music, ExternalLink } from "lucide-react";

interface SpotifyTrack {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

export const SpotifyNowPlaying: React.FC = () => {
  const [track, setTrack] = useState<SpotifyTrack>({ isPlaying: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNowPlaying();
    // Refresh every 30 seconds
    const interval = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNowPlaying = async () => {
    try {
      const response = await fetch('/api/spotify/now-playing');
      if (!response.ok) {
        setTrack({ isPlaying: false });
        setLoading(false);
        return;
      }
      const data = await response.json();
      setTrack(data);
    } catch (error) {
      // Error occurred while fetching Spotify data
      setTrack({ isPlaying: false });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="surface-card p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <Music className="text-theme-accent" size={20} />
          <h3 className="text-base font-semibold text-theme-text">Currently Vibing To</h3>
        </div>
        <div className="text-theme-muted text-sm">Loading...</div>
      </motion.div>
    );
  }

  if (!track.isPlaying) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="surface-card p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <Music className="text-theme-muted" size={20} />
          <h3 className="text-base font-semibold text-theme-text">Currently Vibing To</h3>
        </div>
        <div className="text-theme-muted text-sm">Not playing anything right now</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="surface-card p-6 card-hover"
    >
      <div className="flex items-center gap-3 mb-4">
        <Music className="text-theme-accent" size={20} />
        <h3 className="text-base font-semibold text-theme-text">Currently Vibing To</h3>
      </div>

      <div className="flex gap-4 items-start">
        {/* Album Art */}
        {track.albumImageUrl && (
          <div className="flex-shrink-0">
            <img
              src={track.albumImageUrl}
              alt={track.album}
              className="w-20 h-20 rounded-lg border border-theme-border object-cover"
            />
          </div>
        )}

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-theme-text truncate mb-1">
                {track.title}
              </h4>
              <p className="text-theme-muted text-sm truncate">
                {track.artist}
              </p>
              {track.album && (
                <p className="text-theme-muted text-xs truncate mt-1">
                  {track.album}
                </p>
              )}
            </div>
            {track.songUrl && (
              <a
                href={track.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-theme-accent hover:text-theme-accent-hover transition-colors"
                title="Listen on Spotify"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>

          {/* Animated Sound Bars */}
          <div className="flex gap-1 mt-3">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-theme-accent rounded-full"
                animate={{
                  height: ["8px", "18px", "8px"],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
