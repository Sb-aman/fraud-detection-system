import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";

// 0-4 based on length and character variety
function strength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const LABELS = ["Too weak", "Weak", "Okay", "Good", "Strong"];

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const errors = {
    name: !form.name.trim() ? "Enter your full name" : "",
    email: !form.email
      ? "Enter your email"
      : !/^\S+@\S+\.\S+$/.test(form.email)
      ? "That email doesn't look right"
      : "",
    password: !form.password ? "Create a password" : "",
  };

  const score = strength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTouched({ name: true, email: true, password: true });

    if (errors.name || errors.email || errors.password) return;

    try {
      setLoading(true);
      await authAPI.register(form);
      toast.success("Account created. Please log in.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (err.request ? "Can't reach the server. Is the backend running?" : "Registration failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.form
        className="auth-card"
        onSubmit={handleSubmit}
        noValidate
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2>Create account</h2>
        <p className="sub">Takes about a minute.</p>

        <Field
          id="name" name="name" label="Full name" icon={User}
          autoComplete="name"
          value={form.name} error={touched.name && errors.name}
          onChange={handleChange} onBlur={handleBlur}
        />
        <Field
          id="email" name="email" label="Email" type="email" icon={Mail}
          autoComplete="email"
          value={form.email} error={touched.email && errors.email}
          onChange={handleChange} onBlur={handleBlur}
        />
        <Field
          id="password" name="password" label="Password" type="password" icon={Lock}
          autoComplete="new-password"
          value={form.password} error={touched.password && errors.password}
          onChange={handleChange} onBlur={handleBlur}
        />

        {form.password && (
          <div className="meter" aria-live="polite">
            <div className="meter-bars">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={i < score ? `on s${score}` : ""} />
              ))}
            </div>
            <span className="meter-label">{LABELS[score]}</span>
          </div>
        )}

        {error && <p className="server-err" role="alert">{error}</p>}

        <button className="primary-btn full-btn" disabled={loading}>
          {loading ? <span className="spinner" aria-hidden="true" /> : null}
          {loading ? "Creating account" : <>Create account <ArrowRight size={18} /></>}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
}

export default Register;
