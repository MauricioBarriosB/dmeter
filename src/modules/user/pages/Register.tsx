import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import { Card, CardBody, Input, Button, Divider } from "@heroui/react";
import { useAuthContext } from "../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError, isAuthenticated } = useAuthContext();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to="/userdata" replace />;
    }

    const validateForm = (): boolean => {
        if (!name.trim()) {
            setValidationError("Please enter your name.");
            return false;
        }

        if (name.trim().length < 2) {
            setValidationError("Name must be at least 2 characters long.");
            return false;
        }

        if (!email.trim()) {
            setValidationError("Please enter your email address.");
            return false;
        }

        if (!email.includes("@")) {
            setValidationError("Please enter a valid email address.");
            return false;
        }

        if (!password) {
            setValidationError("Please enter a password.");
            return false;
        }

        if (password.length < 8) {
            setValidationError("Password must be at least 8 characters long.");
            return false;
        }

        if (password !== confirmPassword) {
            setValidationError("Passwords do not match.");
            return false;
        }

        setValidationError(null);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!validateForm()) return;

        const success = await register({ name, email, password });

        if (success) {
            navigate("/userdata");
        }
    };

    const displayError = validationError || error;

    // Password strength indicator
    const getPasswordStrength = (): { label: string; color: string; width: string } => {
        if (!password) return { label: "", color: "", width: "0%" };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength <= 2) return { label: "Weak", color: "bg-danger", width: "33%" };
        if (strength <= 3) return { label: "Medium", color: "bg-warning", width: "66%" };
        return { label: "Strong", color: "bg-success", width: "100%" };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <UserPlus size={40} className="text-primary" />
                    <h1
                        className="text-5xl font-bold text-foreground"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Create Account
                    </h1>
                </div>
                <p className="text-lg text-default-600 font-normal">
                    Sign up to start using DMeter and manage your acoustic analysis data.
                </p>
            </div>

            <div className="max-w-md mx-auto">
                <Card className="p-2">
                    <CardBody className="gap-6">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {displayError && (
                                <div className="flex items-center gap-2 p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
                                    <AlertCircle size={18} className="text-danger shrink-0" />
                                    <p className="text-sm text-danger">{displayError}</p>
                                </div>
                            )}

                            <Input
                                type="text"
                                label="Name"
                                placeholder="Enter your full name"
                                value={name}
                                onValueChange={(value) => {
                                    setName(value);
                                    setValidationError(null);
                                    clearError();
                                }}
                                startContent={<User size={18} className="text-default-400" />}
                                isRequired
                                autoComplete="name"
                            />

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

                            <div className="space-y-2">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    label="Password"
                                    placeholder="Create a password"
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
                                    autoComplete="new-password"
                                />
                                {password && (
                                    <div className="space-y-1">
                                        <div className="h-1 bg-default-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                                style={{ width: passwordStrength.width }}
                                            />
                                        </div>
                                        <p className="text-xs text-default-500">
                                            Password strength: {passwordStrength.label}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onValueChange={(value) => {
                                    setConfirmPassword(value);
                                    setValidationError(null);
                                    clearError();
                                }}
                                startContent={<Lock size={18} className="text-default-400" />}
                                endContent={
                                    <div className="flex items-center gap-1">
                                        {confirmPassword && password === confirmPassword && (
                                            <Check size={18} className="text-success" />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="focus:outline-none"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={18} className="text-default-400" />
                                            ) : (
                                                <Eye size={18} className="text-default-400" />
                                            )}
                                        </button>
                                    </div>
                                }
                                isRequired
                                autoComplete="new-password"
                            />

                            <Button
                                type="submit"
                                color="primary"
                                size="lg"
                                className="mt-2"
                                isLoading={isLoading}
                                startContent={!isLoading && <UserPlus size={18} />}
                            >
                                {isLoading ? "Creating account..." : "Create Account"}
                            </Button>
                        </form>

                        <Divider />

                        <div className="text-center">
                            <p className="text-default-500">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary hover:underline font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
