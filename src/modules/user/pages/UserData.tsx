import { LayoutDashboard, Mail, Calendar, Shield, UserCircle, FileText } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { useAuthContext } from "../context/AuthContext";
import { ReportsDataTable } from "../components/ReportsDataTable";

export default function UserData() {
    const { user } = useAuthContext();

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <LayoutDashboard size={40} className="text-primary" />
                    <h1
                        className="text-5xl font-bold text-foreground"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Dashboard
                    </h1>
                </div>
                <p className="text-lg text-default-600 font-normal">
                    View your account information and manage your reports.
                </p>
            </div>

            {user && (
                <div className="space-y-6">
                    {/* User Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardBody className="gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                                        <UserCircle size={28} className="text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold">{user.name}</h2>
                                        <div className="flex items-center gap-2 text-default-500 text-sm">
                                            <Mail size={12} />
                                            <span>{user.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody className="gap-3">
                                <h3 className="text-sm font-semibold text-default-500">Account Status</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Shield size={16} className="text-primary" />
                                        <span className="font-medium capitalize">{user.role}</span>
                                    </div>
                                    <div
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            user.isActive
                                                ? "bg-success/20 text-success"
                                                : "bg-danger/20 text-danger"
                                        }`}
                                    >
                                        {user.isActive ? "Active" : "Inactive"}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody className="gap-3">
                                <h3 className="text-sm font-semibold text-default-500">Activity</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-default-400" />
                                        <span className="text-default-500">Created:</span>
                                        <span className="font-medium">{formatDate(user.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-default-400" />
                                        <span className="text-default-500">Last login:</span>
                                        <span className="font-medium">{formatDate(user.lastLogin)}</span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Reports Table */}
                    <Card>
                        <CardHeader className="flex items-center gap-2">
                            <FileText size={20} className="text-primary" />
                            <h3 className="text-lg font-semibold">My Reports</h3>
                        </CardHeader>
                        <CardBody>
                            <ReportsDataTable />
                        </CardBody>
                    </Card>
                </div>
            )}
        </div>
    );
}
