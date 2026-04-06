import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    UserCircle,
    Mail,
    User,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    Check,
    LogOut,
    Calendar,
    Shield,
} from "lucide-react";
import { Card, CardBody, CardHeader, Input, Button, Divider, Chip, addToast } from "@heroui/react";
import { useAuthContext } from "../context/AuthContext";

export default function UserAccount() {
    const navigate = useNavigate();
    const { user, isLoading, error, updateProfile, updatePassword, logout, clearError } = useAuthContext();

    // Profile form state
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [profileError, setProfileError] = useState<string | null>(null);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Password form state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError(null);
        clearError();

        if (!name.trim()) {
            setProfileError("Name is required.");
            return;
        }

        if (!email.trim() || !email.includes("@")) {
            setProfileError("Please enter a valid email address.");
            return;
        }

        setIsUpdatingProfile(true);

        // Only send fields that have changed
        const updates: { name?: string; email?: string } = {};
        if (name !== user?.name) {
            updates.name = name;
        }
        if (email !== user?.email) {
            updates.email = email;
        }

        // If nothing changed, just show success
        if (Object.keys(updates).length === 0) {
            setIsUpdatingProfile(false);
            addToast({
                title: "No changes",
                description: "No changes were made to your profile.",
                color: "default",
            });
            return;
        }

        const success = await updateProfile(updates);

        setIsUpdatingProfile(false);

        if (success) {
            addToast({
                title: "Profile updated",
                description: "Your profile has been updated successfully.",
                color: "success",
            });
        } else {
            setProfileError(error || "Failed to update profile.");
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        clearError();

        if (!currentPassword) {
            setPasswordError("Please enter your current password.");
            return;
        }

        if (!newPassword) {
            setPasswordError("Please enter a new password.");
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        setIsUpdatingPassword(true);

        const success = await updatePassword({ currentPassword, newPassword });

        setIsUpdatingPassword(false);

        if (success) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            addToast({
                title: "Password updated",
                description: "Your password has been changed successfully.",
                color: "success",
            });
        } else {
            setPasswordError(error || "Failed to update password.");
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return "Never";
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <UserCircle size={40} className="text-primary" />
                    <h1
                        className="text-5xl font-bold text-foreground"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        My Account
                    </h1>
                </div>
                <p className="text-lg text-default-600 font-normal">
                    Manage your account settings, profile information, and security preferences.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Info Card */}
                <Card className="lg:col-span-1">
                    <CardHeader className="flex flex-col items-center gap-3 pb-0">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserCircle size={48} className="text-primary" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-semibold">{user?.name}</h2>
                            <p className="text-default-500">{user?.email}</p>
                        </div>
                    </CardHeader>
                    <CardBody className="gap-4">
                        <div className="flex items-center justify-center gap-2">
                            <Chip
                                color={user?.isActive ? "success" : "danger"}
                                variant="flat"
                                startContent={<Shield size={14} />}
                            >
                                {user?.role || "User"}
                            </Chip>
                        </div>

                        <Divider />

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-default-500">
                                <Calendar size={16} />
                                <span>Joined: {formatDate(user?.createdAt || null)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-default-500">
                                <Clock size={16} />
                                <span>Last login: {formatDate(user?.lastLogin || null)}</span>
                            </div>
                        </div>

                        <Divider />

                        <Button
                            color="danger"
                            variant="flat"
                            startContent={<LogOut size={18} />}
                            onPress={handleLogout}
                            isLoading={isLoading}
                            className="w-full"
                        >
                            Sign Out
                        </Button>
                    </CardBody>
                </Card>

                {/* Profile & Password Forms */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Form */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <User size={20} className="text-primary" />
                                <h3 className="text-lg font-semibold">Profile Information</h3>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
                                {profileError && (
                                    <div className="flex items-center gap-2 p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
                                        <AlertCircle size={18} className="text-danger shrink-0" />
                                        <p className="text-sm text-danger">{profileError}</p>
                                    </div>
                                )}

                                <Input
                                    type="text"
                                    label="Name"
                                    placeholder="Enter your name"
                                    value={name}
                                    onValueChange={(value) => {
                                        setName(value);
                                        setProfileError(null);
                                    }}
                                    startContent={<User size={18} className="text-default-400" />}
                                    isRequired
                                />

                                <Input
                                    type="email"
                                    label="Email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onValueChange={(value) => {
                                        setEmail(value);
                                        setProfileError(null);
                                    }}
                                    startContent={<Mail size={18} className="text-default-400" />}
                                    isRequired
                                />

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        color="primary"
                                        isLoading={isUpdatingProfile}
                                        startContent={!isUpdatingProfile && <Check size={18} />}
                                    >
                                        {isUpdatingProfile ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>

                    {/* Password Form */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Lock size={20} className="text-primary" />
                                <h3 className="text-lg font-semibold">Change Password</h3>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                                {passwordError && (
                                    <div className="flex items-center gap-2 p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
                                        <AlertCircle size={18} className="text-danger shrink-0" />
                                        <p className="text-sm text-danger">{passwordError}</p>
                                    </div>
                                )}

                                <Input
                                    type={showCurrentPassword ? "text" : "password"}
                                    label="Current Password"
                                    placeholder="Enter your current password"
                                    value={currentPassword}
                                    onValueChange={(value) => {
                                        setCurrentPassword(value);
                                        setPasswordError(null);
                                    }}
                                    startContent={<Lock size={18} className="text-default-400" />}
                                    endContent={
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="focus:outline-none"
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff size={18} className="text-default-400" />
                                            ) : (
                                                <Eye size={18} className="text-default-400" />
                                            )}
                                        </button>
                                    }
                                    isRequired
                                    autoComplete="current-password"
                                />

                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    label="New Password"
                                    placeholder="Enter your new password"
                                    value={newPassword}
                                    onValueChange={(value) => {
                                        setNewPassword(value);
                                        setPasswordError(null);
                                    }}
                                    startContent={<Lock size={18} className="text-default-400" />}
                                    endContent={
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="focus:outline-none"
                                        >
                                            {showNewPassword ? (
                                                <EyeOff size={18} className="text-default-400" />
                                            ) : (
                                                <Eye size={18} className="text-default-400" />
                                            )}
                                        </button>
                                    }
                                    isRequired
                                    autoComplete="new-password"
                                />

                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    label="Confirm New Password"
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onValueChange={(value) => {
                                        setConfirmPassword(value);
                                        setPasswordError(null);
                                    }}
                                    startContent={<Lock size={18} className="text-default-400" />}
                                    endContent={
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
                                    }
                                    isRequired
                                    autoComplete="new-password"
                                />

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        color="primary"
                                        isLoading={isUpdatingPassword}
                                        startContent={!isUpdatingPassword && <Lock size={18} />}
                                    >
                                        {isUpdatingPassword ? "Updating..." : "Update Password"}
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function Clock(props: { size: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.size}
            height={props.size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}
