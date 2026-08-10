import { COUNTRIES } from '../utils/constants';

const FIRST_NAMES = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Ananya', 'Arjun', 'Kavya', 'Rohan', 'Meera', 'Sanjay', 'Divya', 'Karan', 'Neha', 'Aditya', 'Pooja', 'Rahul', 'Shreya', 'Nikhil', 'Isha'];
const LAST_NAMES = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Reddy', 'Nair', 'Iyer', 'Mehta', 'Joshi', 'Desai', 'Verma', 'Rao', 'Malhotra', 'Chopra', 'Kapoor', 'Agarwal', 'Bhat', 'Pillai', 'Saxena'];
const STATUSES = ['approved', 'blocked', 'pending', 'fraud'];
const KYC_STATUSES = ['verified', 'pending', 'rejected', 'under_review'];
const ANALYSTS = ['Sarah Chen', 'Michael Torres', 'Emily Watson', 'James Park', 'Lisa Anderson'];
const FRAUD_TYPES = ['Card Not Present', 'Account Takeover', 'Identity Theft', 'Money Laundering', 'Phishing', 'Synthetic Identity', 'Chargeback Fraud', 'Wire Transfer Fraud'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (daysBack = 90) => {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysBack));
  date.setHours(randomInt(0, 23), randomInt(0, 59));
  return date.toISOString();
};

