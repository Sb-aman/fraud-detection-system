import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { transactionsAPI } from "../services/api";

function Dashboard() {

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const [balanceResponse, historyResponse] =
          await Promise.all([
            transactionsAPI.getBalance(),
            transactionsAPI.getHistory(),
          ]);

        setBalance(
          Number(balanceResponse.data.balance)
        );

        setTransactions(
          historyResponse.data.transactions || []
        );

      } catch (error) {

        console.error(
          "Dashboard error:",
          error
        );

      } finally {
        setLoading(false);
      }
    };

    loadDashboard();

  }, []);

  const successful = transactions.filter(
    (txn) => txn.status === "SUCCESS"
  ).length;

  const fraud = transactions.filter(
    (txn) => txn.status === "FRAUD"
  ).length;

  return (
    <>

      <Navbar />

      <main className="container">

        <div className="welcome-row">

          <div>
            <h1>
              Welcome, {user?.name}
            </h1>

            <p className="muted">
              Monitor your account and transactions
            </p>
          </div>

          <Link
            to="/send-money"
            className="primary-btn link-btn"
          >
            + Send Money
          </Link>

        </div>

        {/* ACCOUNT CARD */}

        <div className="account-card">

          <div>

            <p className="card-label">
              Account Number
            </p>

            <h2>
              {user?.accountNumber ||
                user?.account_number ||
                "Not available"}
            </h2>

          </div>

          <div>

            <p className="card-label">
              Available Balance
            </p>

            <h2>
              ₹ {balance.toLocaleString("en-IN")}
            </h2>

          </div>

        </div>

        {/* STATS */}

        <div className="stats-grid">

          <div className="stat-card">
            <span>Total Transactions</span>
            <strong>{transactions.length}</strong>
          </div>

          <div className="stat-card">
            <span>Successful</span>
            <strong>{successful}</strong>
          </div>

          <div className="stat-card fraud-stat">
            <span>Fraud Detected</span>
            <strong>{fraud}</strong>
          </div>

        </div>

        {/* RECENT TRANSACTIONS */}

        <section className="section">

          <div className="section-header">

            <h2>Recent Transactions</h2>

            <Link to="/transactions">
              View All
            </Link>

          </div>

          {loading ? (

            <div className="empty-card">
              Loading transactions...
            </div>

          ) : transactions.length === 0 ? (

            <div className="empty-card">
              No transactions yet.
            </div>

          ) : (

            <div className="transaction-list">

              {transactions
                .slice(0, 5)
                .map((txn) => (

                  <div
                    className="transaction-item"
                    key={txn.id}
                  >

                    <div>

                      <strong>
                        {txn.receiver_name}
                      </strong>

                      <p className="muted">
                        {txn.receiver_account}
                      </p>

                    </div>

                    <div className="transaction-right">

                      <strong>
                        ₹{" "}
                        {Number(
                          txn.amount
                        ).toLocaleString("en-IN")}
                      </strong>

                      <span
                        className={
                          txn.status === "FRAUD"
                            ? "status fraud"
                            : "status success"
                        }
                      >
                        {txn.status}
                      </span>

                    </div>

                  </div>

                ))}

            </div>

          )}

        </section>

      </main>

    </>
  );
}

export default Dashboard;