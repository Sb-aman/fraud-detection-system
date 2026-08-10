import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const RiskPieChart = ({ data = [] }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-elevated border border-border text-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-text-muted">{payload[0].value} transactions</p>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-card border border-border/50 dark:border-slate-700/50">
      <h3 className="font-semibold text-text dark:text-slate-100 mb-4">Risk Distribution</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => <span className="text-xs text-text-muted">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskPieChart;
