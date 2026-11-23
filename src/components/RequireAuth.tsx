import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext.tsx";

export default function RequireAuth({ returnTo }: { returnTo: string }) {
    const { status } = useAuth();

    if (status === "loading") {
        return <p role="status" className="py-12 text-center">Checking your session…</p>;
    }

    if (status === "guest") {
        return <Navigate to="/login" replace state={{ from: returnTo }} />;
    }

    return <Outlet />;
}
