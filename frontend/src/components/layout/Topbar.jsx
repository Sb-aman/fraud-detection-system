import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  MessageSquare,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { formatRelativeTime } from '../../utils/formatters';

const NOTIFICATIONS = [
  { id: 1, title: 'Critical Fraud Alert', message: 'Suspicious wire transfer detected', time: new Date(Date.now() - 300000).toISOString(), unread: true },
  { id: 2, title: 'Transaction Blocked', message: 'TXN-000042 blocked due to high risk', time: new Date(Date.now() - 900000).toISOString(), unread: true },
  { id: 3, title: 'KYC Review Required', message: 'Customer CUST-0012 needs verification', time: new Date(Date.now() - 3600000).toISOString(), unread: false },
  { id: 4, title: 'Daily Report Ready', message: 'Fraud detection report is available', time: new Date(Date.now() - 7200000).toISOString(), unread: false },
];

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/transactions?search=${encodeURIComponent(searchQuery)}`);
  };

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-border dark:border-slate-700 shadow-soft">
      <div className="flex items-center gap-4 px-4 lg:px-6 h-16">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu size={22} />
        </button>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search transactions, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background dark:bg-slate-800 dark:border-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </form>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-text-muted" />}
          </button>

          <button className="hidden sm:flex p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <MessageSquare size={20} className="text-text-muted" />
          </button>

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell size={20} className="text-text-muted" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-elevated border border-border dark:border-slate-700 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-border dark:border-slate-700">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {NOTIFICATIONS.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-border/50 dark:border-slate-700/50 ${n.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          {n.unread && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                          <div className={n.unread ? '' : 'ml-4'}>
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-text-muted mt-0.5">{n.message}</p>
                            <p className="text-[10px] text-text-muted mt-1">{formatRelativeTime(n.time)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="flex items-center gap-2 p-1.5 pl-1.5 pr-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-lg object-cover bg-primary/10"
              />
              <span className="hidden md:block text-sm font-medium">{user?.name?.split(' ')[0]}</span>
              <ChevronDown size={16} className="hidden md:block text-text-muted" />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-elevated border border-border dark:border-slate-700 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-border dark:border-slate-700">
                    <p className="font-semibold text-sm">{user?.name}</p>
                    <p className="text-xs text-text-muted">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { navigate('/profile'); setShowProfile(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700/50"
                    >
                      <User size={16} /> Profile
                    </button>
                    <button
                      onClick={() => { navigate('/settings'); setShowProfile(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700/50"
                    >
                      <Settings size={16} /> Settings
                    </button>
                    <button
                      onClick={() => { logout(); navigate('/login'); }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-danger hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
