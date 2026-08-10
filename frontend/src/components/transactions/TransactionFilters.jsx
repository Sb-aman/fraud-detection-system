import { Search, Filter, Download } from 'lucide-react';
import { COUNTRIES, STATUS_CONFIG } from '../../utils/constants';
import Button from '../common/Button';

const TransactionFilters = ({ filters, onChange, onExport }) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-card border border-border/50 dark:border-slate-700/50">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={18} className="text-primary" />
        <h3 className="font-semibold text-sm">Filters</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <div className="relative xl:col-span-2">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-border dark:border-slate-600 bg-background dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <select
          value={filters.status || 'all'}
          onChange={(e) => handleChange('status', e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-border dark:border-slate-600 bg-background dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Status</option>
          {Object.entries(STATUS_CONFIG).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>

        <select
          value={filters.country || 'all'}
          onChange={(e) => handleChange('country', e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-border dark:border-slate-600 bg-background dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Countries</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Risk Score"
          value={filters.riskMin || ''}
          onChange={(e) => handleChange('riskMin', e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-border dark:border-slate-600 bg-background dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
          min="0"
          max="100"
        />

        <input
          type="number"
          placeholder="Max Risk Score"
          value={filters.riskMax || ''}
          onChange={(e) => handleChange('riskMax', e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-border dark:border-slate-600 bg-background dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
          min="0"
          max="100"
        />
      </div>

      <div className="flex justify-end mt-3">
        <Button variant="outline" size="sm" icon={Download} onClick={onExport}>
          Export CSV
        </Button>
      </div>
    </div>
  );
};

export default TransactionFilters;
