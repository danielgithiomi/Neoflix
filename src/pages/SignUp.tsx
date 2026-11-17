import { FormEvent, useState } from "react";
import { useAuth } from "@/contexts/AuthContext.tsx";
import AuthField from "@components/AuthField.tsx";
import AuthLayout from "@components/AuthLayout.tsx";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuthErrorMessage } from "@libs/utils/authErrors.ts";
import { FieldErrors, SignUpValues, validateSignUp } from "@libs/validators/authValidation.ts";

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
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { signUp } = useAuth();
    const navigate = useNavigate();

    // Editing a field clears its error until the next submit
    const updateField = (field: keyof SignUpValues) => (value: string) => {
        setValues((previous) => ({ ...previous, [field]: value }));
        setErrors((previous) => ({ ...previous, [field]: undefined }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validateSignUp(values);
        setErrors(validationErrors);
        setSubmitError(null);

        const firstInvalidField = Object.keys(validationErrors)[0];
        if (firstInvalidField) {
            document.getElementById(firstInvalidField)?.focus();
            return;
        }

        setIsSubmitting(true);

        try {
            await signUp(values);
            navigate("/", { replace: true });
        } catch (error: unknown) {
            setSubmitError(getAuthErrorMessage(error));
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Every movie. No ads. No hassle."
            footer={<>Already a member? <NavLink to="/login">Log in</NavLink></>}
        >
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                {submitError && <p className="auth-status auth-status-error" role="alert">{submitError}</p>}

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

                <button type="submit" className="auth-submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account…" : "Create account"}
                </button>
            </form>
        </AuthLayout>
    );
};

export default SignUp;
