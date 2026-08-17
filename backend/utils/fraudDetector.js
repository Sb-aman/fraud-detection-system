const detectFraud = ({ amount, transactionCount }) => {
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

  return {
    status,
    fraudReason,
    riskLevel,
  };
};

module.exports = detectFraud;