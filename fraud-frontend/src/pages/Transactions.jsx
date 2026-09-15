import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { transactionsAPI } from "../services/api";

function Transactions() {

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    const loadTransactions = async () => {

      try {

        const response =
          await transactionsAPI.getHistory();

        setTransactions(
          response.data.transactions || []
        );

      } catch (error) {

        console.error(error);

        setError(
          error.response?.data?.message ||
          "Unable to load transactions"
        );

      } finally {

        setLoading(false);

      }
    };

    loadTransactions();

  }, []);

  return (
    <>

      <Navbar />

      <main className="container">

        <div className="page-header">

          <div>
            <h1>Transaction History</h1>

            <p className="muted">
              All your account transactions
            </p>
          </div>

          <span className="transaction-count">
            {transactions.length} Transactions
          </span>

        </div>

        {loading && (
          <div className="empty-card">
            Loading transactions...
          </div>
        )}

        {error && (
          <div className="error-card">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          transactions.length === 0 && (

            <div className="empty-card">
              No transactions found.
            </div>

          )}

        {!loading &&
          !error &&
          transactions.length > 0 && (

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

                  {transactions.map((txn) => (

                    <tr key={txn.id}>

                      <td>#{txn.id}</td>

                      <td>
                        {txn.receiver_name}
                      </td>

                      <td>
                        {txn.receiver_account}
                      </td>

                      <td>
                        ₹{" "}
                        {Number(
                          txn.amount
                        ).toLocaleString("en-IN")}
                      </td>

                      <td>

                        <span
                          className={
                            txn.status === "FRAUD"
                              ? "status fraud"
                              : "status success"
                          }
                        >
                          {txn.status}
                        </span>

                      </td>

                      <td>
                        {txn.riskLevel || "LOW"}
                      </td>

                      <td>
                        {txn.fraud_reason || "-"}
                      </td>

                      <td>
                        {new Date(
                          txn.created_at
                        ).toLocaleString()}
                      </td>

                    </tr>

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