const db = require("../config/db");
const detectFraud = require("../utils/fraudDetector");

// ================= SEND MONEY =================
const getBalance = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const userEmail = req.user.email;

        const [result] = await connection.query(
            "SELECT id, name, email, account_number, balance FROM users WHERE email = ?",
            [userEmail]
        );

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Balance fetched successfully",
            balance: result[0].balance,
            accountNumber: result[0].account_number
        });

    } catch (error) {
        console.error("Get Balance Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
};
const sendMoney = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();

    await connection.beginTransaction();

    const { receiverAccount, amount } = req.body;

    const senderEmail = req.user.email;

    // ================= VALIDATION =================

   if (!receiverAccount || amount === undefined || amount === null) {
      await connection.rollback();
      connection.release();

      return res.status(400).json({
        success: false,
        message: "Receiver Account and Amount are required",
      });
    }
    const numericAmount = Number(amount);

if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    await connection.rollback();
    connection.release();

    return res.status(400).json({
        success: false,
        message: "Amount must be a valid positive number"
    });
} 

    // ================= SENDER FETCH =================

  const [senderResult] = await connection.query(
  "SELECT * FROM users WHERE email = ? FOR UPDATE",
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
  "SELECT * FROM users WHERE account_number = ? FOR UPDATE",
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

    if (sender.balance < numericAmount) {
    await connection.rollback();
    connection.release();

    return res.status(400).json({
        success: false,
        message: "Insufficient Balance"
    });
}
    // ================= DECIDE STATUS =================

//   let status = "SUCCESS";
// let fraudReason = null;
// let riskLevel = "LOW";

// if (Number(amount) > 50000) {
//     status = "FRAUD";
//     fraudReason = "HIGH_AMOUNT";
//     riskLevel = "HIGH";
// }
                                          //--> ye kam ab fraudetector.js kar rha h
// if (transactionCount >= 5) {
//     status = "FRAUD";
//     fraudReason = "RAPID_TRANSACTION";
//     riskLevel = "HIGH";
// }

const fraudResult = detectFraud({
  numericAmount,
  transactionCount,
});

const { status, fraudReason, riskLevel } = fraudResult;

if (status === "FRAUD") {

    await connection.query(
        `INSERT INTO transactions
        (sender_id, receiver_id, numericAmount, status, fraud_reason ,riskLevel)
        VALUES (?, ?, ?, ?, ? ,?)`,
        [sender.id, receiver.id, numericAmount, status, fraudReason ,riskLevel]
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
      [numericAmount, sender.id],
    );

    // ================= ADD MONEY =================

    await connection.query(
      "UPDATE users SET balance = balance + ? WHERE id = ?",
      [numericAmount, receiver.id],
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
  `SELECT
      t.id,
      t.amount,
      t.status,
      t.fraud_reason,
      t.riskLevel,
      t.created_at,

      sender.name AS sender_name,
      sender.account_number AS sender_account,

      receiver.name AS receiver_name,
      receiver.account_number AS receiver_account

   FROM transactions t

   JOIN users sender
     ON t.sender_id = sender.id

   JOIN users receiver
     ON t.receiver_id = receiver.id

   WHERE t.sender_id = ? OR t.receiver_id = ?

   ORDER BY t.created_at DESC`,
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
  transactionHistory,getBalance
};
