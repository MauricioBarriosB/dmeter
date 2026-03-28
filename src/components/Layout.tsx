import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
} from "@heroui/react";
import { Mic, Menu, X, Home, Waves, Container, Drum, Music4, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { useAuthContext } from "@modules/user/context/AuthContext";

// Nav items that require authentication
const protectedNavItems = [
    { name: "Dashboard", href: "/userdata", icon: LayoutDashboard },
    { name: "Audio", href: "/audio", icon: Music4 },
    { name: "Meter", href: "/meter", icon: Mic },
    { name: "Acoustics", href: "/acoustics", icon: Waves },
    { name: "Materials", href: "/materials", icon: Container },
    { name: "Instruments", href: "/instruments", icon: Drum },
];

// Public nav items (always visible)
const publicNavItems = [{ name: "Home", href: "/home", icon: Home }];

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthContext();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const isRouteActive = (href: string, isActive: boolean) => {
        if (href === "/home") {
            return isActive || location.pathname === "/";
        }
        return isActive;
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    // Combine nav items based on auth state
    const navItems = isAuthenticated ? [...publicNavItems, ...protectedNavItems] : publicNavItems;

    return (
        <div
            className="min-h-screen flex flex-col bg-background"
            style={{
                backgroundImage: `
                    linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
                backgroundAttachment: "fixed",
            }}
        >
            {/* Header */}
            <Navbar
                maxWidth="full"
                className="border-b border-default-100"
                classNames={{
                    base: "bg-background/80 backdrop-blur-md",
                }}
            >
                <NavbarContent justify="start">
                    <NavbarBrand>
                        <NavLink
                            to="/"
                            className="flex items-center gap-1 font-bold text-inherit text-xl"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            <Mic size={20} />
                            DMeter
                        </NavLink>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent className="hidden sm:flex gap-6" justify="center">
                    {navItems.map((item) => (
                        <NavbarItem key={item.name}>
                            <NavLink
                                to={item.href}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 text-sm font-semibold tracking-wide ${
                                        isRouteActive(item.href, isActive)
                                            ? "text-primary"
                                            : "text-foreground hover:text-primary"
                                    }`
                                }
                            >
                                <item.icon size={16} />
                                {item.name}
                            </NavLink>
                        </NavbarItem>
                    ))}
                </NavbarContent>

                <NavbarContent justify="end">
                    {/* User Menu or Sign In Button */}
                    <NavbarItem className="hidden sm:flex">
                        {isAuthenticated && user ? (
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <Button
                                        variant="flat"
                                        className="flex items-center gap-2"
                                        startContent={
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User size={16} className="text-primary" />
                                            </div>
                                        }
                                    >
                                        <span className="font-medium">{user.name}</span>
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="User menu">
                                    <DropdownSection showDivider>
                                        <DropdownItem
                                            key="profile-info"
                                            className="h-14 gap-2"
                                            textValue="Profile info"
                                            isReadOnly
                                        >
                                            <p className="font-semibold">{user.name}</p>
                                            <p className="text-sm text-default-500">{user.email}</p>
                                        </DropdownItem>
                                    </DropdownSection>
                                    <DropdownSection showDivider>
                                        <DropdownItem
                                            key="userdata"
                                            startContent={<User size={16} />}
                                            onPress={() => navigate("/userdata")}
                                        >
                                            Dashboard
                                        </DropdownItem>
                                        <DropdownItem
                                            key="account"
                                            startContent={<Settings size={16} />}
                                            onPress={() => navigate("/useraccount")}
                                        >
                                            My Account
                                        </DropdownItem>
                                    </DropdownSection>
                                    <DropdownSection>
                                        <DropdownItem
                                            key="logout"
                                            color="danger"
                                            startContent={<LogOut size={16} />}
                                            onPress={handleLogout}
                                        >
                                            Log Out
                                        </DropdownItem>
                                    </DropdownSection>
                                </DropdownMenu>
                            </Dropdown>
                        ) : (
                            <NavLink to="/login">
                                <Button color="primary" variant="flat" size="sm">
                                    Sign In
                                </Button>
                            </NavLink>
                        )}
                    </NavbarItem>

                    {/* Mobile hamburger button */}
                    <button
                        onClick={toggleMenu}
                        className="sm:hidden flex justify-center items-center w-10 h-10 cursor-pointer"
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </NavbarContent>
            </Navbar>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="sm:hidden fixed inset-0 top-16 z-50 bg-background">
                    <nav className="flex flex-col p-6 gap-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-3 rounded-lg ${
                                        isRouteActive(item.href, isActive)
                                            ? "bg-primary/10 text-primary"
                                            : "text-foreground hover:bg-default-100"
                                    }`
                                }
                            >
                                <item.icon size={22} className="text-current" />
                                <span className="text-lg font-semibold">{item.name}</span>
                            </NavLink>
                        ))}

                        {/* Mobile user section */}
                        <div className="border-t border-default-200 mt-4 pt-4">
                            {isAuthenticated && user ? (
                                <>
                                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{user.name}</p>
                                            <p className="text-sm text-default-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <NavLink
                                        to="/useraccount"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-4 px-4 py-3 rounded-lg text-foreground hover:bg-default-100"
                                    >
                                        <Settings size={22} />
                                        <span className="text-lg font-semibold">My Account</span>
                                    </NavLink>
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="flex items-center gap-4 px-4 py-3 rounded-lg text-danger hover:bg-danger/10 w-full"
                                    >
                                        <LogOut size={22} />
                                        <span className="text-lg font-semibold">Log Out</span>
                                    </button>
                                </>
                            ) : (
                                <NavLink
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white font-semibold"
                                >
                                    Sign In
                                </NavLink>
                            )}
                        </div>
                    </nav>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-8">{children}</main>

            {/* Footer */}
            <footer className="border-t border-default-100 py-6 px-8 bg-black">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-default-600">
                        © {new Date().getFullYear()} DMeter. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <NavLink to="/contact" className="text-sm text-default-600 hover:text-foreground">
                            Contact
                        </NavLink>
                    </div>
                </div>
            </footer>
        </div>
    );
}
