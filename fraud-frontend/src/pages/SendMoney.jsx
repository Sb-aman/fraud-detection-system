import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { transactionsAPI } from "../services/api";

function SendMoney() {

  const [receiverAccount, setReceiverAccount] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!receiverAccount || !amount) {
      alert(
        "Receiver account and amount are required"
      );
      return;
    }

    if (Number(amount) <= 0) {
      alert(
        "Amount must be greater than 0"
      );
      return;
    }

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const isSelfTransfer =
      receiverAccount === user?.accountNumber;

    // ================= SELF TRANSFER POPUP =================

    if (isSelfTransfer) {

      const confirmTransfer =
        window.confirm(
          "You are transferring money to your own account.\n\nDo you want to continue?"
        );

      if (!confirmTransfer) {
        return;
      }
    }

    try {

      setLoading(true);

      const response =
        await transactionsAPI.sendMoney({

          receiverAccount,

          amount: Number(amount),

          confirmSelfTransfer:
            isSelfTransfer,

        });

      const data = response.data;

      // ================= FRAUD =================

      if (data.status === "FRAUD") {

        alert(
          `⚠️ Fraud Transaction Detected\n\n` +
          `Reason: ${data.fraudReason}\n` +
          `Risk Level: ${data.riskLevel}`
        );

        return;
      }

      // ================= SUCCESS =================

      alert(
        data.message ||
        "Money Transferred Successfully"
      );

      setReceiverAccount("");
      setAmount("");

    } catch (error) {

      console.error(
        "Transaction error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Transaction failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <>

      <Navbar />

      <main className="container small-container">

        <div className="page-header">

          <div>
            <h1>Send Money</h1>

            <p className="muted">
              Securely transfer money to another account
            </p>
          </div>

          <Link to="/dashboard">
            ← Dashboard
          </Link>

        </div>

        <div className="form-card">

          <form onSubmit={handleSubmit}>

            <label>
              Receiver Account
            </label>

            <input
              type="text"
              placeholder="Example: ACC123456"
              value={receiverAccount}
              onChange={(e) =>
                setReceiverAccount(
                  e.target.value
                )
              }
            />

            <label>
              Amount
            </label>

            <input
              type="number"
              min="1"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
            />

            <button
              type="submit"
              className="primary-btn full-btn"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : "Send Money"}
            </button>

          </form>

        </div>

      </main>

    </>
  );
}

export default SendMoney;