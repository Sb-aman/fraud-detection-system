import { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      icon: Icon,
      type = 'text',
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label className="text-sm font-medium text-text dark:text-slate-200">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              <Icon size={18} />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`
              w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm
              text-text placeholder:text-text-muted transition-all duration-200
              focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
              dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100
              ${Icon ? 'pl-10' : ''}
              ${error ? 'border-danger focus:ring-danger/20 focus:border-danger' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
