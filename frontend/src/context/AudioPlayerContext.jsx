import { createContext, useContext, useEffect, useRef, useState } from "react";
import { updateListeningProgress } from "../api/listeningApi";

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const progressTimerRef = useRef(null);
  const currentEpisodeRef = useRef(null);

  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const stopProgressTracking = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const saveProgress = async (episodeOverride = null) => {
    const audio = audioRef.current;
    const episode = episodeOverride || currentEpisodeRef.current;

    if (!audio || !episode) return;

    try {
      await updateListeningProgress({
        episode_id: episode.id,
        progress_seconds: Math.floor(audio.currentTime || 0),
      });
    } catch (error) {
      console.error("Progress save failed:", error);
    }
  };

  const startProgressTracking = () => {
    stopProgressTracking();

    progressTimerRef.current = setInterval(() => {
      const audio = audioRef.current;
      const episode = currentEpisodeRef.current;

      if (audio && !audio.paused && episode) {
        saveProgress(episode);
      }
    }, 10000);
  };

  const playEpisode = async (episode, startAt = 0) => {
    const audio = audioRef.current;
    if (!audio || !episode?.audio_url) return;

    try {
      if (currentEpisodeRef.current?.id !== episode.id) {
        audio.src = episode.audio_url;
      }

      currentEpisodeRef.current = episode;
      setCurrentEpisode(episode);

      audio.currentTime = startAt;
      await audio.play();

      setIsPlaying(true);
      startProgressTracking();
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  };

  const pauseEpisode = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
    stopProgressTracking();
    await saveProgress();
  };

  const seekTo = async (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;

    const safeDuration = Math.floor(audio.duration || duration || 0);
    const clamped = Math.max(0, Math.min(seconds, safeDuration || seconds));

    audio.currentTime = clamped;
    setCurrentTime(Math.floor(clamped));
    await saveProgress();
  };

  const seekBy = async (deltaSeconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    await seekTo((audio.currentTime || 0) + deltaSeconds);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(Math.floor(audio.currentTime || 0));
    };

    const handleLoadedMetadata = () => {
      setDuration(Math.floor(audio.duration || 0));
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = async () => {
      setIsPlaying(false);
      setCurrentTime(0);
      stopProgressTracking();
      await saveProgress();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [duration]);

  useEffect(() => {
    return () => {
      stopProgressTracking();
    };
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        audioRef,
        currentEpisode,
        isPlaying,
        currentTime,
        duration,
        playEpisode,
        pauseEpisode,
        saveProgress,
        seekTo,
        seekBy,
      }}
    >
      {children}
      <audio ref={audioRef} preload="metadata" />
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);