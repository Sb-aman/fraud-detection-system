import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast from 'react-hot-toast';
import FraudTrendChart from '../components/dashboard/FraudTrendChart';
import RiskPieChart from '../components/dashboard/RiskPieChart';
import RiskGauge from '../components/analytics/RiskGauge';
import LocationMap from '../components/analytics/LocationMap';
import Loader from '../components/common/Loader';
import { analyticsAPI } from '../services/api';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: analyticsData } = await analyticsAPI.getAll();
        setData(analyticsData);
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Loader text="Loading analytics..." />;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-text dark:text-slate-100">Analytics</h1>
        <p className="text-sm text-text-muted mt-1">Deep insights into fraud patterns and detection performance</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RiskGauge value={68} label="Overall Risk Score" />
        <div className="md:col-span-2">
          <FraudTrendChart data={data?.fraudTrend} type="bar" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FraudTrendChart data={data?.accuracyTrend} type="line" />
        <RiskPieChart data={data?.riskDistribution} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LocationMap data={data?.countryFraud} />

        {/* Monthly Detection */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-card border border-border/50 dark:border-slate-700/50">
          <h3 className="font-semibold text-text dark:text-slate-100 mb-4">Monthly Detection</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data?.monthlyDetection}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="detected" fill="#DC2626" radius={[4, 4, 0, 0]} name="Detected" />
              <Bar dataKey="blocked" fill="#1E3A8A" radius={[4, 4, 0, 0]} name="Blocked" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Risk Categories */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-card border border-border/50 dark:border-slate-700/50">
        <h3 className="font-semibold text-text dark:text-slate-100 mb-4">Top Risk Categories</h3>
        <div className="space-y-3">
          {data?.topCategories?.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4"
            >
              <span className="text-sm font-medium w-40 truncate">{cat.category}</span>
              <div className="flex-1 h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.percentage * 4}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                  className="h-full rounded-full bg-gradient-to-r from-danger to-warning"
                />
              </div>
              <span className="text-sm font-semibold w-16 text-right">{cat.count}</span>
              <span className="text-xs text-text-muted w-12">{cat.percentage}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
