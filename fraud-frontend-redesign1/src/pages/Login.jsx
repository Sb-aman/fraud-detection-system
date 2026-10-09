import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const errors = {
    email: !email
      ? "Enter your email"
      : !/^\S+@\S+\.\S+$/.test(email)
      ? "That email doesn't look right"
      : "",
    password: !password ? "Enter your password" : "",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTouched({ email: true, password: true });

    if (errors.email || errors.password) return;

    try {
      setLoading(true);

      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`Welcome back${user?.name ? ", " + user.name : ""}`);
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.request ? "Can't reach the server. Is the backend running?" : "Login failed");
      setError(msg);
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
        <h2>Log in</h2>
        <p className="sub">See your balance and which transfers were flagged.</p>

        <Field
          id="email"
          label="Email"
          type="email"
          icon={Mail}
          autoComplete="email"
          value={email}
          error={touched.email && errors.email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        />

        <Field
          id="password"
          label="Password"
          type="password"
          icon={Lock}
          autoComplete="current-password"
          value={password}
          error={touched.password && errors.password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        />

        {error && (
          <motion.p
            className="server-err"
            role="alert"
            initial={{ x: -6 }}
            animate={{ x: [0, -6, 6, -4, 4, 0] }}
            transition={{ duration: 0.35 }}
          >
            {error}
          </motion.p>
        )}

        <button className="primary-btn full-btn" disabled={loading}>
          {loading ? <span className="spinner" aria-hidden="true" /> : null}
          {loading ? "Logging in" : <>Log in <ArrowRight size={18} /></>}
        </button>

        <p className="auth-footer">
          New to FraudGuard? <Link to="/register">Create account</Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
}

export default Login;
