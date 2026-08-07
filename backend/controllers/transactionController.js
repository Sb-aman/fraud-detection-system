const db = require("../config/db");

// ================= SEND MONEY =================
const sendMoney = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();

    await connection.beginTransaction();

    const { receiverAccount, amount } = req.body;

    const senderEmail = req.user.email;

    // ================= VALIDATION =================

    if (!receiverAccount || !amount) {
      await connection.rollback();
      connection.release();

      return res.status(400).json({
        success: false,
        message: "Receiver Account and Amount are required",
      });
    }

    // ================= SENDER FETCH =================

    const [senderResult] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [senderEmail],
    );

    if (senderResult.length === 0) {
      await connection.rollback();
      connection.release();

      return res.status(404).json({
        success: false,
        message: "Sender Not Found",
      });
    }

    const sender = senderResult[0];

    // RECENT TRANSACTION 
    const [recentTransactions] = await connection.query(
    `SELECT COUNT(*) AS total
     FROM transactions
     WHERE sender_id = ?
     AND created_at >= NOW() - INTERVAL 1 MINUTE`,
    [sender.id]
);
const transactionCount = recentTransactions[0].total;

    // ================= RECEIVER FETCH =================

    const [receiverResult] = await connection.query(
      "SELECT * FROM users WHERE account_number = ?",
      [receiverAccount],
    );

    if (receiverResult.length === 0) {
      await connection.rollback();
      connection.release();

      return res.status(404).json({
        success: false,
        message: "Receiver Not Found",
      });
    }

    const receiver = receiverResult[0];

    // ================= PREVIOUS BALANCE  =================
    const senderPreviousBalance = Number(sender.balance);
    const receiverPreviousBalance = Number(receiver.balance);

    // ================= SELF TRANSFER =================

    if (sender.account_number === receiver.account_number) {
      await connection.rollback();
      connection.release();

      return res.status(400).json({
        success: false,
        message: "You cannot transfer money to your own account",
      });
    }

    // ================= BALANCE CHECK =================

    if (Number(sender.balance) < Number(amount)) {
      await connection.rollback();
      connection.release();

      return res.status(400).json({
        success: false,
        message: "Insufficient Balance",
      });
    }
    // ================= DECIDE STATUS =================

  let status = "SUCCESS";
let fraudReason = null;
let riskLevel = "LOW";

if (Number(amount) > 50000) {
    status = "FRAUD";
    fraudReason = "HIGH_AMOUNT";
    riskLevel = "HIGH";
}

if (transactionCount >= 5) {
    status = "FRAUD";
    fraudReason = "RAPID_TRANSACTION";
    riskLevel = "HIGH";
}

if (status === "FRAUD") {

    await connection.query(
        `INSERT INTO transactions
        (sender_id, receiver_id, amount, status, fraud_reason ,riskLevel)
        VALUES (?, ?, ?, ?, ? ,?)`,
        [sender.id, receiver.id, amount, status, fraudReason ,riskLevel]
    );

    await connection.commit();
    connection.release();

    return res.status(200).json({
        success: false,
        message: "Fraud Transaction Detected",
        status,
        fraudReason
    });
}
    
  
    // ================= DEDUCT MONEY =================

    await connection.query(
      "UPDATE users SET balance = balance - ? WHERE id = ?",
      [amount, sender.id],
    );

    // ================= ADD MONEY =================

    await connection.query(
      "UPDATE users SET balance = balance + ? WHERE id = ?",
      [amount, receiver.id],
    );

    // ================= SAVE TRANSACTION =================

    await connection.query(
      `INSERT INTO transactions
            (sender_id, receiver_id, amount, status, fraud_reason)
            VALUES (?, ?, ?, ?, ? )`,
      [sender.id, receiver.id, amount, "SUCCESS" ,null ],
    );

    // ================= COMMIT =================

    await connection.commit();

    // ================= UPDATED BALANCE =================

    const [updatedUsers] = await connection.query(
      "SELECT id,name,account_number,balance FROM users WHERE id IN (?,?)",
      [sender.id, receiver.id],
    );

    connection.release();

    return res.status(200).json({
      success: true,
      message: "Money Transferred Successfully",

      transaction: {
        senderName: sender.name,
        senderAccount: sender.account_number,

        receiverName: receiver.name,
        receiverAccount: receiver.account_number,

        transferredAmount: Number(amount),

        senderBalance: {
          previous: senderPreviousBalance,
          current: senderPreviousBalance - Number(amount),
        },

        receiverBalance: {
          previous: receiverPreviousBalance,
          current: receiverPreviousBalance + Number(amount),
        },

        status: "SUCCESS",
      },
    });

    //        return res.status(200).json({
    //     success: true,
    //     message: "Money Transferred Successfully",

    //     transaction: {
    //         senderName: sender.name,
    //         senderAccount: sender.account_number,

    //         receiverName: receiver.name,
    //         receiverAccount: receiver.account_number,

    //         transferredAmount: Number(amount),
    //         status: "SUCCESS"
    //     },

    //     users: updatedUsers
    // });
  
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Transaction Failed",
    });
  }
}

// ================= TRANSACTION HISTORY =================

const transactionHistory = async (req, res) => {
  try {
    const senderEmail = req.user.email;

    const [userResult] = await db.query("SELECT * FROM users WHERE email = ?", [
      senderEmail,
    ]);

    if (userResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    const user = userResult[0];

    const [transactions] = await db.query(
      `SELECT *
             FROM transactions
             WHERE sender_id = ? OR receiver_id = ?
             ORDER BY created_at DESC`,
      [user.id, user.id],
    );

    return res.status(200).json({
      success: true,
      totalTransactions: transactions.length,
      transactions,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  sendMoney,
  transactionHistory,
};
