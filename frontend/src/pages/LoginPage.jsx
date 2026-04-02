import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { handleLogin, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(formData);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error?.response?.data || error.message);
      setErrorMessage(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Login failed."
      );
    }
  };

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Login to continue your audio learning journey.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              value={formData.password}
            />
          </div>

          {errorMessage && (
            <p style={{ color: "#fca5a5", marginTop: "0.5rem" }}>{errorMessage}</p>
          )}

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Login"}
            </button>
          </div>
        </form>

        <p className="form-footer">
          Don&apos;t have an account?{" "}
          <Link className="text-white" to="/register">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;