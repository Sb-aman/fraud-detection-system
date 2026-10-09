import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

// Sample data only, for the decorative preview. Real data comes from the backend after login.
const SAMPLE = [
  { id: "A1", merchant: "Grocery store", amount: "₹ 480", risk: 6 },
  { id: "A2", merchant: "New account, 3rd transfer in 1 min", amount: "₹ 92,000", risk: 94 },
  { id: "A3", merchant: "Online shopping", amount: "₹ 1,299", risk: 11 },
  { id: "A4", merchant: "Unusual amount for this user", amount: "₹ 45,000", risk: 81 },
  { id: "A5", merchant: "Mobile recharge", amount: "₹ 200", risk: 3 },
  { id: "A6", merchant: "Transfer from new location", amount: "₹ 18,500", risk: 88 },
];

function LiveFeed() {
  const [tick, setTick] = useState(4);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 2200);
    return () => clearInterval(t);
  }, []);

  const rows = Array.from({ length: 4 }, (_, i) => {
    const item = SAMPLE[(tick - i + SAMPLE.length * 10) % SAMPLE.length];
    return { ...item, key: tick - i };
  });

  return (
    <ul className="feed" aria-label="Sample fraud checks">
      {rows.map((r, i) => {
        const flagged = r.risk >= 70;
        return (
          <motion.li
            key={r.key}
            layout
            initial={i === 0 ? { opacity: 0, y: -14 } : false}
            animate={{ opacity: 1 - i * 0.15, y: 0 }}
            className={`feed-row ${flagged ? "flagged" : "cleared"}`}
          >
            <div>
              <p className="feed-merchant">{r.merchant}</p>
              <p className="feed-meta">{r.amount}</p>
            </div>
            <div className="feed-status">
              <span className="feed-badge">{flagged ? "Fraud" : "Safe"}</span>
              <span className="feed-risk">Risk score {r.risk}</span>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}

export default function AuthLayout({ children }) {
  return (
    <main className="auth-shell">
      <section className="auth-hero">
        <div className="brand-row">
          <ShieldCheck size={30} />
          <h1>FraudGuard</h1>
        </div>
        <p className="hero-line">
          Every transfer is checked for fraud before the money moves.
        </p>
        <LiveFeed />
        <p className="hero-note">Preview with sample data</p>
      </section>

      <section className="auth-panel">{children}</section>
    </main>
  );
}
