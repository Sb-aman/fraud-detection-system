import { motion } from 'framer-motion';
import { AlertTriangle, Ban, CheckCircle, Bell, ArrowLeftRight } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

const iconMap = {
  fraud: { icon: AlertTriangle, color: 'text-danger bg-red-50' },
  blocked: { icon: Ban, color: 'text-orange-500 bg-orange-50' },
  transaction: { icon: ArrowLeftRight, color: 'text-primary bg-blue-50' },
  alert: { icon: Bell, color: 'text-warning bg-amber-50' },
  approved: { icon: CheckCircle, color: 'text-success bg-green-50' },
};

const ActivityFeed = ({ activities = [] }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-card border border-border/50 dark:border-slate-700/50">
      <h3 className="font-semibold text-text dark:text-slate-100 mb-4">Recent Activity</h3>
      <div className="space-y-3 max-h-[360px] overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">No recent activity</p>
        ) : (
          activities.map((activity, i) => {
            const config = iconMap[activity.type] || iconMap.transaction;
            const Icon = config.icon;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <div className={`p-2 rounded-lg shrink-0 ${config.color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text dark:text-slate-200 leading-snug">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-text-muted">{activity.user}</span>
                    <span className="text-xs text-text-muted">·</span>
                    <span className="text-xs text-text-muted">{formatRelativeTime(activity.time)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
