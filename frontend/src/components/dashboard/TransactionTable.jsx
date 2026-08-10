import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Badge, { RiskScoreBadge } from '../common/Badge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import Modal from '../common/Modal';
import TransactionDetails from '../transactions/TransactionDetails';

const TransactionTable = ({ transactions = [], showPagination = true, pageSize = 8 }) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const filtered = transactions.filter(
    (t) =>
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = showPagination
    ? sorted.slice((page - 1) * pageSize, page * pageSize)
    : sorted;

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const columns = [
    { key: 'id', label: 'Transaction ID' },
    { key: 'customerName', label: 'Customer' },
    { key: 'amount', label: 'Amount' },
    { key: 'riskScore', label: 'Risk Score' },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status' },
    { key: 'timestamp', label: 'Time' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-card border border-border/50 dark:border-slate-700/50 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-border dark:border-slate-700">
        <h3 className="font-semibold text-text dark:text-slate-100">Recent Transactions</h3>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-border dark:border-slate-600 bg-background dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-700/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider cursor-pointer hover:text-primary transition-colors whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown size={12} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-slate-700">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-text-muted">
                  No transactions found
                </td>
              </tr>
            ) : (
              paginated.map((txn, i) => (
                <motion.tr
                  key={txn.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-primary font-medium whitespace-nowrap">{txn.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{txn.customerName}</td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{formatCurrency(txn.amount)}</td>
                  <td className="px-4 py-3"><RiskScoreBadge score={txn.riskScore} showBar /></td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="mr-1">{txn.countryFlag}</span>
                    {txn.location}
                  </td>
                  <td className="px-4 py-3"><Badge status={txn.status} /></td>
                  <td className="px-4 py-3 text-text-muted whitespace-nowrap text-xs">{formatDateTime(txn.timestamp)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedTxn(txn)}
                      className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border dark:border-slate-700">
          <p className="text-xs text-text-muted">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                  page === p ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        title="Transaction Details"
        size="lg"
      >
        {selectedTxn && <TransactionDetails transaction={selectedTxn} />}
      </Modal>
    </div>
  );
};

export default TransactionTable;
