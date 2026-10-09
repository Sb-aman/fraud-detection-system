import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, ShieldAlert, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { transactionsAPI } from "../services/api";

const QUICK = [500, 1000, 5000, 10000];

function SendMoney() {
  const [receiverAccount, setReceiverAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [confirmSelf, setConfirmSelf] = useState(false);
  const [result, setResult] = useState(null); // { type: "fraud" | "success", ... }

  const errors = {
    receiver: !receiverAccount.trim() ? "Enter the receiver's account number" : "",
    amount: !amount
      ? "Enter an amount"
      : Number(amount) <= 0
      ? "Amount must be greater than 0"
      : "",
  };

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  const send = async (isSelfTransfer) => {
    try {
      setLoading(true);
      setResult(null);

      const response = await transactionsAPI.sendMoney({
        receiverAccount,
        amount: Number(amount),
        confirmSelfTransfer: isSelfTransfer,
      });

      const data = response.data;

      if (data.status === "FRAUD") {
        setResult({
          type: "fraud",
          reason: data.fraudReason,
          risk: data.riskLevel,
        });
        toast.error("Transaction blocked as fraud");
        return;
      }

      setResult({
        type: "success",
        message: data.message || "Money transferred successfully",
      });
      toast.success("Money sent");
      setReceiverAccount("");
      setAmount("");
      setTouched({});
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error(error.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ receiver: true, amount: true });
    if (errors.receiver || errors.amount) return;

    const user = getUser();
    const own = user?.accountNumber || user?.account_number;
    const isSelfTransfer = receiverAccount === own;

    if (isSelfTransfer) {
      setConfirmSelf(true); // opens the confirm dialog
      return;
    }
    send(false);
  };

  return (
    <>
      <Navbar />

      <main className="container small-container">
        <div className="page-header">
          <div>
            <h1>Send money</h1>
            <p className="muted">Every transfer is checked for fraud before it goes through.</p>
          </div>
          <Link to="/dashboard" className="text-link">
            <ArrowLeft size={15} /> Dashboard
          </Link>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit} noValidate>
            <div className={`field plain ${touched.receiver && errors.receiver ? "has-error" : ""}`}>
              <input
                id="receiver"
                type="text"
                placeholder=" "
                value={receiverAccount}
                onChange={(e) => setReceiverAccount(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, receiver: true }))}
              />
              <label htmlFor="receiver">Receiver account (e.g. ACC123456)</label>
              {touched.receiver && errors.receiver && (
                <span className="err" role="alert">{errors.receiver}</span>
              )}
            </div>

            <div className={`field plain ${touched.amount && errors.amount ? "has-error" : ""}`}>
              <input
                id="amount"
                type="number"
                min="1"
                placeholder=" "
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, amount: true }))}
              />
              <label htmlFor="amount">Amount (₹)</label>
              {touched.amount && errors.amount && (
                <span className="err" role="alert">{errors.amount}</span>
              )}
            </div>

            <div className="chips">
              {QUICK.map((q) => (
                <button
                  type="button"
                  key={q}
                  className={`chip ${Number(amount) === q ? "active" : ""}`}
                  onClick={() => setAmount(String(q))}
                >
                  ₹ {q.toLocaleString("en-IN")}
                </button>
              ))}
            </div>

            <button type="submit" className="primary-btn full-btn" disabled={loading}>
              {loading ? <span className="spinner" aria-hidden="true" /> : <Send size={16} />}
              {loading ? "Checking for fraud" : "Send money"}
            </button>
          </form>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              key={result.type}
              className={`result-card ${result.type}`}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              role="status"
            >
              {result.type === "fraud" ? (
                <>
                  <ShieldAlert size={28} />
                  <div>
                    <h3>Fraud detected. Transfer blocked.</h3>
                    <p><strong>Reason:</strong> {result.reason || "Not provided"}</p>
                    <p><strong>Risk level:</strong> {result.risk || "Not provided"}</p>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle2 size={28} />
                  <div>
                    <h3>Transfer complete</h3>
                    <p>{result.message}</p>
                    <Link to="/transactions" className="text-link">See in history</Link>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* SELF-TRANSFER CONFIRM */}
      <AnimatePresence>
        {confirmSelf && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmSelf(false)}
          >
            <motion.div
              className="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="self-title"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="self-title">Send to your own account?</h3>
              <p className="muted">
                The receiver account is your own. Do you want to continue?
              </p>
              <div className="modal-actions">
                <button className="ghost-btn" onClick={() => setConfirmSelf(false)}>
                  Cancel
                </button>
                <button
                  className="primary-btn"
                  autoFocus
                  onClick={() => {
                    setConfirmSelf(false);
                    send(true);
                  }}
                >
                  Yes, continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SendMoney;
