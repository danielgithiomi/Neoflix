import { FormEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext.tsx";
import AuthField from "../components/AuthField.tsx";
import AuthLayout from "../components/AuthLayout.tsx";
import { getAuthErrorMessage } from "@libs/utils/authErrors.ts";
import { FieldErrors, LoginValues, validateLogin } from "@/libs/validators/authValidation.ts";

const INITIAL_VALUES: LoginValues = {
    email: "",
    password: "",
};

const Login = () => {
    const [values, setValues] = useState<LoginValues>(INITIAL_VALUES);
    const [errors, setErrors] = useState<FieldErrors<LoginValues>>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { logIn } = useAuth();
    const navigate = useNavigate();

    // Editing a field clears its error until the next submit
    const updateField = (field: keyof LoginValues) => (value: string) => {
        setValues((previous) => ({ ...previous, [field]: value }));
        setErrors((previous) => ({ ...previous, [field]: undefined }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validateLogin(values);
        setErrors(validationErrors);
        setSubmitError(null);

        const firstInvalidField = Object.keys(validationErrors)[0];
        if (firstInvalidField) {
            document.getElementById(firstInvalidField)?.focus();
            return;
        }

        setIsSubmitting(true);

        try {
            await logIn(values);
            navigate("/", { replace: true });
        } catch (error: unknown) {
            setSubmitError(getAuthErrorMessage(error));
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Log in to keep watching."
            footer={<>New to Neoflix? <NavLink to="/signup">Sign up</NavLink></>}
        >
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                {submitError && <p className="auth-status auth-status-error" role="alert">{submitError}</p>}

                <AuthField id="email" label="Email" type="email" autoComplete="email"
                           value={values.email} onChange={updateField("email")} error={errors.email} />
                <AuthField id="password" label="Password" type="password" autoComplete="current-password"
                           value={values.password} onChange={updateField("password")} error={errors.password} />

                <button type="submit" className="auth-submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in…" : "Log in"}
                </button>
            </form>
        </AuthLayout>
    );
};

export default Login;
