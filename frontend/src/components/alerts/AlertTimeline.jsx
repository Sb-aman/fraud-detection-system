import { motion } from 'framer-motion';
import { CheckCircle, Clock, Search, AlertTriangle, ArrowUp } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

const statusIcons = {
  open: { icon: AlertTriangle, color: 'text-danger bg-red-100' },
  investigating: { icon: Search, color: 'text-warning bg-amber-100' },
  resolved: { icon: CheckCircle, color: 'text-success bg-green-100' },
  escalated: { icon: ArrowUp, color: 'text-orange-500 bg-orange-100' },
};

const AlertTimeline = ({ alerts = [] }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-card border border-border/50 dark:border-slate-700/50">
      <h3 className="font-semibold text-text dark:text-slate-100 mb-6">Investigation Timeline</h3>

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border dark:bg-slate-600" />

        <div className="space-y-6">
          {alerts.map((alert, i) => {
            const config = statusIcons[alert.status] || statusIcons.open;
            const Icon = config.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative flex items-start gap-4 pl-12"
              >
                <div className={`absolute left-2.5 w-5 h-5 rounded-full flex items-center justify-center ${config.color} z-10`}>
                  <Icon size={12} />
                </div>

                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-primary">{alert.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 capitalize">
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium mt-1">{alert.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Assigned to {alert.assignedTo} · {formatDateTime(alert.createdAt)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AlertTimeline;
