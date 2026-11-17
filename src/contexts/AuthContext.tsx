import * as React from "react";
import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TAuthStatus, TAuthUser } from "@/data/AuthUser.ts";
import * as AuthService from "@/services/AuthService.ts";
import { LoginValues, SignUpValues } from "@libs/validators/authValidation.ts";

interface AuthValues {
    user: TAuthUser | null;
    status: TAuthStatus;
    logIn: (values: LoginValues) => Promise<void>;
    signUp: (values: SignUpValues) => Promise<void>;
    logOut: () => Promise<void>;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const CURRENT_USER_QUERY_KEY: string[] = ["current_user"];

const AuthContext = createContext<AuthValues | null>(null);

export const useAuth = (): AuthValues => {
    const values = useContext(AuthContext);

    if (!values) throw new Error("useAuth must be used inside an AuthProvider");

    return values;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const queryClient = useQueryClient();

    // The session outlives a page load, so the signed-in user has to be asked for on every start.
    // Only logging in, signing up, or logging out changes the answer, so it is never refetched
    const { data: user = null, isPending } = useQuery({
        retry: false,
        staleTime: Infinity,
        queryKey: CURRENT_USER_QUERY_KEY,
        queryFn: AuthService.getCurrentUser,
    });

    const setUser = (nextUser: TAuthUser | null): void => {
        queryClient.setQueryData(CURRENT_USER_QUERY_KEY, nextUser);
    };

    const logIn = async (values: LoginValues): Promise<void> => {
        setUser(await AuthService.logIn(values));
    };

    const signUp = async (values: SignUpValues): Promise<void> => {
        setUser(await AuthService.signUp(values));
    };

    const logOut = async (): Promise<void> => {
        await AuthService.logOut();
        setUser(null);
    };

    const status: TAuthStatus = isPending ? "loading" : user ? "authenticated" : "guest";

    const returnValues: AuthValues = {
        user,
        status,
        logIn,
        signUp,
        logOut,
    };

    return (
        <AuthContext.Provider value={returnValues}>
            {children}
        </AuthContext.Provider>
    );
};
