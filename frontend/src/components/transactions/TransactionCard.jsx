import { motion } from 'framer-motion';
import Badge, { RiskScoreBadge } from '../common/Badge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Eye } from 'lucide-react';

const TransactionCard = ({ transaction, onView }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-card border border-border/50 dark:border-slate-700/50 card-hover"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono text-xs text-primary font-medium">{transaction.id}</p>
          <p className="text-sm font-medium mt-1">{transaction.customerName}</p>
        </div>
        <Badge status={transaction.status} />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold">{formatCurrency(transaction.amount)}</p>
          <p className="text-xs text-text-muted mt-0.5">
            {transaction.countryFlag} {transaction.location}
          </p>
        </div>
        <div className="text-right">
          <RiskScoreBadge score={transaction.riskScore} showBar />
          <p className="text-[10px] text-text-muted mt-1">{formatDateTime(transaction.timestamp)}</p>
        </div>
      </div>
      <button
        onClick={() => onView?.(transaction)}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
      >
        <Eye size={14} /> View Details
      </button>
    </motion.div>
  );
};

export default TransactionCard;
