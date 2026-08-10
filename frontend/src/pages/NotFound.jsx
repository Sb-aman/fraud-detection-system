import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Shield } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-6">
          <Shield className="text-white" size={40} />
        </div>
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="text-xl font-semibold mt-4 text-text dark:text-slate-100">Page Not Found</h2>
        <p className="text-text-muted mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Button icon={Home} onClick={() => navigate('/dashboard')} size="lg">
            Back to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
