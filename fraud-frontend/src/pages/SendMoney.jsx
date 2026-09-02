import { useState } from "react";
import { transactionsAPI } from "../services/api";

function SendMoney() {

  const [receiverAccount, setReceiverAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    // ================= VALIDATION =================

    if (!receiverAccount || !amount) {
      alert("Receiver account and amount are required");
      return;
    }

    if (Number(amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    // ================= GET LOGGED IN USER =================

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    // ================= SELF TRANSFER CHECK =================

    const isSelfTransfer =
      receiverAccount === user?.accountNumber;

    if (isSelfTransfer) {

      const confirmTransfer = window.confirm(
        "You are transferring money to your own account.\n\nDo you want to continue?"
      );

      // User clicked Cancel
      if (!confirmTransfer) {
        return;
      }
    }

    // ================= SEND MONEY =================

    try {

      setLoading(true);

      const response =
        await transactionsAPI.sendMoney({

          receiverAccount,

          amount: Number(amount),

          // Backend ko batayenge ki user ne
          // self-transfer confirm kiya hai
          confirmSelfTransfer: isSelfTransfer
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
    <div>

      <h1>Send Money</h1>

      <form onSubmit={handleSubmit}>

        <div>

          <label>
            Receiver Account
          </label>

          <br />

          <input
            type="text"
            placeholder="Enter receiver account"
            value={receiverAccount}
            onChange={(e) =>
              setReceiverAccount(e.target.value)
            }
          />

        </div>

        <br />

        <div>

          <label>
            Amount
          </label>

          <br />

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />

        </div>

        <br />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : "Send Money"}
        </button>

      </form>

    </div>
  );
}

export default SendMoney;