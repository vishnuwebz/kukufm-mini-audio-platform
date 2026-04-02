import { Link } from "react-router-dom";
import { useAudioPlayer } from "../context/AudioPlayerContext";

const formatTime = (seconds) => {
  const safe = Math.max(0, Number(seconds || 0));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

const MiniPlayer = () => {
  const { currentEpisode, isPlaying, pauseEpisode, playEpisode, currentTime } =
    useAudioPlayer();

  if (!currentEpisode) return null;

  const duration = currentEpisode.duration_seconds || 0;
  const progressPercent = duration
    ? Math.min((currentTime / duration) * 100, 100)
    : 0;

  return (
    <div className="mini-player">
      <div className="mini-player-inner">
        <div>
          <p className="mini-player-title">{currentEpisode.title}</p>
          <p className="mini-player-subtitle">
            {currentEpisode.series_title || "Currently playing"}
          </p>
        </div>

        <div className="mini-player-actions">
          {!isPlaying ? (
            <button
              className="btn btn-primary"
              onClick={() => playEpisode(currentEpisode, currentTime)}
            >
              Play
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={pauseEpisode}>
              Pause
            </button>
          )}

          <Link className="btn btn-secondary" to={`/episodes/${currentEpisode.id}`}>
            Open Player
          </Link>
        </div>

        <div className="mini-player-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mini-player-time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;