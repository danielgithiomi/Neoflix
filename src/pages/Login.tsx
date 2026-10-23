import { FormEvent, useState } from "react";
import { NavLink } from "react-router-dom";
import AuthField from "../components/AuthField.tsx";
import AuthLayout from "../components/AuthLayout.tsx";
import { FieldErrors, LoginValues, validateLogin } from "../utils/authValidation.ts";

const INITIAL_VALUES: LoginValues = {
    email: "",
    password: "",
};

const Login = () => {
    const [values, setValues] = useState<LoginValues>(INITIAL_VALUES);
    const [errors, setErrors] = useState<FieldErrors<LoginValues>>({});
    const [status, setStatus] = useState<string | null>(null);

    // Editing a field clears its error until the next submit
    const updateField = (field: keyof LoginValues) => (value: string) => {
        setValues((previous) => ({ ...previous, [field]: value }));
        setErrors((previous) => ({ ...previous, [field]: undefined }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validateLogin(values);
        setErrors(validationErrors);

        const firstInvalidField = Object.keys(validationErrors)[0];
        if (firstInvalidField) {
            setStatus(null);
            document.getElementById(firstInvalidField)?.focus();
            return;
        }

        // Placeholder until the form is connected to Appwrite's createEmailPasswordSession
        setStatus("Your details look good. Login isn't connected to Appwrite yet.");
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Log in to keep watching."
            footer={<>New to Neoflix? <NavLink to="/signup">Sign up</NavLink></>}
        >
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                {status && <p className="auth-status" role="status">{status}</p>}

                <AuthField id="email" label="Email" type="email" autoComplete="email"
                           value={values.email} onChange={updateField("email")} error={errors.email} />
                <AuthField id="password" label="Password" type="password" autoComplete="current-password"
                           value={values.password} onChange={updateField("password")} error={errors.password} />

                <button type="submit" className="auth-submit">Log in</button>
            </form>
        </AuthLayout>
    );
};

export default Login;