export const generateCustomers = (count = 50) => {
  return Array.from({ length: count }, (_, i) => {
    const firstName = random(FIRST_NAMES);
    const lastName = random(LAST_NAMES);
    const country = random(COUNTRIES);
    return {
      id: `CUST-${String(i + 1).padStart(4, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+91 ${randomInt(70000, 99999)}${randomInt(10000, 99999)}`,
      bankAccount: `XXXX${randomInt(1000, 9999)}`,
      riskLevel: random(['low', 'medium', 'high', 'critical']),
      kycStatus: random(KYC_STATUSES),
      country: country.code,
      countryFlag: country.flag,
      city: random(CITIES),
      totalTransactions: randomInt(5, 200),
      totalSpent: randomInt(10000, 5000000),
      joinedAt: randomDate(365),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${i}`,
    };
  });
};

export const generateTransactions = (customers, count = 100) => {
  return Array.from({ length: count }, (_, i) => {
    const customer = random(customers);
    const country = random(COUNTRIES);
    const riskScore = randomInt(5, 99);
    let status;
    if (riskScore >= 80) status = random(['fraud', 'blocked']);
    else if (riskScore >= 60) status = random(['pending', 'blocked']);
    else if (riskScore >= 40) status = random(['pending', 'approved']);
    else status = 'approved';

    return {
      id: `TXN-${String(i + 1).padStart(6, '0')}`,
      customerId: customer.id,
      customerName: customer.name,
      amount: randomInt(500, 500000),
      currency: 'INR',
      riskScore,
      location: `${random(CITIES)}, ${country.name}`,
      country: country.code,
      countryFlag: country.flag,
      status,
      type: random(['UPI', 'NEFT', 'RTGS', 'IMPS', 'Card', 'Wallet']),
      merchant: random(['Amazon', 'Flipkart', 'Swiggy', 'Uber', 'Paytm', 'PhonePe', 'Zomato', 'Myntra']),
      timestamp: randomDate(30),
      ipAddress: `${randomInt(1, 255)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 255)}`,
      device: random(['Mobile', 'Desktop', 'Tablet']),
    };
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const generateAlerts = (transactions, count = 20) => {
  const fraudTxns = transactions.filter((t) => t.status === 'fraud' || t.status === 'blocked');
  const source = fraudTxns.length >= count ? fraudTxns : transactions;

  return Array.from({ length: count }, (_, i) => {
    const txn = source[i % source.length];
    const severity = txn.riskScore >= 80 ? 'critical' : txn.riskScore >= 60 ? 'high' : txn.riskScore >= 40 ? 'medium' : 'low';
    const statuses = ['open', 'investigating', 'resolved', 'escalated'];

    return {
      id: `ALT-${String(i + 1).padStart(4, '0')}`,
      transactionId: txn.id,
      title: `${random(FRAUD_TYPES)} Detected`,
      description: `Suspicious transaction of ${txn.amount} INR flagged for ${random(FRAUD_TYPES).toLowerCase()}. Risk score: ${txn.riskScore}.`,
      severity,
      status: random(statuses),
      assignedTo: random(ANALYSTS),
      customerName: txn.customerName,
      amount: txn.amount,
      riskScore: txn.riskScore,
      createdAt: txn.timestamp,
      updatedAt: randomDate(7),
      country: txn.country,
      countryFlag: txn.countryFlag,
    };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const generateAnalytics = (transactions) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-IN', { weekday: 'short' });
  });

  const transactionTrend = last7Days.map((day) => ({
    day,
    transactions: randomInt(800, 2500),
    fraud: randomInt(10, 80),
  }));

  const fraudTrend = months.map((month) => ({
    month,
    detected: randomInt(50, 300),
    prevented: randomInt(100, 400),
    falsePositives: randomInt(5, 50),
  }));

  const riskDistribution = [
    { name: 'Low Risk', value: transactions.filter((t) => t.riskScore < 40).length, color: '#16A34A' },
    { name: 'Medium Risk', value: transactions.filter((t) => t.riskScore >= 40 && t.riskScore < 60).length, color: '#F59E0B' },
    { name: 'High Risk', value: transactions.filter((t) => t.riskScore >= 60 && t.riskScore < 80).length, color: '#F97316' },
    { name: 'Critical', value: transactions.filter((t) => t.riskScore >= 80).length, color: '#DC2626' },
  ];

  const accuracyTrend = months.slice(0, 6).map((month) => ({
    month,
    accuracy: randomInt(92, 99),
    precision: randomInt(88, 97),
    recall: randomInt(85, 96),
  }));

  const countryFraud = COUNTRIES.slice(0, 8).map((c) => ({
    country: c.name,
    flag: c.flag,
    fraudCount: randomInt(5, 120),
    totalAmount: randomInt(100000, 5000000),
  }));

  const topCategories = FRAUD_TYPES.map((type) => ({
    category: type,
    count: randomInt(10, 150),
    percentage: randomInt(5, 25),
  })).sort((a, b) => b.count - a.count);

  const monthlyDetection = months.map((month) => ({
    month,
    detected: randomInt(100, 500),
    blocked: randomInt(50, 300),
  }));

  return {
    transactionTrend,
    fraudTrend,
    riskDistribution,
    accuracyTrend,
    countryFraud,
    topCategories,
    monthlyDetection,
  };
};

export const generateDashboardStats = (transactions, alerts) => {
  const total = transactions.length;
  const fraud = transactions.filter((t) => t.status === 'fraud').length;
  const pending = transactions.filter((t) => t.status === 'pending').length;
  const blocked = transactions.filter((t) => t.status === 'blocked').length;

  return {
    totalTransactions: { value: total * 127, change: 12.5, trend: 'up' },
    fraudDetected: { value: fraud + blocked, change: -8.3, trend: 'down' },
    pendingReviews: { value: pending + alerts.filter((a) => a.status === 'open').length, change: 5.2, trend: 'up' },
    detectionAccuracy: { value: 96.8, change: 1.2, trend: 'up' },
  };
};

export const generateActivityFeed = (transactions, alerts) => {
  const activities = [];

  transactions.slice(0, 5).forEach((t) => {
    activities.push({
      id: `act-t-${t.id}`,
      type: t.status === 'fraud' ? 'fraud' : t.status === 'blocked' ? 'blocked' : 'transaction',
      message: `Transaction ${t.id} — ${formatStatusMessage(t)}`,
      time: t.timestamp,
      user: t.customerName,
    });
  });

  alerts.slice(0, 5).forEach((a) => {
    activities.push({
      id: `act-a-${a.id}`,
      type: 'alert',
      message: `${a.title} for ${a.customerName}`,
      time: a.createdAt,
      user: a.assignedTo,
    });
  });

  return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
};

const formatStatusMessage = (t) => {
  const map = { approved: 'approved', blocked: 'blocked', pending: 'pending review', fraud: 'flagged as fraud' };
  return `${map[t.status]} (₹${t.amount.toLocaleString('en-IN')})`;
};

const customers = generateCustomers(50);
const transactions = generateTransactions(customers, 100);
const alerts = generateAlerts(transactions, 20);
const analytics = generateAnalytics(transactions);
const dashboardStats = generateDashboardStats(transactions, alerts);
const activityFeed = generateActivityFeed(transactions, alerts);

export const mockData = {
  customers,
  transactions,
  alerts,
  analytics,
  dashboardStats,
  activityFeed,
};

export default mockData;
