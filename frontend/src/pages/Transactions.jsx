import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/dashboard/TransactionTable';
import Loader from '../components/common/Loader';
import { transactionsAPI } from '../services/api';
import useDebounce from '../hooks/useDebounce';

const Transactions = () => {
  const [searchParams] = useSearchParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: 'all',
    country: 'all',
    riskMin: '',
    riskMax: '',
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const { data } = await transactionsAPI.getAll({
          ...filters,
          search: debouncedSearch,
          limit: 100,
        });
        setTransactions(data);
      } catch {
        toast.error('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [debouncedSearch, filters.status, filters.country, filters.riskMin, filters.riskMax]);

  const handleExport = () => {
    const headers = ['ID', 'Customer', 'Amount', 'Risk Score', 'Status', 'Location', 'Time'];
    const rows = transactions.map((t) =>
      [t.id, t.customerName, t.amount, t.riskScore, t.status, t.location, t.timestamp].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    toast.success('Transactions exported successfully');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-text dark:text-slate-100">Transactions</h1>
        <p className="text-sm text-text-muted mt-1">Monitor and manage all transaction activities</p>
      </motion.div>

      <TransactionFilters filters={filters} onChange={setFilters} onExport={handleExport} />

      {loading ? (
        <Loader text="Loading transactions..." />
      ) : (
        <TransactionTable transactions={transactions} pageSize={12} />
      )}
    </div>
  );
};

export default Transactions;
