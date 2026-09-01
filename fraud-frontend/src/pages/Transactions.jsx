import { useEffect, useState } from "react";
import { transactionAPI } from "../services/api";

function Transactions() {

  const [transactions, setTransactions] =
    useState([]);

  useEffect(() => {

    const loadTransactions = async () => {

      try {

        const response =
          await transactionAPI.getHistory();

        setTransactions(
          response.data.transactions || []
        );

      } catch (error) {

        console.log(error);

      }

    };

    loadTransactions();

  }, []);

  return (
    <div>

      <h1>Transaction History</h1>

      <table>

        <thead>

          <tr>
            <th>ID</th>
            <th>Sender</th>
            <th>Receiver</th>
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

              <td>{txn.id}</td>

              <td>
                {txn.sender_name}
              </td>

              <td>
                {txn.receiver_name}
              </td>

              <td>
                ₹ {txn.amount}
              </td>

              <td>
                {txn.status}
              </td>

              <td>
                {txn.riskLevel || "LOW"}
              </td>

              <td>
                {txn.fraud_reason || "-"}
              </td>

              <td>
                {txn.created_at}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Transactions;