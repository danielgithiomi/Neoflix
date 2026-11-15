import { USERNAME_PART_LENGTH } from "../utils/profile.ts";

export interface LoginValues {
    email: string;
    password: string;
}

export interface ProfileValues {
    email: string;
    lastName: string;
    password: string;
    firstName: string;
}

export interface SignUpValues {
    email: string;
    lastName: string;
    username: string;
    password: string;
    firstName: string;
    confirmPassword: string;
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

// Appwrite accepts passwords of 8–256 characters and names of up to 128 characters
const NAME_MAX_LENGTH: number = 128;
const PASSWORD_MIN_LENGTH: number = 8;
const PASSWORD_MAX_LENGTH: number = 256;

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

export const validateProfile = (values: ProfileValues): FieldErrors<ProfileValues> => {
    const errors: FieldErrors<ProfileValues> = {};
    const firstName: string = values.firstName.trim();
    const lastName: string = values.lastName.trim();
    const fullName: string = `${firstName} ${lastName}`;
    // The username is built from the start of each name, so both need enough characters
    const tooShortError: string = `Use at least ${USERNAME_PART_LENGTH} characters`;

    if (!firstName) errors.firstName = "Enter your first name";
    else if (firstName.length < USERNAME_PART_LENGTH) errors.firstName = tooShortError;

    if (!lastName) errors.lastName = "Enter your last name";
    else if (lastName.length < USERNAME_PART_LENGTH) errors.lastName = tooShortError;
    else if (fullName.length > NAME_MAX_LENGTH) errors.lastName = `Your full name must be ${NAME_MAX_LENGTH} characters or fewer`;

    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;

    // An empty password keeps the current one, so it's only checked when a new one is typed
    if (values.password && values.password.length < PASSWORD_MIN_LENGTH) errors.password = `Use at least ${PASSWORD_MIN_LENGTH} characters`;
    else if (values.password.length > PASSWORD_MAX_LENGTH) errors.password = `Use ${PASSWORD_MAX_LENGTH} characters or fewer`;

    return errors;
};
