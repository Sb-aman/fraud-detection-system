const db = require("../config/db");
const detectFraud = require("../utils/fraudDetector");

// =====================================================
// GET BALANCE
// =====================================================

const getBalance = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const userEmail = req.user.email;

        const [result] = await connection.query(
            `SELECT id, name, email, account_number, balance
             FROM users
             WHERE email = ?`,
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
            balance: Number(result[0].balance),
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


// =====================================================
// SEND MONEY
// =====================================================

const sendMoney = async (req, res) => {

    let connection;

    try {

        connection = await db.getConnection();

        await connection.beginTransaction();

        // =====================================================
        // GET REQUEST DATA
        // =====================================================

        const {
            receiverAccount,
            amount,
            confirmSelfTransfer
        } = req.body;

        const senderEmail = req.user.email;

        // =====================================================
        // VALIDATION
        // =====================================================

        if (
            !receiverAccount ||
            amount === undefined ||
            amount === null
        ) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Receiver Account and Amount are required"
            });
        }

        const numericAmount = Number(amount);

        if (
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Amount must be a valid positive number"
            });
        }

        // =====================================================
        // FETCH SENDER
        // =====================================================

        const [senderResult] = await connection.query(
            `SELECT *
             FROM users
             WHERE email = ?
             FOR UPDATE`,
            [senderEmail]
        );

        if (senderResult.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Sender Not Found"
            });
        }

        const sender = senderResult[0];

        // =====================================================
        // FETCH RECEIVER
        // =====================================================

        const [receiverResult] = await connection.query(
            `SELECT *
             FROM users
             WHERE account_number = ?
             FOR UPDATE`,
            [receiverAccount]
        );

        if (receiverResult.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Receiver Not Found"
            });
        }

        const receiver = receiverResult[0];

        // =====================================================
        // CHECK SELF TRANSFER
        // =====================================================

        const isSelfTransfer =
            sender.account_number === receiver.account_number;

        if (isSelfTransfer && !confirmSelfTransfer) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Self-transfer confirmation required",
                selfTransfer: true
            });
        }

        // =====================================================
        // PREVIOUS BALANCES
        // =====================================================

        const senderPreviousBalance =
            Number(sender.balance);

        const receiverPreviousBalance =
            Number(receiver.balance);

        // =====================================================
        // BALANCE CHECK
        // =====================================================

        if (senderPreviousBalance < numericAmount) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Insufficient Balance"
            });
        }

        // =====================================================
        // RECENT TRANSACTION COUNT
        // =====================================================

        const [recentTransactions] =
            await connection.query(
                `SELECT COUNT(*) AS total
                 FROM transactions
                 WHERE sender_id = ?
                 AND created_at >= NOW() - INTERVAL 1 MINUTE`,
                [sender.id]
            );

        const transactionCount =
            Number(recentTransactions[0].total);

        // =====================================================
        // FRAUD DETECTION
        // =====================================================

        const fraudResult = detectFraud({
            amount: numericAmount,
            transactionCount
        });

        const {
            status,
            fraudReason,
            riskLevel
        } = fraudResult;

        // =====================================================
        // FRAUD TRANSACTION
        // =====================================================

        if (status === "FRAUD") {

            await connection.query(
                `INSERT INTO transactions
                (
                    sender_id,
                    receiver_id,
                    amount,
                    status,
                    fraud_reason,
                    riskLevel
                )
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    sender.id,
                    receiver.id,
                    numericAmount,
                    status,
                    fraudReason,
                    riskLevel
                ]
            );

            await connection.commit();

            return res.status(200).json({
                success: false,
                message: "Fraud Transaction Detected",
                status,
                fraudReason,
                riskLevel
            });
        }

        // =====================================================
        // SUCCESS TRANSACTION
        // =====================================================

        /*
         * Self transfer:
         * Same account is sender and receiver.
         *
         * We DON'T need to change balance because:
         *
         * ₹50,000 - ₹1,000 + ₹1,000 = ₹50,000
         */

        if (!isSelfTransfer) {

            // -------------------------------
            // DEDUCT MONEY FROM SENDER
            // -------------------------------

            await connection.query(
                `UPDATE users
                 SET balance = balance - ?
                 WHERE id = ?`,
                [
                    numericAmount,
                    sender.id
                ]
            );

            // -------------------------------
            // ADD MONEY TO RECEIVER
            // -------------------------------

            await connection.query(
                `UPDATE users
                 SET balance = balance + ?
                 WHERE id = ?`,
                [
                    numericAmount,
                    receiver.id
                ]
            );
        }

        // =====================================================
        // SAVE TRANSACTION
        // =====================================================

        await connection.query(
            `INSERT INTO transactions
            (
                sender_id,
                receiver_id,
                amount,
                status,
                fraud_reason,
                riskLevel
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                sender.id,
                receiver.id,
                numericAmount,
                "SUCCESS",
                null,
                riskLevel
            ]
        );

        // =====================================================
        // COMMIT
        // =====================================================

        await connection.commit();

        // =====================================================
        // CURRENT BALANCES
        // =====================================================

        const [updatedUsers] =
            await connection.query(
                `SELECT
                    id,
                    name,
                    account_number,
                    balance
                 FROM users
                 WHERE id IN (?, ?)`,
                [
                    sender.id,
                    receiver.id
                ]
            );

        // =====================================================
        // FIND UPDATED BALANCES
        // =====================================================

        let senderCurrentBalance;
        let receiverCurrentBalance;

        if (isSelfTransfer) {

            senderCurrentBalance =
                senderPreviousBalance;

            receiverCurrentBalance =
                receiverPreviousBalance;

        } else {

            const updatedSender =
                updatedUsers.find(
                    user => user.id === sender.id
                );

            const updatedReceiver =
                updatedUsers.find(
                    user => user.id === receiver.id
                );

            senderCurrentBalance =
                Number(updatedSender.balance);

            receiverCurrentBalance =
                Number(updatedReceiver.balance);
        }

        // =====================================================
        // SUCCESS RESPONSE
        // =====================================================

        return res.status(200).json({

            success: true,

            message: isSelfTransfer
                ? "Self-transfer completed successfully"
                : "Money Transferred Successfully",

            transaction: {

                senderName:
                    sender.name,

                senderAccount:
                    sender.account_number,

                receiverName:
                    receiver.name,

                receiverAccount:
                    receiver.account_number,

                transferredAmount:
                    numericAmount,

                senderBalance: {

                    previous:
                        senderPreviousBalance,

                    current:
                        senderCurrentBalance
                },

                receiverBalance: {

                    previous:
                        receiverPreviousBalance,

                    current:
                        receiverCurrentBalance
                },

                status: "SUCCESS",

                fraudReason: null,

                riskLevel
            }
        });

    } catch (error) {

        // =====================================================
        // ROLLBACK ON ERROR
        // =====================================================

        if (connection) {

            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error(
                    "Rollback Error:",
                    rollbackError
                );
            }

            connection.release();
        }

        console.error(
            "Send Money Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Transaction Failed"
        });
    }
};


