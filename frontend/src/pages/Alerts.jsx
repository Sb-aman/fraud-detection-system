import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AlertCard from '../components/alerts/AlertCard';
import AlertTimeline from '../components/alerts/AlertTimeline';
import Loader from '../components/common/Loader';
import { alertsAPI } from '../services/api';

const SEVERITY_FILTERS = ['all', 'critical', 'high', 'medium', 'low'];
const STATUS_FILTERS = ['all', 'open', 'investigating', 'resolved', 'escalated'];

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severity, setSeverity] = useState('all');
  const [status, setStatus] = useState('all');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const { data } = await alertsAPI.getAll({ severity, status });
      setAlerts(data);
    } catch {
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, [severity, status]);

  const handleResolve = async (id) => {
    try {
      await alertsAPI.resolve(id);
      toast.success('Alert resolved successfully');
      fetchAlerts();
    } catch {
      toast.error('Failed to resolve alert');
    }
  };

  const severityCounts = {
    critical: alerts.filter((a) => a.severity === 'critical').length,
    high: alerts.filter((a) => a.severity === 'high').length,
    medium: alerts.filter((a) => a.severity === 'medium').length,
    low: alerts.filter((a) => a.severity === 'low').length,
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-text dark:text-slate-100">Fraud Alerts</h1>
        <p className="text-sm text-text-muted mt-1">Monitor and investigate fraud alerts in real-time</p>
      </motion.div>

      {/* Severity Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'critical', label: 'Critical', color: 'border-red-500 bg-red-50 text-red-700' },
          { key: 'high', label: 'High', color: 'border-orange-500 bg-orange-50 text-orange-700' },
          { key: 'medium', label: 'Medium', color: 'border-amber-500 bg-amber-50 text-amber-700' },
          { key: 'low', label: 'Low', color: 'border-green-500 bg-green-50 text-green-700' },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setSeverity(severity === s.key ? 'all' : s.key)}
            className={`p-4 rounded-xl border-l-4 ${s.color} text-left transition-all hover:shadow-card ${
              severity === s.key ? 'ring-2 ring-primary/30' : ''
            }`}
          >
            <p className="text-2xl font-bold">{severityCounts[s.key]}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              status === s
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-text-muted hover:bg-gray-200'
            }`}
          >
            {s === 'all' ? 'All Status' : s}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader text="Loading alerts..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold">Active Alerts ({alerts.length})</h3>
            {alerts.length === 0 ? (
              <div className="text-center py-12 text-text-muted">
                <p>No alerts found matching your filters</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} onResolve={handleResolve} />
              ))
            )}
          </div>
          <AlertTimeline alerts={alerts.slice(0, 8)} />
        </div>
      )}
    </div>
  );
};

export default Alerts;
