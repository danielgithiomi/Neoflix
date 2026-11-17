import { AppwriteException } from "appwrite";

/* -------------------------------------------------------------------------------------------------
 * Auth Error Messages
 * -----------------------------------------------------------------------------------------------*/
export const AUTH_FALLBACK_ERROR: string = "Something went wrong. Please try again.";
export const AUTH_NETWORK_ERROR: string = "Couldn't reach Neoflix. Check your connection and try again.";

const EMAIL_TAKEN_ERROR: string = "An account with this email already exists. Try logging in instead.";

// Keyed by Appwrite's error type: https://appwrite.io/docs/advanced/platform/response-codes
const AUTH_ERRORS: Record<string, string> = {
	user_invalid_credentials: "That email or password is incorrect.",
	user_already_exists: EMAIL_TAKEN_ERROR,
	user_email_already_exists: EMAIL_TAKEN_ERROR,
	user_blocked: "This account has been blocked.",
	user_session_already_exists: "You're already logged in. Log out first to use a different account.",
	general_rate_limit_exceeded: "Too many attempts. Wait a few minutes and try again.",
};

/**
 * A function that turns a failed Appwrite auth request into a message that is safe to show the user
 * @param error - Whatever the request threw
 * @returns A message for the user. Appwrite's own wording is never shown, as it is written for developers
 */
export function getAuthErrorMessage(error: unknown): string {
	if (error instanceof AppwriteException) return AUTH_ERRORS[error.type] ?? AUTH_FALLBACK_ERROR;

	// The SDK doesn't wrap a request that never got a response, so it surfaces as fetch's TypeError
	if (error instanceof TypeError) return AUTH_NETWORK_ERROR;

	return AUTH_FALLBACK_ERROR;
}
