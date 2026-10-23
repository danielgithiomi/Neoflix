import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type TAuthFieldProps = {
    id: string;
    label: string;
    type?: "text" | "email" | "password";
    value: string;
    onChange: (value: string) => void;
    error?: string;
    autoComplete?: string;
};

// The label doubles as the placeholder, and stays available to screen readers
const AuthField = ({ id, label, type = "text", value, onChange, error, autoComplete }: TAuthFieldProps) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const isPassword: boolean = type === "password";
    const errorId: string = `${id}-error`;

    return (
        <div className="auth-field">
            <label htmlFor={id} className="sr-only">
                {label}
            </label>

            <div className="auth-input-wrap">
                <input
                    id={id}
                    name={id}
                    type={isPassword && showPassword ? "text" : type}
                    value={value}
                    placeholder={label}
                    autoComplete={autoComplete}
                    onChange={(event) => onChange(event.target.value)}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                />

                {isPassword && (
                    <button
                        type="button"
                        className="auth-toggle-password"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword((shown) => !shown)}
                    >
                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                )}
            </div>

            {error && (
                <p id={errorId} className="auth-field-error">
                    {error}
                </p>
            )}
        </div>
    );
};

export default AuthField;
