import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Card, CardBody, Input, Button, Divider } from "@heroui/react";
import { useAuthContext } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError, isAuthenticated } = useAuthContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to="/userdata" replace />;
    }

    const validateForm = (): boolean => {
        if (!email.trim()) {
            setValidationError("Please enter your email address.");
            return false;
        }

        if (!email.includes("@")) {
            setValidationError("Please enter a valid email address.");
            return false;
        }

        if (!password) {
            setValidationError("Please enter your password.");
            return false;
        }

        setValidationError(null);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!validateForm()) return;

        const success = await login({ email, password });

        if (success) {
            navigate("/userdata");
        }
    };

    const displayError = validationError || error;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <LogIn size={40} className="text-primary" />
                    <h1
                        className="text-5xl font-bold text-foreground"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Sign In
                    </h1>
                </div>
                <p className="text-lg text-default-600 font-normal">
                    Sign in to your account to access all features and manage your data.
                </p>
            </div>

            <div className="max-w-md mx-auto">
                <Card className="p-2">
                    <CardBody className="gap-6">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {displayError && (
                                <div className="flex items-center gap-2 p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
                                    <AlertCircle size={18} className="text-danger flex-shrink-0" />
                                    <p className="text-sm text-danger">{displayError}</p>
                                </div>
                            )}

                            <Input
                                type="email"
                                label="Email"
                                placeholder="Enter your email"
                                value={email}
                                onValueChange={(value) => {
                                    setEmail(value);
                                    setValidationError(null);
                                    clearError();
                                }}
                                startContent={<Mail size={18} className="text-default-400" />}
                                isRequired
                                autoComplete="email"
                            />

                            <Input
                                type={showPassword ? "text" : "password"}
                                label="Password"
                                placeholder="Enter your password"
                                value={password}
                                onValueChange={(value) => {
                                    setPassword(value);
                                    setValidationError(null);
                                    clearError();
                                }}
                                startContent={<Lock size={18} className="text-default-400" />}
                                endContent={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} className="text-default-400" />
                                        ) : (
                                            <Eye size={18} className="text-default-400" />
                                        )}
                                    </button>
                                }
                                isRequired
                                autoComplete="current-password"
                            />

                            <Button
                                type="submit"
                                color="primary"
                                size="lg"
                                className="mt-2"
                                isLoading={isLoading}
                                startContent={!isLoading && <LogIn size={18} />}
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>

                        <Divider />

                        <div className="text-center">
                            <p className="text-default-500">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-primary hover:underline font-medium">
                                    Create one
                                </Link>
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
