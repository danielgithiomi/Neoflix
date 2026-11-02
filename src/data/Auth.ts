import { ReactNode } from "react";

export type TAuthFieldProps = {
    id: string;
    label: string;
    value: string;
    error?: string;
    autoComplete?: string;
    onChange: (value: string) => void;
    type?: "text" | "email" | "password";
};

export type TAuthLayoutProps = {
    title: string;
    subtitle: string;
    footer: ReactNode;
    children: ReactNode;
};