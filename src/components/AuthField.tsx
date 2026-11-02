import { useState } from "react";
import { TAuthFieldProps } from "../data/Auth.ts";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// The label doubles as the placeholder, and stays available to screen readers
const AuthField = ({
    id,
    label,
    error,
    value,
    onChange,
    autoComplete,
    type = "text",
}: TAuthFieldProps) => {
    const errorId: string = `${id}-error`;
    const isPassword: boolean = type === "password";
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className="auth-field">
            <label htmlFor={id} className="sr-only">
                {label}
            </label>

            <div className="auth-input-wrap">
                <input
                    id={id}
                    name={id}
                    value={value}
                    placeholder={label}
                    autoComplete={autoComplete}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    type={isPassword && showPassword ? "text" : type}
                    onChange={(event) => onChange(event.target.value)}
                />

                {isPassword && (
                    <button
                        type="button"
                        className="auth-toggle-password"
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword((shown) => !shown)}
                        aria-label={
                            showPassword ? "Hide password" : "Show password"
                        }
                    >
                        {showPassword ? (
                            <FaEyeSlash size={16} />
                        ) : (
                            <FaEye size={16} />
                        )}
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
