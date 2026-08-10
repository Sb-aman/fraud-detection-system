import { motion } from 'framer-motion';

const RiskGauge = ({ value = 75, label = 'Overall Risk Score' }) => {
  const radius = 80;
  const circumference = Math.PI * radius;
  const progress = (value / 100) * circumference;

  const getColor = () => {
    if (value >= 80) return '#DC2626';
    if (value >= 60) return '#F97316';
    if (value >= 40) return '#F59E0B';
    return '#16A34A';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-card border border-border/50 dark:border-slate-700/50 flex flex-col items-center">
      <h3 className="font-semibold text-text dark:text-slate-100 mb-4 self-start">{label}</h3>
      <div className="relative">
        <svg width="200" height="120" viewBox="0 0 200 120">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={getColor()}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold"
            style={{ color: getColor() }}
          >
            {value}
          </motion.span>
          <span className="text-xs text-text-muted">/ 100</span>
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;
