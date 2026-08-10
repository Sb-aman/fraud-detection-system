import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Moon, Shield, Key, Palette, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useTheme } from '../hooks/useTheme';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Settings = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useLocalStorage('notifications', {
    email: true,
    push: true,
    sms: false,
    fraudAlerts: true,
    weeklyReport: true,
  });
  const [security, setSecurity] = useLocalStorage('security', {
    twoFactor: false,
    sessionTimeout: '30',
    ipWhitelist: false,
  });
  const [apiConfig, setApiConfig] = useState({
    baseUrl: 'http://localhost:3001/api',
    apiKey: '••••••••••••••••',
    webhookUrl: '',
  });
  const [theme, setTheme] = useLocalStorage('theme', {
    primaryColor: '#1E3A8A',
    compactMode: false,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-300 dark:bg-slate-600'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`}
      />
    </button>
  );

  const SettingSection = ({ icon: Icon, title, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-card border border-border/50 dark:border-slate-700/50"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon size={20} className="text-primary" />
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      {children}
    </motion.div>
  );

  const SettingRow = ({ label, description, children }) => (
    <div className="flex items-center justify-between py-3 border-b border-border/50 dark:border-slate-700/50 last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-text dark:text-slate-100">Settings</h1>
        <p className="text-sm text-text-muted mt-1">Manage your account and system preferences</p>
      </motion.div>

      <SettingSection icon={Bell} title="Notification Settings">
        <SettingRow label="Email Notifications" description="Receive alerts via email">
          <Toggle checked={notifications.email} onChange={(v) => setNotifications({ ...notifications, email: v })} />
        </SettingRow>
        <SettingRow label="Push Notifications" description="Browser push notifications">
          <Toggle checked={notifications.push} onChange={(v) => setNotifications({ ...notifications, push: v })} />
        </SettingRow>
        <SettingRow label="SMS Alerts" description="Critical fraud alerts via SMS">
          <Toggle checked={notifications.sms} onChange={(v) => setNotifications({ ...notifications, sms: v })} />
        </SettingRow>
        <SettingRow label="Fraud Alert Notifications" description="Real-time fraud detection alerts">
          <Toggle checked={notifications.fraudAlerts} onChange={(v) => setNotifications({ ...notifications, fraudAlerts: v })} />
        </SettingRow>
        <SettingRow label="Weekly Report" description="Automated weekly fraud summary">
          <Toggle checked={notifications.weeklyReport} onChange={(v) => setNotifications({ ...notifications, weeklyReport: v })} />
        </SettingRow>
      </SettingSection>

      <SettingSection icon={Moon} title="Appearance">
        <SettingRow label="Dark Mode" description="Toggle dark theme">
          <Toggle checked={darkMode} onChange={toggleDarkMode} />
        </SettingRow>
        <SettingRow label="Compact Mode" description="Reduce spacing for dense layouts">
          <Toggle checked={theme.compactMode} onChange={(v) => setTheme({ ...theme, compactMode: v })} />
        </SettingRow>
      </SettingSection>

      <SettingSection icon={Shield} title="Security Settings">
        <SettingRow label="Two-Factor Authentication" description="Add an extra layer of security">
          <Toggle checked={security.twoFactor} onChange={(v) => setSecurity({ ...security, twoFactor: v })} />
        </SettingRow>
        <SettingRow label="IP Whitelist" description="Restrict access to specific IP addresses">
          <Toggle checked={security.ipWhitelist} onChange={(v) => setSecurity({ ...security, ipWhitelist: v })} />
        </SettingRow>
        <SettingRow label="Session Timeout" description="Auto logout after inactivity">
          <select
            value={security.sessionTimeout}
            onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
            className="px-3 py-1.5 text-sm rounded-lg border border-border dark:border-slate-600 bg-background dark:bg-slate-700"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
          </select>
        </SettingRow>
      </SettingSection>

      <SettingSection icon={Key} title="API Configuration">
        <div className="space-y-4">
          <Input
            label="Base URL"
            value={apiConfig.baseUrl}
            onChange={(e) => setApiConfig({ ...apiConfig, baseUrl: e.target.value })}
          />
          <Input
            label="API Key"
            type="password"
            value={apiConfig.apiKey}
            onChange={(e) => setApiConfig({ ...apiConfig, apiKey: e.target.value })}
          />
          <Input
            label="Webhook URL"
            placeholder="https://your-server.com/webhook"
            value={apiConfig.webhookUrl}
            onChange={(e) => setApiConfig({ ...apiConfig, webhookUrl: e.target.value })}
          />
        </div>
      </SettingSection>

      <SettingSection icon={Palette} title="Theme">
        <SettingRow label="Primary Color">
          <input
            type="color"
            value={theme.primaryColor}
            onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
            className="w-10 h-10 rounded-lg cursor-pointer border-0"
          />
        </SettingRow>
      </SettingSection>

      <div className="flex justify-end">
        <Button icon={Save} onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
};

export default Settings;
