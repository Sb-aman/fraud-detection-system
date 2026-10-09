import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Send, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { transactionsAPI } from "../services/api";
import useCountUp from "../hooks/useCountUp";

const inr = (n) => Number(n).toLocaleString("en-IN");

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getUser();
  const accountNumber = user?.accountNumber || user?.account_number;

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [balanceResponse, historyResponse] = await Promise.all([
          transactionsAPI.getBalance(),
          transactionsAPI.getHistory(),
        ]);

        setBalance(Number(balanceResponse.data.balance));
        setTransactions(historyResponse.data.transactions || []);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Couldn't load your account. Check that the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const successful = transactions.filter((t) => t.status === "SUCCESS").length;
  const fraud = transactions.filter((t) => t.status === "FRAUD").length;
  const total = transactions.length;
  const fraudPct = total ? Math.round((fraud / total) * 100) : 0;

  const animatedBalance = useCountUp(balance);

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(String(accountNumber));
      toast.success("Account number copied");
    } catch {
      toast.error("Couldn't copy. Select and copy it manually.");
    }
  };

  const list = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Navbar />

      <main className="container">
        <div className="welcome-row">
          <div>
            <h1>Hi, {user?.name || "there"}</h1>
            <p className="muted">Here's what's happening with your account.</p>
          </div>

          <Link to="/send-money" className="primary-btn link-btn">
            <Send size={16} /> Send money
          </Link>
        </div>

        {error && <div className="error-card">{error}</div>}

        {/* ACCOUNT CARD */}
        <motion.div
          className="account-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <p className="card-label">Available balance</p>
            <h2 className="balance">
              ₹ {loading ? "—" : inr(Math.round(animatedBalance))}
            </h2>
          </div>

          <div className="account-no">
            <p className="card-label">Account number</p>
            <div className="acc-row">
              <h3>{accountNumber || "Not available"}</h3>
              {accountNumber && (
                <button className="icon-btn" onClick={copyAccount} aria-label="Copy account number">
                  <Copy size={16} />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="stats-grid">
          <motion.div className="stat-card" whileHover={{ y: -3 }}>
            <span>Total transactions</span>
            <strong>{total}</strong>
          </motion.div>

          <motion.div className="stat-card ok-stat" whileHover={{ y: -3 }}>
            <span><CheckCircle2 size={15} /> Successful</span>
            <strong>{successful}</strong>
          </motion.div>

          <motion.div className="stat-card fraud-stat" whileHover={{ y: -3 }}>
            <span><ShieldAlert size={15} /> Fraud detected</span>
            <strong>{fraud}</strong>
          </motion.div>
        </div>

        {total > 0 && (
          <div className="split-card">
            <div className="split-head">
              <span>Safe vs fraud</span>
              <span className="muted">{fraudPct}% flagged</span>
            </div>
            <div className="split-bar" role="img" aria-label={`${fraudPct} percent of transactions flagged as fraud`}>
              <motion.div
                className="split-ok"
                initial={{ width: 0 }}
                animate={{ width: `${100 - fraudPct}%` }}
                transition={{ duration: 0.8 }}
              />
              <motion.div
                className="split-fraud"
                initial={{ width: 0 }}
                animate={{ width: `${fraudPct}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        )}

        {/* RECENT TRANSACTIONS */}
        <section className="section">
          <div className="section-header">
            <h2>Recent transactions</h2>
            <Link to="/transactions" className="text-link">
              View all <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="skeleton-list">
              {[0, 1, 2].map((i) => <div className="skeleton" key={i} />)}
            </div>
          ) : transactions.length === 0 ? (
            <div className="empty-card">
              <p>No transactions yet.</p>
              <Link to="/send-money" className="text-link">Send your first transfer</Link>
            </div>
          ) : (
            <motion.div
              className="transaction-list"
              variants={list}
              initial="hidden"
              animate="show"
            >
              {transactions.slice(0, 5).map((txn) => (
                <motion.div
                  className={`transaction-item ${txn.status === "FRAUD" ? "is-fraud" : ""}`}
                  key={txn.id}
                  variants={item}
                >
                  <div className="avatar">
                    {(txn.receiver_name || "?").charAt(0).toUpperCase()}
                  </div>

                  <div className="txn-main">
                    <strong>{txn.receiver_name}</strong>
                    <p className="muted">{txn.receiver_account}</p>
                  </div>

                  <div className="transaction-right">
                    <strong>₹ {inr(txn.amount)}</strong>
                    <span className={txn.status === "FRAUD" ? "status fraud" : "status success"}>
                      {txn.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </main>
    </>
  );
}

export default Dashboard;
