import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { handleRegister, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
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
      await handleRegister(formData);
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error?.response?.data || error.message);
      const data = error?.response?.data;

      if (typeof data === "object" && data !== null) {
        const firstMessage = Object.values(data).flat().join(" ");
        setErrorMessage(firstMessage || "Registration failed.");
      } else {
        setErrorMessage("Registration failed.");
      }
    }
  };

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create account</h1>
          <p>Start building your personalized audio experience.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              name="name"
              type="text"
              placeholder="Enter your name"
              onChange={handleChange}
              value={formData.name}
            />
          </div>

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
              placeholder="Create a password"
              onChange={handleChange}
              value={formData.password}
            />
          </div>

          {errorMessage && (
            <p style={{ color: "#fca5a5", marginTop: "0.5rem" }}>{errorMessage}</p>
          )}

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Create Account"}
            </button>
          </div>
        </form>

        <p className="form-footer">
          Already have an account?{" "}
          <Link className="text-white" to="/login">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;