import { motion } from 'framer-motion';
import { User, CreditCard, Shield, FileCheck } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatters';

const kycColors = {
  verified: 'text-success',
  pending: 'text-warning',
  rejected: 'text-danger',
  under_review: 'text-primary',
};

const CustomerCard = ({ customer, onViewProfile }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-card border border-border/50 dark:border-slate-700/50 card-hover"
    >
      <div className="flex items-start gap-4">
        <img
          src={customer.avatar}
          alt={customer.name}
          className="w-12 h-12 rounded-xl bg-primary/10 object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">{customer.name}</h4>
          <p className="text-xs text-text-muted truncate">{customer.email}</p>
        </div>
        <Badge variant={customer.riskLevel} label={customer.riskLevel} size="xs" />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="flex items-center gap-2 text-xs">
          <CreditCard size={14} className="text-text-muted shrink-0" />
          <span className="truncate">{customer.bankAccount}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Shield size={14} className="text-text-muted shrink-0" />
          <span className={`capitalize font-medium ${kycColors[customer.kycStatus]}`}>
            KYC: {customer.kycStatus.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <User size={14} className="text-text-muted shrink-0" />
          <span>{customer.totalTransactions} txns</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <FileCheck size={14} className="text-text-muted shrink-0" />
          <span>{formatCurrency(customer.totalSpent)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border dark:border-slate-700">
        <span className="text-xs text-text-muted">
          {customer.countryFlag} {customer.city}
        </span>
        <Button variant="outline" size="sm" onClick={() => onViewProfile?.(customer)}>
          View Profile
        </Button>
      </div>
    </motion.div>
  );
};

export default CustomerCard;
