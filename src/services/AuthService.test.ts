import { AppwriteException } from "appwrite";
import { TAuthUser } from "@/data/AuthUser.ts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignUpValues } from "@libs/validators/authValidation.ts";
import { getCurrentUser, logIn, logOut, signUp } from "./AuthService.ts";

// The real client needs the Appwrite environment variables, and these tests must never reach the network
const account = vi.hoisted(() => ({
    get: vi.fn(),
    create: vi.fn(),
    updatePrefs: vi.fn(),
    deleteSession: vi.fn(),
    createEmailPasswordSession: vi.fn(),
}));

vi.mock("@/appwrite.ts", () => ({ appwrite_account: account }));

// Only the fields these tests compare matter here
const user = { $id: "user-1", name: "Thomas Anderson", prefs: { username: "the_one" } } as unknown as TAuthUser;

const unauthorized = new AppwriteException("missing scope (account)", 401, "general_unauthorized_scope");
const serverError = new AppwriteException("Server Error", 500, "general_unknown");

const signUpValues: SignUpValues = {
    email: "  neo@matrix.io ",
    lastName: " Anderson ",
    username: " the_one ",
    password: "followthewhiterabbit",
    firstName: " Thomas ",
    confirmPassword: "followthewhiterabbit",
};

const firstCallOrder = (mock: ReturnType<typeof vi.fn>): number => mock.mock.invocationCallOrder[0];

beforeEach(() => {
    vi.resetAllMocks();
});

describe("getCurrentUser", () => {
    it("returns the signed-in user", async () => {
        account.get.mockResolvedValue(user);

        await expect(getCurrentUser()).resolves.toBe(user);
    });

    it("returns null when nobody is signed in", async () => {
        account.get.mockRejectedValue(unauthorized);

        await expect(getCurrentUser()).resolves.toBeNull();
    });

    it("lets every other failure through, so an outage isn't mistaken for being signed out", async () => {
        account.get.mockRejectedValue(serverError);
        await expect(getCurrentUser()).rejects.toBe(serverError);

        const offline = new TypeError("Failed to fetch");
        account.get.mockRejectedValue(offline);
        await expect(getCurrentUser()).rejects.toBe(offline);
    });
});

describe("logIn", () => {
    it("creates a session with the trimmed email, then returns the user", async () => {
        account.get.mockResolvedValue(user);

        await expect(logIn({ email: " neo@matrix.io ", password: " keeps its spaces " })).resolves.toBe(user);

        expect(account.createEmailPasswordSession).toHaveBeenCalledWith("neo@matrix.io", " keeps its spaces ");
        expect(firstCallOrder(account.createEmailPasswordSession)).toBeLessThan(firstCallOrder(account.get));
    });

    it("doesn't ask for the user when the credentials are rejected", async () => {
        const rejected = new AppwriteException("Invalid credentials", 401, "user_invalid_credentials");
        account.createEmailPasswordSession.mockRejectedValue(rejected);

        await expect(logIn({ email: "neo@matrix.io", password: "wrong" })).rejects.toBe(rejected);
        expect(account.get).not.toHaveBeenCalled();
    });
});

describe("signUp", () => {
    it("creates the account, signs it in, then saves the username", async () => {
        account.updatePrefs.mockResolvedValue(user);

        await expect(signUp(signUpValues)).resolves.toBe(user);

        expect(account.create).toHaveBeenCalledWith(expect.any(String), "neo@matrix.io", "followthewhiterabbit", "Thomas Anderson");
        expect(account.createEmailPasswordSession).toHaveBeenCalledWith("neo@matrix.io", "followthewhiterabbit");
        expect(account.updatePrefs).toHaveBeenCalledWith({ username: "the_one" });

        expect(firstCallOrder(account.create)).toBeLessThan(firstCallOrder(account.createEmailPasswordSession));
        expect(firstCallOrder(account.createEmailPasswordSession)).toBeLessThan(firstCallOrder(account.updatePrefs));
    });

    it("stops before signing in when the account can't be created", async () => {
        const taken = new AppwriteException("User already exists", 409, "user_already_exists");
        account.create.mockRejectedValue(taken);

        await expect(signUp(signUpValues)).rejects.toBe(taken);

        expect(account.createEmailPasswordSession).not.toHaveBeenCalled();
        expect(account.updatePrefs).not.toHaveBeenCalled();
    });

    it("still signs the user in when only the username fails to save", async () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
        account.updatePrefs.mockRejectedValue(serverError);
        account.get.mockResolvedValue(user);

        await expect(signUp(signUpValues)).resolves.toBe(user);
        expect(warn).toHaveBeenCalledOnce();

        warn.mockRestore();
    });
});

describe("logOut", () => {
    it("ends the current session", async () => {
        await logOut();

        expect(account.deleteSession).toHaveBeenCalledWith("current");
    });

    it("counts a session that had already ended as logged out", async () => {
        account.deleteSession.mockRejectedValue(unauthorized);

        await expect(logOut()).resolves.toBeUndefined();
    });

    it("reports a logout that didn't reach Appwrite", async () => {
        account.deleteSession.mockRejectedValue(serverError);

        await expect(logOut()).rejects.toBe(serverError);
    });
});
