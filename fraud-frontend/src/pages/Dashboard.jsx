import { useEffect, useState } from "react";
import { transactionsAPI } from "../services/api";

function Dashboard() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadData = async () => {
      try {
        const balanceResponse =
          await transactionsAPI.getBalance();

        const historyResponse =
          await transactionsAPI.getHistory();

        setBalance(balanceResponse.data.balance);

        setTransactions(
          historyResponse.data.transactions || []
        );

      } catch (error) {
        console.log("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <h2>Loading dashboard...</h2>;
  }

  return (
    <div>

      <h1>
        Welcome, {user?.name}
      </h1>

      <h2>Account Number</h2>

      {/* <p>
        {user?.account_number}
      </p> */}
      <p>{user?.accountNumber || user?.account_number || "Not available"}</p>

      <h2>Balance</h2>

      <h3>
        ₹ {balance}
      </h3>

      <h2>Recent Transactions</h2>

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        transactions.slice(0, 5).map((txn) => (
          <div key={txn.id}>

            <p>
              Transaction #{txn.id}
            </p>

            <p>
              ₹ {txn.amount}
            </p>

            <p>
              Status: {txn.status}
            </p>

            <p>
              {txn.created_at}
            </p>

            <hr />

          </div>
        ))
      )}

    </div>
  );
}

export default Dashboard;