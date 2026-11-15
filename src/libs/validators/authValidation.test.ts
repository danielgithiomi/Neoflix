import { describe, expect, it } from "vitest";
import { LoginValues, ProfileValues, SignUpValues, validateLogin, validateProfile, validateSignUp } from "./authValidation.ts";

const validLogin: LoginValues = {
    email: "neo@matrix.io",
    password: "followthewhiterabbit",
};

const validSignUp: SignUpValues = {
    email: "neo@matrix.io",
    lastName: "Anderson",
    username: "the_one",
    password: "followthewhiterabbit",
    firstName: "Thomas",
    confirmPassword: "followthewhiterabbit",
};

const validProfile: ProfileValues = {
    email: "neo@matrix.io",
    lastName: "Anderson",
    password: "",
    firstName: "Thomas",
};

describe("validateLogin", () => {
    it("returns no errors for valid credentials", () => {
        expect(validateLogin(validLogin)).toEqual({});
    });

    it("requires an email and password", () => {
        expect(validateLogin({ email: "   ", password: "" })).toEqual({
            email: "Enter your email",
            password: "Enter your password",
        });
    });

    it.each(["neo", "neo@matrix", "neo@@matrix.io", "neo matrix@io.com"])("rejects malformed email %j", (email) => {
        expect(validateLogin({ ...validLogin, email }).email).toBe("Enter a valid email address");
    });

    it("accepts an email surrounded by whitespace", () => {
        expect(validateLogin({ ...validLogin, email: "  neo@matrix.io  " })).toEqual({});
    });
});

describe("validateSignUp", () => {
    it("returns no errors for valid values", () => {
        expect(validateSignUp(validSignUp)).toEqual({});
    });

    it("reports every missing field", () => {
        const empty: SignUpValues = {
            email: "",
            lastName: "",
            username: "",
            password: "",
            firstName: "",
            confirmPassword: "",
        };

        expect(validateSignUp(empty)).toEqual({
            email: "Enter your email",
            lastName: "Enter your last name",
            username: "Choose a username",
            password: "Create a password",
            firstName: "Enter your first name",
            confirmPassword: "Confirm your password",
        });
    });

    it("treats whitespace-only names as missing", () => {
        const errors = validateSignUp({ ...validSignUp, firstName: "  ", lastName: "\t" });

        expect(errors.firstName).toBe("Enter your first name");
        expect(errors.lastName).toBe("Enter your last name");
    });

    it("allows a full name of exactly 128 characters", () => {
        // 64 + space + 63 = 128
        expect(validateSignUp({ ...validSignUp, firstName: "a".repeat(64), lastName: "b".repeat(63) })).toEqual({});
    });

    it("rejects a full name longer than 128 characters on the last name field", () => {
        const errors = validateSignUp({ ...validSignUp, firstName: "a".repeat(64), lastName: "b".repeat(64) });

        expect(errors.lastName).toBe("Your full name must be 128 characters or fewer");
        expect(errors.firstName).toBeUndefined();
    });

    it.each(["abc", "the_one", "User_2026", "a".repeat(20)])("accepts username %j", (username) => {
        expect(validateSignUp({ ...validSignUp, username }).username).toBeUndefined();
    });

    it.each(["ab", "a".repeat(21), "the-one", "the one", "neo!"])("rejects username %j", (username) => {
        expect(validateSignUp({ ...validSignUp, username }).username).toBe("Use 3–20 letters, numbers, or underscores");
    });

    it("rejects an invalid email", () => {
        expect(validateSignUp({ ...validSignUp, email: "neo@matrix" }).email).toBe("Enter a valid email address");
    });

    it("enforces the password length bounds", () => {
        const withPassword = (password: string) => validateSignUp({ ...validSignUp, password, confirmPassword: password });

        expect(withPassword("a".repeat(7)).password).toBe("Use at least 8 characters");
        expect(withPassword("a".repeat(8)).password).toBeUndefined();
        expect(withPassword("a".repeat(256)).password).toBeUndefined();
        expect(withPassword("a".repeat(257)).password).toBe("Use 256 characters or fewer");
    });

    it("rejects a confirmation that doesn't match the password", () => {
        const errors = validateSignUp({ ...validSignUp, confirmPassword: "followthewhiterabbit!" });

        expect(errors.confirmPassword).toBe("Passwords don't match");
        expect(errors.password).toBeUndefined();
    });
});

describe("validateProfile", () => {
    it("returns no errors for valid values", () => {
        expect(validateProfile(validProfile)).toEqual({});
    });

    it("requires both names and an email", () => {
        expect(validateProfile({ ...validProfile, firstName: " ", lastName: "", email: "" })).toEqual({
            email: "Enter your email",
            lastName: "Enter your last name",
            firstName: "Enter your first name",
        });
    });

    it("rejects names too short to build a username from", () => {
        const errors = validateProfile({ ...validProfile, firstName: "Jo", lastName: " Li " });

        expect(errors.firstName).toBe("Use at least 3 characters");
        expect(errors.lastName).toBe("Use at least 3 characters");
    });

    it("rejects a full name longer than 128 characters on the last name field", () => {
        const errors = validateProfile({ ...validProfile, firstName: "a".repeat(64), lastName: "b".repeat(64) });

        expect(errors.lastName).toBe("Your full name must be 128 characters or fewer");
        expect(errors.firstName).toBeUndefined();
    });

    it("rejects an invalid email", () => {
        expect(validateProfile({ ...validProfile, email: "neo@matrix" }).email).toBe("Enter a valid email address");
    });

    it("only checks the password when a new one is entered", () => {
        const withPassword = (password: string) => validateProfile({ ...validProfile, password });

        expect(withPassword("").password).toBeUndefined();
        expect(withPassword("a".repeat(7)).password).toBe("Use at least 8 characters");
        expect(withPassword("a".repeat(8)).password).toBeUndefined();
        expect(withPassword("a".repeat(256)).password).toBeUndefined();
        expect(withPassword("a".repeat(257)).password).toBe("Use 256 characters or fewer");
    });
});
