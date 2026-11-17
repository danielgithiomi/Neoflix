import { AppwriteException, ID } from "appwrite";
import { appwrite_account } from "@/appwrite.ts";
import { TAuthUser, TAuthUserPreferences } from "@/data/AuthUser.ts";
import { LoginValues, SignUpValues } from "@libs/validators/authValidation.ts";

const UNAUTHORIZED: number = 401;
const CURRENT_SESSION: string = "current";

const isUnauthorized = (error: unknown): boolean =>
    error instanceof AppwriteException && error.code === UNAUTHORIZED;

// Appwrite answers a guest asking for their account with a 401, which only means nobody is signed in
export const getCurrentUser = async (): Promise<TAuthUser | null> => {
    try {
        return await appwrite_account.get<TAuthUserPreferences>();
    } catch (error: unknown) {
        if (isUnauthorized(error)) return null;
        throw error;
    }
};

export const logIn = async ({ email, password }: LoginValues): Promise<TAuthUser> => {
    await appwrite_account.createEmailPasswordSession(email.trim(), password);

    return appwrite_account.get<TAuthUserPreferences>();
};

export const signUp = async (values: SignUpValues): Promise<TAuthUser> => {
    const email: string = values.email.trim();
    const fullName: string = `${values.firstName.trim()} ${values.lastName.trim()}`;

    await appwrite_account.create(ID.unique(), email, values.password, fullName);

    // Creating an account doesn't sign it in, and only a signed-in user can save their preferences
    await appwrite_account.createEmailPasswordSession(email, values.password);

    try {
        return await appwrite_account.updatePrefs<TAuthUserPreferences>({ username: values.username.trim() });
    } catch (error: unknown) {
        // The account exists and is signed in by now, so failing here would strand the user on a form
        // that can only answer "this email is already registered". The username stays unset instead
        console.warn("The account was created, but its username could not be saved.", error);

        return appwrite_account.get<TAuthUserPreferences>();
    }
};

export const logOut = async (): Promise<void> => {
    try {
        await appwrite_account.deleteSession(CURRENT_SESSION);
    } catch (error: unknown) {
        // A 401 means the session had already ended, which is the outcome logging out wants
        if (!isUnauthorized(error)) throw error;
    }
};
