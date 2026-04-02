import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AudioPlayerProvider } from "./context/AudioPlayerContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SeriesDetailPage from "./pages/SeriesDetailPage";
import EpisodePlayerPage from "./pages/EpisodePlayerPage";
import MiniPlayer from "./components/MiniPlayer";

const Navbar = () => {
  const { user, handleLogout, isAuthenticated } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          AudioFlix
        </Link>

        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <span className="nav-user">{user?.email}</span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/register">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <div className="page-with-player">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/series/:slug" element={<SeriesDetailPage />} />
            <Route path="/episodes/:id" element={<EpisodePlayerPage />} />
          </Route>
        </Routes>
      </div>
      <MiniPlayer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AudioPlayerProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AudioPlayerProvider>
    </AuthProvider>
  );
}

export default App;