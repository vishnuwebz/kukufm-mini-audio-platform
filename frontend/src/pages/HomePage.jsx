import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getSeriesList, getCategories, getLanguages } from "../api/contentApi";
import { getContinueListening } from "../api/listeningApi";

const HomePage = () => {
  const [seriesList, setSeriesList] = useState([]);
  const [continueListening, setContinueListening] = useState([]);
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);

        try {
          const [seriesRes, continueRes, categoryRes, languageRes] =
            await Promise.allSettled([
              getSeriesList(),
              getContinueListening(),
              getCategories(),
              getLanguages(),
            ]);

          const seriesData =
            seriesRes.status === "fulfilled" ? seriesRes.value : [];
          const continueData =
            continueRes.status === "fulfilled" ? continueRes.value : [];
          const categoryData =
            categoryRes.status === "fulfilled" ? categoryRes.value : [];
          const languageData =
            languageRes.status === "fulfilled" ? languageRes.value : [];

          setSeriesList(
            Array.isArray(seriesData) ? seriesData : seriesData.results || []
          );
          setContinueListening(
            Array.isArray(continueData) ? continueData : continueData.results || []
          );
          setCategories(
            Array.isArray(categoryData) ? categoryData : categoryData.results || []
          );
          setLanguages(
            Array.isArray(languageData) ? languageData : languageData.results || []
          );

          if (seriesRes.status === "rejected") {
            console.error("Series fetch failed:", seriesRes.reason);
          }
          if (continueRes.status === "rejected") {
            console.error("Continue listening fetch failed:", continueRes.reason);
          }
          if (categoryRes.status === "rejected") {
            console.error("Categories fetch failed:", categoryRes.reason);
          }
          if (languageRes.status === "rejected") {
            console.error("Languages fetch failed:", languageRes.reason);
          }
        } catch (error) {
          console.error("Unexpected HomePage error:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

  const filteredSeries = useMemo(() => {
    return seriesList.filter((series) => {
      const matchesSearch =
        series.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        series.short_description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory
        ? String(series.category?.id) === selectedCategory
        : true;

      const matchesLanguage = selectedLanguage
        ? String(series.language?.id) === selectedLanguage
        : true;

      return matchesSearch && matchesCategory && matchesLanguage;
    });
  }, [seriesList, searchTerm, selectedCategory, selectedLanguage]);

  return (
    <main className="page">
      <div className="container">
        <section className="hero">
          <h1>Discover audio that helps you grow</h1>
          <p>
            Search by topic, filter by language, and keep learning from where you left off.
          </p>

          <div className="filters-bar">
            <div className="filter-control">
              <label>Search</label>
              <input
                className="filter-input"
                type="text"
                placeholder="Search series title or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-control">
              <label>Category</label>
              <select
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-control">
              <label>Language</label>
              <select
                className="filter-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="">All Languages</option>
                {languages.map((language) => (
                  <option key={language.id} value={language.id}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="space-between mb-2">
            <h2>Continue Listening</h2>
            <span className="badge">Resume where you left off</span>
          </div>

          {loading ? (
            <div className="cards-grid">
              <div className="skeleton" />
              <div className="skeleton" />
              <div className="skeleton" />
            </div>
          ) : continueListening.length === 0 ? (
            <div className="empty-state">
              No unfinished episodes yet. Start one series and your progress will appear here.
            </div>
          ) : (
            <div className="cards-grid">
              {continueListening.map((item) => (
                <div key={item.id} className="card card-hover">
                  <h3 className="card-title">{item.series_title}</h3>
                  <p className="card-text">{item.episode_title}</p>
                  <div className="card-meta mb-2">
                    <span>
                      Progress: {item.progress_seconds}s / {item.duration_seconds}s
                    </span>
                  </div>
                  <Link className="btn btn-primary" to={`/episodes/${item.episode_id}`}>
                    Resume Episode
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section">
          <div className="space-between mb-2">
            <h2>All Series</h2>
            <span className="text-muted">{filteredSeries.length} matching results</span>
          </div>

          {loading ? (
            <div className="cards-grid">
              <div className="skeleton" />
              <div className="skeleton" />
              <div className="skeleton" />
            </div>
          ) : filteredSeries.length === 0 ? (
            <div className="empty-state">
              No series matched your search or filter selection.
            </div>
          ) : (
            <div className="cards-grid">
              {filteredSeries.map((series) => (
                <div key={series.id} className="card card-hover">
                  <h3 className="card-title">{series.title}</h3>
                  <p className="card-text">{series.short_description}</p>
                  <div className="card-meta mb-2">
                    <span>{series.language?.name}</span>
                    <span>•</span>
                    <span>{series.category?.name}</span>
                  </div>
                  <Link className="btn btn-secondary" to={`/series/${series.slug}`}>
                    View Series
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default HomePage;