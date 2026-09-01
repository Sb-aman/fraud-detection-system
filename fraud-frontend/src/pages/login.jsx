import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await authAPI.login({
        email,
        password,
      });

      const { token, user } = response.data;

      // Save JWT
      localStorage.setItem("authToken", token);

      // Save user
      localStorage.setItem("user", JSON.stringify(user));

      // Dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.title}>
          FraudGuard
        </h1>

        <p style={styles.subtitle}>
          Secure Fraud Detection Portal
        </p>

        <form onSubmit={handleSubmit}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          {error && (
            <p style={styles.error}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#337fcc",
  },

  card: {
    width: "350px",
    padding: "30px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    marginBottom: "50px",
    // background: "#ec1414", 
    color: 'black',
    
  },

  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "15px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "11px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },

  error: {
    color: "#dc2626",
    fontSize: "14px",
    marginBottom: "10px",
  },
};

export default Login;