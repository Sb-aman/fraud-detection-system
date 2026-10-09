import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Floating-label input with optional show/hide for passwords.
export default function Field({ label, icon: Icon, error, type = "text", ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={`field ${error ? "has-error" : ""}`}>
      {Icon && <Icon size={18} className="field-icon" />}
      <input
        {...props}
        type={isPassword && show ? "text" : type}
        placeholder=" "
        aria-invalid={!!error}
      />
      <label htmlFor={props.id}>{label}</label>

      {isPassword && (
        <button
          type="button"
          className="toggle"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}

      {error && <span className="err" role="alert">{error}</span>}
    </div>
  );
}
