export interface LoginValues {
    email: string;
    password: string;
}

export interface SignUpValues {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

// Appwrite accepts passwords of 8–256 characters and names of up to 128 characters
const PASSWORD_MIN_LENGTH: number = 8;
const PASSWORD_MAX_LENGTH: number = 256;
const NAME_MAX_LENGTH: number = 128;

const EMAIL_PATTERN: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN: RegExp = /^[a-zA-Z0-9_]{3,20}$/;

const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Enter your email";
    if (!EMAIL_PATTERN.test(email.trim())) return "Enter a valid email address";
};

export const validateLogin = (values: LoginValues): FieldErrors<LoginValues> => {
    const errors: FieldErrors<LoginValues> = {};

    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;

    if (!values.password) errors.password = "Enter your password";

    return errors;
};

export const validateSignUp = (values: SignUpValues): FieldErrors<SignUpValues> => {
    const errors: FieldErrors<SignUpValues> = {};
    const fullName: string = `${values.firstName.trim()} ${values.lastName.trim()}`;

    if (!values.firstName.trim()) errors.firstName = "Enter your first name";

    if (!values.lastName.trim()) errors.lastName = "Enter your last name";
    else if (fullName.length > NAME_MAX_LENGTH) errors.lastName = `Your full name must be ${NAME_MAX_LENGTH} characters or fewer`;

    if (!values.username.trim()) errors.username = "Choose a username";
    else if (!USERNAME_PATTERN.test(values.username.trim())) errors.username = "Use 3–20 letters, numbers, or underscores";

    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;

    if (!values.password) errors.password = "Create a password";
    else if (values.password.length < PASSWORD_MIN_LENGTH) errors.password = `Use at least ${PASSWORD_MIN_LENGTH} characters`;
    else if (values.password.length > PASSWORD_MAX_LENGTH) errors.password = `Use ${PASSWORD_MAX_LENGTH} characters or fewer`;

    if (!values.confirmPassword) errors.confirmPassword = "Confirm your password";
    else if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords don't match";

    return errors;
};