// =====================================================
// TRANSACTION HISTORY
// =====================================================

const transactionHistory = async (req, res) => {

    try {

        const userEmail = req.user.email;

        // =====================================================
        // FIND USER
        // =====================================================

        const [userResult] =
            await db.query(
                `SELECT *
                 FROM users
                 WHERE email = ?`,
                [userEmail]
            );

        if (userResult.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        const user = userResult[0];

        // =====================================================
        // GET TRANSACTIONS
        // =====================================================

        const [transactions] =
            await db.query(
                `SELECT

                    t.id,
                    t.amount,
                    t.status,
                    t.fraud_reason,
                    t.riskLevel,
                    t.created_at,

                    sender.name
                        AS sender_name,

                    sender.account_number
                        AS sender_account,

                    receiver.name
                        AS receiver_name,

                    receiver.account_number
                        AS receiver_account

                 FROM transactions t

                 JOIN users sender
                    ON t.sender_id = sender.id

                 JOIN users receiver
                    ON t.receiver_id = receiver.id

                 WHERE
                    t.sender_id = ?
                    OR t.receiver_id = ?

                 ORDER BY
                    t.created_at DESC`,
                [
                    user.id,
                    user.id
                ]
            );

        // =====================================================
        // RESPONSE
        // =====================================================

        return res.status(200).json({

            success: true,

            totalTransactions:
                transactions.length,

            transactions
        });

    } catch (error) {

        console.error(
            "Transaction History Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    sendMoney,
    transactionHistory,
    getBalance
};