import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Navbar from "../components/Navbar";
import { transactionsAPI } from "../services/api";

const FILTERS = ["ALL", "SUCCESS", "FRAUD"];

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await transactionsAPI.getHistory();
        setTransactions(response.data.transactions || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Unable to load transactions");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter((t) => {
      if (filter !== "ALL" && t.status !== filter) return false;
      if (!q) return true;
      return (
        String(t.receiver_name || "").toLowerCase().includes(q) ||
        String(t.receiver_account || "").toLowerCase().includes(q) ||
        String(t.id).includes(q)
      );
    });
  }, [transactions, query, filter]);

  const counts = {
    ALL: transactions.length,
    SUCCESS: transactions.filter((t) => t.status === "SUCCESS").length,
    FRAUD: transactions.filter((t) => t.status === "FRAUD").length,
  };

  return (
    <>
      <Navbar />

      <main className="container">
        <div className="page-header">
          <div>
            <h1>Transaction history</h1>
            <p className="muted">All transfers from your account, with fraud checks.</p>
          </div>
          <span className="transaction-count">{transactions.length} total</span>
        </div>

        {!loading && !error && transactions.length > 0 && (
          <div className="toolbar">
            <div className="search">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search name, account or ID"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search transactions"
              />
            </div>

            <div className="chips">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  className={`chip ${filter === f ? "active" : ""} ${f === "FRAUD" ? "chip-fraud" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "ALL" ? "All" : f === "SUCCESS" ? "Successful" : "Fraud"} ({counts[f]})
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="skeleton-list">
            {[0, 1, 2, 3].map((i) => <div className="skeleton" key={i} />)}
          </div>
        )}

        {error && <div className="error-card">{error}</div>}

        {!loading && !error && transactions.length === 0 && (
          <div className="empty-card">No transactions found.</div>
        )}

        {!loading && !error && transactions.length > 0 && visible.length === 0 && (
          <div className="empty-card">Nothing matches your search or filter.</div>
        )}

        {!loading && !error && visible.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Receiver</th>
                  <th>Account</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Risk</th>
                  <th>Reason</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {visible.map((txn, i) => (
                  <motion.tr
                    key={txn.id}
                    className={txn.status === "FRAUD" ? "row-fraud" : ""}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.025, 0.4) }}
                  >
                    <td>#{txn.id}</td>
                    <td>{txn.receiver_name}</td>
                    <td>{txn.receiver_account}</td>
                    <td>₹ {Number(txn.amount).toLocaleString("en-IN")}</td>
                    <td>
                      <span className={txn.status === "FRAUD" ? "status fraud" : "status success"}>
                        {txn.status}
                      </span>
                    </td>
                    <td>
                      <span className={`risk risk-${String(txn.riskLevel || "LOW").toLowerCase()}`}>
                        {txn.riskLevel || "LOW"}
                      </span>
                    </td>
                    <td className="reason">{txn.fraud_reason || "-"}</td>
                    <td>{new Date(txn.created_at).toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}

export default Transactions;
