import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getEpisodeDetail } from "../api/contentApi";
import { getContinueListening } from "../api/listeningApi";
import { useAudioPlayer } from "../context/AudioPlayerContext";

const formatTime = (seconds = 0) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const EpisodePlayerPage = () => {
  const { id } = useParams();
  const [episode, setEpisode] = useState(null);
  const [resumePosition, setResumePosition] = useState(0);
  const [loading, setLoading] = useState(true);

  const {
    currentEpisode,
    isPlaying,
    playEpisode,
    pauseEpisode,
    currentTime,
    duration,
    seekTo,
    seekBy,
  } = useAudioPlayer();

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const episodeData = await getEpisodeDetail(id);
        setEpisode(episodeData);
      } catch (error) {
        console.error("Episode fetch failed:", error);
      }
    };

    const fetchResumeData = async () => {
      try {
        const continueData = await getContinueListening();
        const list = Array.isArray(continueData)
          ? continueData
          : continueData.results || [];

        const matched = list.find((item) => String(item.episode_id) === String(id));

        if (matched) {
          setResumePosition(matched.progress_seconds);
        }
      } catch (error) {
        console.error("Resume fetch failed:", error);
      }
    };

    const loadPage = async () => {
      setLoading(true);
      await Promise.allSettled([fetchEpisode(), fetchResumeData()]);
      setLoading(false);
    };

    loadPage();
  }, [id]);

  const isCurrentEpisode = currentEpisode?.id === episode?.id;
  const effectiveDuration = isCurrentEpisode
    ? duration || episode?.duration_seconds || 0
    : episode?.duration_seconds || 0;

  const effectiveCurrentTime = isCurrentEpisode ? currentTime : resumePosition;

  const progressPercent = useMemo(() => {
    if (!effectiveDuration) return 0;
    return Math.min((effectiveCurrentTime / effectiveDuration) * 100, 100);
  }, [effectiveCurrentTime, effectiveDuration]);

  const handleSeekBarChange = async (e) => {
    if (!isCurrentEpisode) return;
    await seekTo(Number(e.target.value));
  };

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <p>Loading episode...</p>
        </div>
      </main>
    );
  }

  if (!episode) {
    return (
      <main className="page">
        <div className="container">
          <p>Episode not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        <div className="card player-card">
          <span className="badge">Episode Player</span>

          <h1 className="mt-2">{episode.title}</h1>
          <p className="mt-1">{episode.description || "No description available."}</p>

          <div className="player-meta">
            <span>Duration: {formatTime(episode.duration_seconds)}</span>
            <span>
              Current position: {formatTime(effectiveCurrentTime)}
            </span>
          </div>

          <div className="progress-bar" style={{ marginBottom: "12px" }}>
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <input
            type="range"
            min="0"
            max={effectiveDuration || 0}
            value={effectiveCurrentTime}
            onChange={handleSeekBarChange}
            disabled={!isCurrentEpisode}
            style={{ width: "100%", marginBottom: "16px" }}
          />

          <div className="player-meta" style={{ marginBottom: "16px" }}>
            <span>{formatTime(effectiveCurrentTime)}</span>
            <span>{formatTime(effectiveDuration)}</span>
          </div>

          <div className="player-actions" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              className="btn btn-secondary"
              onClick={() => seekBy(-10)}
              disabled={!isCurrentEpisode}
            >
              -10s
            </button>

            {!isCurrentEpisode || !isPlaying ? (
              <button
                className="btn btn-primary"
                onClick={() =>
                  playEpisode(
                    episode,
                    isCurrentEpisode ? currentTime : resumePosition
                  )
                }
              >
                {resumePosition > 0 && !isCurrentEpisode
                  ? `Resume from ${formatTime(resumePosition)}`
                  : "Play"}
              </button>
            ) : (
              <button className="btn btn-secondary" onClick={pauseEpisode}>
                Pause
              </button>
            )}

            <button
              className="btn btn-secondary"
              onClick={() => seekBy(10)}
              disabled={!isCurrentEpisode}
            >
              +10s
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EpisodePlayerPage;