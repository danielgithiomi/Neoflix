import { useRef, useState } from "react";
import { TAuthFieldProps } from "../data/Auth.ts";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

// By default the label doubles as the placeholder, and stays available to screen readers.
// showLabel puts it above the field instead, for forms that open already filled in.
// Text and email fields get a clear button while they hold a value; password fields get show/hide instead
const AuthField = ({
    id,
    label,
    error,
    value,
    onChange,
    placeholder,
    autoComplete,
    type = "text",
    showLabel = false,
}: TAuthFieldProps) => {
    const errorId: string = `${id}-error`;
    const isPassword: boolean = type === "password";
    const inputRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // Keeps the cursor in the field, like the search bar's clear button
    const clearValue = () => {
        onChange("");
        inputRef.current?.focus();
    };

    return (
        <div className="auth-field">
            <label htmlFor={id} className={showLabel ? "auth-label" : "sr-only"}>
                {label}
            </label>

            <div className="auth-input-wrap">
                <input
                    id={id}
                    name={id}
                    value={value}
                    ref={inputRef}
                    placeholder={placeholder ?? (showLabel ? undefined : label)}
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

                {!isPassword && value && (
                    <button
                        type="button"
                        className="auth-clear"
                        onClick={clearValue}
                        aria-label={`Clear ${label.toLowerCase()}`}
                    >
                        <FaTimes size={14} />
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
