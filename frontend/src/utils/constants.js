export const COLORS = {
  primary: '#1E3A8A',
  secondary: '#2563EB',
  success: '#16A34A',
  danger: '#DC2626',
  warning: '#F59E0B',
  background: '#F8FAFC',
};

export const STATUS_CONFIG = {
  approved: { label: 'Approved', color: 'success', bg: 'bg-green-50 text-green-700 border-green-200' },
  blocked: { label: 'Blocked', color: 'danger', bg: 'bg-red-50 text-red-700 border-red-200' },
  pending: { label: 'Pending', color: 'warning', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  fraud: { label: 'Fraud', color: 'danger', bg: 'bg-red-100 text-red-800 border-red-300' },
};

export const RISK_LEVELS = {
  critical: { label: 'Critical', color: 'bg-red-600 text-white', min: 80 },
  high: { label: 'High', color: 'bg-orange-500 text-white', min: 60 },
  medium: { label: 'Medium', color: 'bg-amber-500 text-white', min: 40 },
  low: { label: 'Low', color: 'bg-green-500 text-white', min: 0 },
};

export const ALERT_SEVERITY = {
  critical: { label: 'Critical', color: 'border-l-red-600 bg-red-50' },
  high: { label: 'High', color: 'border-l-orange-500 bg-orange-50' },
  medium: { label: 'Medium', color: 'border-l-amber-500 bg-amber-50' },
  low: { label: 'Low', color: 'border-l-green-500 bg-green-50' },
};

export const COUNTRIES = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
];

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/transactions', label: 'Transactions', icon: 'ArrowLeftRight' },
  { path: '/alerts', label: 'Fraud Alerts', icon: 'ShieldAlert' },
  { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
  { path: '/customers', label: 'Customers', icon: 'Users' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
];

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
