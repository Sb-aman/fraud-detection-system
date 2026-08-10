import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const LocationMap = ({ data = [] }) => {
  const maxFraud = Math.max(...data.map((d) => d.fraudCount), 1);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-card border border-border/50 dark:border-slate-700/50">
      <div className="flex items-center gap-2 mb-4">
        <Globe size={18} className="text-primary" />
        <h3 className="font-semibold text-text dark:text-slate-100">Country-wise Fraud</h3>
      </div>

      <div className="space-y-3">
        {data.map((item, i) => (
          <motion.div
            key={item.country}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3"
          >
            <span className="text-lg w-8 text-center">{item.flag}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{item.country}</span>
                <span className="text-xs text-text-muted">{item.fraudCount} cases</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.fraudCount / maxFraud) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
              <p className="text-[10px] text-text-muted mt-0.5">
                Total loss: {formatCurrency(item.totalAmount)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LocationMap;
