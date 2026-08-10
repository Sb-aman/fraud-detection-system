import Badge, { RiskScoreBadge } from '../common/Badge';
import { formatCurrency, formatDateTime, getRiskLevel } from '../../utils/formatters';
import { MapPin, Monitor, Globe, CreditCard, Store } from 'lucide-react';

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-2.5">
    <div className="p-2 rounded-lg bg-gray-50 dark:bg-slate-700 shrink-0">
      <Icon size={16} className="text-primary" />
    </div>
    <div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-sm font-medium mt-0.5">{value}</p>
    </div>
  </div>
);

const TransactionDetails = ({ transaction }) => {
  if (!transaction) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50">
        <div>
          <p className="font-mono text-sm text-primary font-semibold">{transaction.id}</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(transaction.amount)}</p>
        </div>
        <div className="text-right">
          <Badge status={transaction.status} size="md" />
          <div className="mt-2">
            <RiskScoreBadge score={transaction.riskScore} showBar />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        <DetailRow icon={CreditCard} label="Customer" value={transaction.customerName} />
        <DetailRow icon={Store} label="Merchant" value={transaction.merchant} />
        <DetailRow icon={MapPin} label="Location" value={`${transaction.countryFlag} ${transaction.location}`} />
        <DetailRow icon={Monitor} label="Device" value={transaction.device} />
        <DetailRow icon={Globe} label="IP Address" value={transaction.ipAddress} />
        <DetailRow icon={CreditCard} label="Payment Type" value={transaction.type} />
      </div>

      <div className="p-3 rounded-xl border border-border dark:border-slate-600">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">Risk Level</span>
          <Badge variant={getRiskLevel(transaction.riskScore)} />
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-text-muted mb-1">
            <span>Fraud Probability</span>
            <span>{transaction.riskScore}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                transaction.riskScore >= 80 ? 'bg-red-500' :
                transaction.riskScore >= 60 ? 'bg-orange-500' :
                transaction.riskScore >= 40 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${transaction.riskScore}%` }}
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-text-muted text-center">
        Processed on {formatDateTime(transaction.timestamp)}
      </p>
    </div>
  );
};

export default TransactionDetails;
