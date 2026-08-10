import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, change, trend, icon: Icon, color = 'primary', delay = 0 }) => {
  const colorMap = {
    primary: 'bg-blue-50 text-primary dark:bg-blue-900/30',
    success: 'bg-green-50 text-success dark:bg-green-900/30',
    danger: 'bg-red-50 text-danger dark:bg-red-900/30',
    warning: 'bg-amber-50 text-warning dark:bg-amber-900/30',
  };

  const isPositive = trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-card card-hover border border-border/50 dark:border-slate-700/50"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-muted font-medium">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-bold mt-1 text-text dark:text-slate-100">
            {typeof value === 'number' && value > 1000
              ? value.toLocaleString('en-IN')
              : value}
            {title === 'Detection Accuracy' && '%'}
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            {isPositive ? (
              <TrendingUp size={14} className="text-success" />
            ) : (
              <TrendingDown size={14} className="text-danger" />
            )}
            <span className={`text-xs font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-xs text-text-muted">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
