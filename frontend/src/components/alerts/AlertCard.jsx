import { motion } from 'framer-motion';
import { AlertTriangle, Clock, User, CheckCircle } from 'lucide-react';
import Badge, { RiskScoreBadge } from '../common/Badge';
import Button from '../common/Button';
import { ALERT_SEVERITY } from '../../utils/constants';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';

const AlertCard = ({ alert, onResolve }) => {
  const severity = ALERT_SEVERITY[alert.severity] || ALERT_SEVERITY.medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-l-4 p-4 bg-white dark:bg-slate-800 shadow-card border border-border/50 dark:border-slate-700/50 ${severity.color}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-700 shrink-0">
            <AlertTriangle size={20} className={
              alert.severity === 'critical' ? 'text-red-600' :
              alert.severity === 'high' ? 'text-orange-500' :
              alert.severity === 'medium' ? 'text-amber-500' : 'text-green-600'
            } />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-sm">{alert.title}</h4>
              <Badge variant={alert.severity} label={alert.severity} size="xs" />
            </div>
            <p className="text-xs text-text-muted mt-1 line-clamp-2">{alert.description}</p>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <User size={12} /> {alert.assignedTo}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {formatRelativeTime(alert.createdAt)}
              </span>
              <span>{alert.countryFlag} {alert.customerName}</span>
              <span className="font-medium">{formatCurrency(alert.amount)}</span>
              <RiskScoreBadge score={alert.riskScore} />
            </div>
          </div>
        </div>

        {alert.status !== 'resolved' && (
          <Button
            variant="success"
            size="sm"
            icon={CheckCircle}
            onClick={() => onResolve?.(alert.id)}
          >
            Resolve
          </Button>
        )}
        {alert.status === 'resolved' && (
          <span className="text-xs font-medium text-success flex items-center gap-1 shrink-0">
            <CheckCircle size={14} /> Resolved
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default AlertCard;
