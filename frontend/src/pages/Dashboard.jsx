import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeftRight, ShieldAlert, Clock, Target,
  Download, Plus, FileText, Bell,
} from 'lucide-react';
import toast from 'react-hot-toast';
import StatsCard from '../components/dashboard/StatsCard';
import TransactionTable from '../components/dashboard/TransactionTable';
import FraudTrendChart from '../components/dashboard/FraudTrendChart';
import RiskPieChart from '../components/dashboard/RiskPieChart';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import AlertCard from '../components/alerts/AlertCard';
import Loader, { SkeletonCard } from '../components/common/Loader';
import Button from '../components/common/Button';
import { dashboardAPI, transactionsAPI, alertsAPI, analyticsAPI } from '../services/api';
import { formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

const quickActions = [
  { label: 'New Report', icon: FileText, color: 'primary' },
  { label: 'Review Alerts', icon: Bell, color: 'danger' },
  { label: 'Add Rule', icon: Plus, color: 'success' },
  { label: 'Export Data', icon: Download, color: 'warning' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [activity, setActivity] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, txnRes, activityRes, analyticsRes, alertsRes] = await Promise.all([
          dashboardAPI.getStats(),
          transactionsAPI.getAll({ limit: 10 }),
          dashboardAPI.getActivityFeed(),
          analyticsAPI.getAll(),
          alertsAPI.getAll(),
        ]);
        setStats(statsRes.data);
        setTransactions(txnRes.data);
        setActivity(activityRes.data);
        setAnalytics(analyticsRes.data);
        setRecentAlerts(alertsRes.data.slice(0, 3));
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <Loader text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-text dark:text-slate-100">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-text-muted mt-1">{formatDate(new Date())} · Fraud Detection Overview</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              icon={action.icon}
              onClick={() => toast.success(`${action.label} initiated`)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Transactions"
          value={stats.totalTransactions.value}
          change={stats.totalTransactions.change}
          trend={stats.totalTransactions.trend}
          icon={ArrowLeftRight}
          color="primary"
          delay={0}
        />
        <StatsCard
          title="Fraud Detected"
          value={stats.fraudDetected.value}
          change={stats.fraudDetected.change}
          trend={stats.fraudDetected.trend}
          icon={ShieldAlert}
          color="danger"
          delay={0.1}
        />
        <StatsCard
          title="Pending Reviews"
          value={stats.pendingReviews.value}
          change={stats.pendingReviews.change}
          trend={stats.pendingReviews.trend}
          icon={Clock}
          color="warning"
          delay={0.2}
        />
        <StatsCard
          title="Detection Accuracy"
          value={stats.detectionAccuracy.value}
          change={stats.detectionAccuracy.change}
          trend={stats.detectionAccuracy.trend}
          icon={Target}
          color="success"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <FraudTrendChart data={analytics?.transactionTrend} type="area" />
        </div>
        <RiskPieChart data={analytics?.riskDistribution} />
      </div>

      {/* Table + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <TransactionTable transactions={transactions} pageSize={6} />
        </div>
        <ActivityFeed activities={activity} />
      </div>

      {/* Recent Alerts + Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-text dark:text-slate-100">Recent Alerts</h3>
          {recentAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
        <FraudTrendChart data={analytics?.fraudTrend} type="bar" />
      </div>
    </div>
  );
};

export default Dashboard;
