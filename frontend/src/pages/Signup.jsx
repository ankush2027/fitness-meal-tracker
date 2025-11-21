import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerService } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    goal: "maintenance",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await registerService(form);
      login(data);
      toast.success("Account created successfully! Welcome!");
      navigate("/");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Unable to sign up";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>Create account</h2>
        {error && <p className="error-text">{error}</p>}
        <label>
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength={8}
            required
            placeholder="Min 8 chars, 1 uppercase, 1 lowercase, 1 number"
          />
          <small className="form-hint">
            Password must be at least 8 characters with uppercase, lowercase, and a number
          </small>
        </label>
        <label>
          Goal
          <select name="goal" value={form.goal} onChange={handleChange}>
            <option value="weight_loss">Weight loss</option>
            <option value="muscle_gain">Muscle gain</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </label>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Creating..." : "Sign up"}
        </button>
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;

