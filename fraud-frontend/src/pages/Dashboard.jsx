import { useEffect, useState } from "react";
import { transactionAPI } from "../services/api";

function Dashboard() {

  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {

    const loadData = async () => {

      try {

        const balanceResponse =
          await transactionAPI.getBalance();

        const historyResponse =
          await transactionAPI.getHistory();

        setBalance(balanceResponse.data.balance);

        setTransactions(
          historyResponse.data.transactions || []
        );

      } catch (error) {

        console.log(error);

      }

    };

    loadData();

  }, []);

  return (
    <div>

      <h1>
        Welcome, {user?.name}
      </h1>

      <h2>
        Account Number
      </h2>

      <p>
        {user?.accountNumber}
      </p>

      <h2>
        Balance
      </h2>

      <h3>
        ₹ {balance}
      </h3>

      <h2>
        Recent Transactions
      </h2>

      {transactions.slice(0, 5).map((txn) => (

        <div key={txn.id}>

          <p>
            Transaction #{txn.id}
          </p>

          <p>
            ₹ {txn.amount}
          </p>

          <p>
            {txn.status}
          </p>

          <p>
            {txn.created_at}
          </p>

        </div>

      ))}

    </div>
  );
}

export default Dashboard;