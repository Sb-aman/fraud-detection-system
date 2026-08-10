import { STATUS_CONFIG, RISK_LEVELS } from '../../utils/constants';

const Badge = ({ status, label, variant, size = 'sm', className = '' }) => {
  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  if (status && STATUS_CONFIG[status]) {
    const config = STATUS_CONFIG[status];
    return (
      <span
        className={`
          inline-flex items-center rounded-full border font-medium capitalize
          ${config.bg} ${sizes[size]} ${className}
        `}
      >
        {config.label}
      </span>
    );
  }

  if (variant && RISK_LEVELS[variant]) {
    const config = RISK_LEVELS[variant];
    return (
      <span
        className={`
          inline-flex items-center rounded-full font-medium capitalize
          ${config.color} ${sizes[size]} ${className}
        `}
      >
        {label || config.label}
      </span>
    );
  }

  return (
    <span
      className={`
        inline-flex items-center rounded-full bg-gray-100 text-gray-700
        font-medium ${sizes[size]} ${className}
      `}
    >
      {label}
    </span>
  );
};

export const RiskScoreBadge = ({ score, showBar = false }) => {
  const getColor = () => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getTextColor = () => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-green-600';
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm font-semibold ${getTextColor()}`}>{score}</span>
      {showBar && (
        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${getColor()}`}
            style={{ width: `${score}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default Badge;
