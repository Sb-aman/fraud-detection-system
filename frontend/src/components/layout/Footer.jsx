const Footer = () => {
  return (
    <footer className="mt-auto px-4 lg:px-6 py-4 border-t border-border dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted">
        <p>&copy; {new Date().getFullYear()} FraudGuard Detection System. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
