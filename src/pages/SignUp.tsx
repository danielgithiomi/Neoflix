import { FormEvent, useState } from "react";
import { NavLink } from "react-router-dom";
import AuthField from "../components/AuthField.tsx";
import AuthLayout from "../components/AuthLayout.tsx";
import { FieldErrors, SignUpValues, validateSignUp } from "../utils/authValidation.ts";

const INITIAL_VALUES: SignUpValues = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const SignUp = () => {
    const [values, setValues] = useState<SignUpValues>(INITIAL_VALUES);
    const [errors, setErrors] = useState<FieldErrors<SignUpValues>>({});
    const [status, setStatus] = useState<string | null>(null);

    // Editing a field clears its error until the next submit
    const updateField = (field: keyof SignUpValues) => (value: string) => {
        setValues((previous) => ({ ...previous, [field]: value }));
        setErrors((previous) => ({ ...previous, [field]: undefined }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validateSignUp(values);
        setErrors(validationErrors);

        const firstInvalidField = Object.keys(validationErrors)[0];
        if (firstInvalidField) {
            setStatus(null);
            document.getElementById(firstInvalidField)?.focus();
            return;
        }

        // Placeholder until the form is connected to Appwrite's account.create
        setStatus("Your details look good. Sign-up isn't connected to Appwrite yet.");
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Every movie. No ads. No hassle."
            footer={<>Already a member? <NavLink to="/login">Log in</NavLink></>}
        >
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                {status && <p className="auth-status" role="status">{status}</p>}

                <div className="gap-3 grid grid-cols-2">
                    <AuthField id="firstName" label="First name" autoComplete="given-name"
                               value={values.firstName} onChange={updateField("firstName")} error={errors.firstName} />
                    <AuthField id="lastName" label="Last name" autoComplete="family-name"
                               value={values.lastName} onChange={updateField("lastName")} error={errors.lastName} />
                </div>

                <AuthField id="username" label="Username" autoComplete="username"
                           value={values.username} onChange={updateField("username")} error={errors.username} />
                <AuthField id="email" label="Email" type="email" autoComplete="email"
                           value={values.email} onChange={updateField("email")} error={errors.email} />
                <AuthField id="password" label="Password" type="password" autoComplete="new-password"
                           value={values.password} onChange={updateField("password")} error={errors.password} />
                <AuthField id="confirmPassword" label="Confirm password" type="password" autoComplete="new-password"
                           value={values.confirmPassword} onChange={updateField("confirmPassword")} error={errors.confirmPassword} />

                <button type="submit" className="auth-submit">Create account</button>
            </form>
        </AuthLayout>
    );
};

export default SignUp;
