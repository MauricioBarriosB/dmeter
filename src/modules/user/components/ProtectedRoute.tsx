/**
 * Protected Route Component
 *
 * Wraps routes that require authentication. Redirects to login if not authenticated.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Readonly<ProtectedRouteProps>) {
    const { isAuthenticated, isInitialized } = useAuthContext();
    const location = useLocation();

    // Show nothing while checking auth state
    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-default-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login, saving the attempted URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
