import { useState } from "react";
import { transactionAPI } from "../services/api";

function SendMoney() {

  const [receiverAccount, setReceiverAccount] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response =
        await transactionAPI.sendMoney({
          receiverAccount,
          amount: Number(amount),
        });

      const data = response.data;

      if (data.status === "FRAUD") {

        alert(
          `Fraud Transaction Detected\nReason: ${data.fraudReason}`
        );

        return;
      }

      alert(
        "Money Transferred Successfully"
      );

      setReceiverAccount("");
      setAmount("");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Transaction failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div>

      <h1>Send Money</h1>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Receiver Account"
          value={receiverAccount}
          onChange={(e) =>
            setReceiverAccount(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />

        <button type="submit">

          {loading
            ? "Processing..."
            : "Send Money"}

        </button>

      </form>

    </div>
  );
}

export default SendMoney;