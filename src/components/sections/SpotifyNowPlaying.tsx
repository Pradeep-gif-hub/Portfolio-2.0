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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect p-6 rounded-xl border border-accent-primary/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <Music className="text-accent-primary animate-pulse" size={24} />
          <h3 className="text-lg font-semibold">Currently Vibing To</h3>
        </div>
        <div className="text-text-secondary text-sm">Loading...</div>
      </motion.div>
    );
  }

  if (!track.isPlaying) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect p-6 rounded-xl border border-accent-primary/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <Music className="text-text-tertiary" size={24} />
          <h3 className="text-lg font-semibold">Currently Vibing To</h3>
        </div>
        <div className="text-text-secondary text-sm">Not playing anything right now</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect p-6 rounded-xl border border-accent-primary/20 hover:border-accent-primary/40 transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Music className="text-accent-primary" size={24} />
        </motion.div>
        <h3 className="text-lg font-semibold">Currently Vibing To</h3>
      </div>

      <div className="flex gap-4 items-start">
        {/* Album Art */}
        {track.albumImageUrl && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0"
          >
            <img
              src={track.albumImageUrl}
              alt={track.album}
              className="w-20 h-20 rounded-lg shadow-lg border-2 border-accent-primary/30"
            />
          </motion.div>
        )}

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white truncate mb-1">
                {track.title}
              </h4>
              <p className="text-text-secondary text-sm truncate">
                {track.artist}
              </p>
              {track.album && (
                <p className="text-text-tertiary text-xs truncate mt-1">
                  {track.album}
                </p>
              )}
            </div>
            {track.songUrl && (
              <a
                href={track.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-accent-primary hover:text-accent-light transition-colors"
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
                className="w-1 bg-accent-primary rounded-full"
                animate={{
                  height: ["8px", "20px", "8px"],
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
