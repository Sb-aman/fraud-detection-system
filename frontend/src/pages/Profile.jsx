import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mail, Phone, Shield, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    updateUser(form);
    toast.success('Profile updated successfully');
    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwords.new.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }
    toast.success('Password changed successfully');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-text dark:text-slate-100">Profile</h1>
        <p className="text-sm text-text-muted mt-1">Manage your personal information</p>
      </motion.div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-card border border-border/50 dark:border-slate-700/50"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-24 h-24 rounded-2xl object-cover bg-primary/10"
            />
            <button className="absolute -bottom-2 -right-2 p-2 rounded-full bg-primary text-white shadow-lg hover:bg-primary-light transition-colors">
              <Camera size={14} />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-sm text-text-muted mt-1">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
              <Shield size={14} className="text-primary" />
              <span className="text-sm font-medium text-primary">{user?.role}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleProfileUpdate}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-card border border-border/50 dark:border-slate-700/50 space-y-4"
      >
        <h3 className="font-semibold">Personal Information</h3>
        <Input
          label="Full Name"
          icon={Mail}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Phone Number"
          icon={Phone}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <div className="flex justify-end">
          <Button type="submit" loading={loading}>Update Profile</Button>
        </div>
      </motion.form>

      {/* Change Password */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handlePasswordChange}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-card border border-border/50 dark:border-slate-700/50 space-y-4"
      >
        <h3 className="font-semibold flex items-center gap-2">
          <Lock size={18} /> Change Password
        </h3>
        <Input
          label="Current Password"
          type="password"
          value={passwords.current}
          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
        />
        <Input
          label="New Password"
          type="password"
          value={passwords.new}
          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
        />
        <Input
          label="Confirm New Password"
          type="password"
          value={passwords.confirm}
          onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
        />
        <div className="flex justify-end">
          <Button type="submit" variant="outline">Change Password</Button>
        </div>
      </motion.form>
    </div>
  );
};

export default Profile;
