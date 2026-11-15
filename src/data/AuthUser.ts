import { Models } from "appwrite";

// Appwrite's users table can't take extra columns, so custom fields live in the account's preferences
export interface TAuthUserPreferences extends Models.Preferences {
    username?: string;
}

export type TAuthUser = Models.User<TAuthUserPreferences>;

export type TAuthStatus = "loading" | "authenticated" | "guest";
