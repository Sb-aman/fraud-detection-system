import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-elevated border border-border text-sm">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="text-xs">
          {entry.name}: {entry.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export const FraudTrendChart = ({ data = [], type = 'area' }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-card border border-border/50 dark:border-slate-700/50">
      <h3 className="font-semibold text-text dark:text-slate-100 mb-4">
        {type === 'area' ? 'Transactions Over Time' : type === 'bar' ? 'Daily Fraud Detection' : 'Accuracy Trend'}
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        {type === 'area' ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTxn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="transactions" stroke="#2563EB" fill="url(#colorTxn)" strokeWidth={2} name="Transactions" />
            <Area type="monotone" dataKey="fraud" stroke="#DC2626" fill="url(#colorFraud)" strokeWidth={2} name="Fraud" />
          </AreaChart>
        ) : type === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="detected" fill="#DC2626" radius={[4, 4, 0, 0]} name="Detected" />
            <Bar dataKey="prevented" fill="#16A34A" radius={[4, 4, 0, 0]} name="Prevented" />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="accuracy" stroke="#2563EB" strokeWidth={2} dot={{ r: 4 }} name="Accuracy %" />
            <Line type="monotone" dataKey="precision" stroke="#16A34A" strokeWidth={2} dot={{ r: 4 }} name="Precision %" />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default FraudTrendChart;
