import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSeriesDetail } from "../api/contentApi";

const SeriesDetailPage = () => {
  const { slug } = useParams();
  const [series, setSeries] = useState(null);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const data = await getSeriesDetail(slug);
        setSeries(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSeries();
  }, [slug]);

  if (!series) {
    return (
      <main className="page">
        <div className="container">
          <p>Loading series...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        <section className="series-header">
          <span className="badge">{series.language?.name}</span>
          <h1>{series.title}</h1>
          <p>{series.description || series.short_description}</p>
          <div className="card-meta">
            <span>{series.category?.name}</span>
            <span>•</span>
            <span>{series.author_name || "Unknown Author"}</span>
          </div>
        </section>

        <section className="section">
          <h2 className="mb-2">Episodes</h2>

          <div className="episode-list">
            {series.episodes?.map((episode) => (
              <div key={episode.id} className="card">
                <div className="episode-row">
                  <div>
                    <h3 className="card-title">
                      {episode.episode_number}. {episode.title}
                    </h3>
                    <p className="card-text">
                      Duration: {episode.duration_seconds}s
                    </p>
                  </div>

                  <Link className="btn btn-primary" to={`/episodes/${episode.id}`}>
                    Play Episode
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default SeriesDetailPage;