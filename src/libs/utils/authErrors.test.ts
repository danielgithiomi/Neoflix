import { AppwriteException } from "appwrite";
import { describe, expect, it } from "vitest";
import { AUTH_FALLBACK_ERROR, AUTH_NETWORK_ERROR, getAuthErrorMessage } from "./authErrors";

const appwriteError = (type: string, code: number = 400): AppwriteException =>
	new AppwriteException("Appwrite's developer-facing wording", code, type);

describe("getAuthErrorMessage", () => {
	it("explains a wrong email or password without saying which one was wrong", () => {
		expect(getAuthErrorMessage(appwriteError("user_invalid_credentials", 401))).toBe("That email or password is incorrect.");
	});

	it("points an already registered email towards logging in", () => {
		const message: string = getAuthErrorMessage(appwriteError("user_already_exists", 409));

		expect(message).toContain("already exists");
		expect(getAuthErrorMessage(appwriteError("user_email_already_exists", 409))).toBe(message);
	});

	it("asks the user to wait when Appwrite rate limits them", () => {
		expect(getAuthErrorMessage(appwriteError("general_rate_limit_exceeded", 429))).toContain("Too many attempts");
	});

	it("covers a blocked account and an existing session", () => {
		expect(getAuthErrorMessage(appwriteError("user_blocked", 401))).toContain("blocked");
		expect(getAuthErrorMessage(appwriteError("user_session_already_exists", 401))).toContain("already logged in");
	});

	it("never shows Appwrite's own wording for an error it doesn't recognise", () => {
		expect(getAuthErrorMessage(appwriteError("general_argument_invalid"))).toBe(AUTH_FALLBACK_ERROR);
	});

	it("treats a request that never got a response as a connection problem", () => {
		expect(getAuthErrorMessage(new TypeError("Failed to fetch"))).toBe(AUTH_NETWORK_ERROR);
	});

	it("falls back for anything that isn't an error from Appwrite or the network", () => {
		expect(getAuthErrorMessage(new Error("boom"))).toBe(AUTH_FALLBACK_ERROR);
		expect(getAuthErrorMessage("boom")).toBe(AUTH_FALLBACK_ERROR);
		expect(getAuthErrorMessage(undefined)).toBe(AUTH_FALLBACK_ERROR);
	});
});
