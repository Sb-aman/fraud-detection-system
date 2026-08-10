import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import CustomerCard from '../components/customers/CustomerCard';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import { customersAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import useDebounce from '../hooks/useDebounce';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const { data } = await customersAPI.getAll({ search: debouncedSearch, riskLevel: riskFilter });
        setCustomers(data);
      } catch {
        toast.error('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [debouncedSearch, riskFilter]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-text dark:text-slate-100">Customers</h1>
        <p className="text-sm text-text-muted mt-1">Manage customer profiles and risk assessments</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'low', 'medium', 'high', 'critical'].map((level) => (
            <button
              key={level}
              onClick={() => setRiskFilter(level)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-colors ${
                riskFilter === level
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-slate-800 border border-border dark:border-slate-600 text-text-muted hover:bg-gray-50'
              }`}
            >
              {level === 'all' ? 'All' : level}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader text="Loading customers..." />
      ) : customers.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg">No customers found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer, i) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <CustomerCard
                customer={customer}
                onViewProfile={setSelectedCustomer}
              />
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title="Customer Profile"
        size="md"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img src={selectedCustomer.avatar} alt="" className="w-16 h-16 rounded-xl" />
              <div>
                <h3 className="font-semibold text-lg">{selectedCustomer.name}</h3>
                <p className="text-sm text-text-muted">{selectedCustomer.email}</p>
                <p className="text-sm text-text-muted">{selectedCustomer.phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-700">
                <p className="text-text-muted text-xs">Bank Account</p>
                <p className="font-medium mt-1">{selectedCustomer.bankAccount}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-700">
                <p className="text-text-muted text-xs">Risk Level</p>
                <div className="mt-1"><Badge variant={selectedCustomer.riskLevel} /></div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-700">
                <p className="text-text-muted text-xs">KYC Status</p>
                <p className="font-medium mt-1 capitalize">{selectedCustomer.kycStatus.replace('_', ' ')}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-700">
                <p className="text-text-muted text-xs">Total Spent</p>
                <p className="font-medium mt-1">{formatCurrency(selectedCustomer.totalSpent)}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-700">
                <p className="text-text-muted text-xs">Location</p>
                <p className="font-medium mt-1">{selectedCustomer.countryFlag} {selectedCustomer.city}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-700">
                <p className="text-text-muted text-xs">Member Since</p>
                <p className="font-medium mt-1">{formatDate(selectedCustomer.joinedAt)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Customers;
