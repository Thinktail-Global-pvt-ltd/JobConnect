import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import fullLogo from "../assets/Jobrito full logo.png";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;
    const currentHash = location.hash;

    const navItems = [
        { 
            label: "Find Job", 
            href: "/jobs", 
            active: currentPath === "/jobs" 
        },
        { 
            label: "Talent", 
            href: "/#talent", 
            active: currentPath === "/" && (currentHash === "#talent" || !currentHash) 
        },
        { 
            label: "Find Talent", 
            href: "/#find-talent", 
            active: currentPath === "/" && currentHash === "#find-talent" 
        },
    ];

    // Smooth scroll for hash links
    const handleNavClick = (href, e) => {
        if (href.startsWith("/#")) {
            const targetId = href.split("#")[1];
            if (currentPath === "/") {
                e.preventDefault();
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                    // Update URL hash without standard page jump
                    window.history.pushState(null, null, href);
                }
                setMenuOpen(false);
            }
        } else {
            setMenuOpen(false);
        }
    };

    // Auto scroll on initial page load if hash exists
    useEffect(() => {
        if (currentHash && currentPath === "/") {
            const id = currentHash.replace("#", "");
            const element = document.getElementById(id);
            if (element) {
                const timer = setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 300);
                return () => clearTimeout(timer);
            }
        }
    }, [currentHash, currentPath]);

    // Prevent background page scrolling when mobile menu drawer is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#efe0d6] bg-white" style={{ backgroundColor: "#ffffff" }}>
            <div className="mx-auto flex h-16 max-w-[1160px] items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
                {/* Logo - Aspect ratio preserved by explicit square height/width + object-contain */}
                <Link to="/" className="flex items-center">
                    <img
                        src={fullLogo}
                        alt="Jobrito"
                        className="h-20 w-20 sm:h-20 sm:w-20 lg:h-24 lg:w-24 object-contain transition-transform duration-300 hover:scale-[1.02]"
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-12 lg:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.href}
                            onClick={(e) => handleNavClick(item.href, e)}
                            className={`relative text-[16px] font-medium tracking-wide transition-all duration-300 py-1.5 ${
                                item.active
                                    ? "text-[#00284C] border-b-2 border-[#00284C] font-bold"
                                    : "text-[#43474F] hover:text-[#00284C]"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    {/* Join Button (Desktop - Deep Blue color matched) */}
                    <div className="hidden lg:flex items-center">
                        <Link
                            to="/jobs"
                            className="inline-flex items-center justify-center rounded-lg bg-[#00284C] w-[161px] h-[48px] text-[16px] font-medium text-white shadow-sm hover:bg-[#001c36] hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Join Now
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="lg:hidden text-[#00284C] hover:text-[#F57F20] transition-colors duration-300 p-2"
                        aria-label="Open Menu"
                    >
                        <Menu size={28} />
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Overlay - Rendered conditionally for absolute color reliability */}
            {menuOpen && (
                <div
                    className="fixed inset-0 lg:hidden"
                    style={{ backgroundColor: "rgba(0, 40, 76, 0.45)", zIndex: 9998 }}
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Mobile Drawer Menu - Animates on menuOpen toggle with solid white background */}
            <div
                className={`fixed right-0 top-0 bottom-0 w-[300px] max-w-[80vw] shadow-2xl p-6 flex flex-col lg:hidden transition-transform duration-300 ease-in-out border-l border-[#efe0d6] ${
                    menuOpen ? "translate-x-0" : "translate-x-full"
                }`}
                style={{ backgroundColor: "#ffffff", zIndex: 9999 }}
            >
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-6 border-b border-[#efe0d6]">
                    <img
                        src={fullLogo}
                        alt="Jobrito"
                        className="h-10 w-10 object-contain"
                    />
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="text-[#00284C] hover:text-[#F57F20] transition-colors duration-300 p-1"
                        aria-label="Close Menu"
                    >
                        <X size={26} />
                    </button>
                </div>

                {/* Nav Links in drawer */}
                <nav className="flex flex-col gap-6 py-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.href}
                            onClick={(e) => handleNavClick(item.href, e)}
                            className={`text-base font-bold tracking-wide transition-colors duration-300 py-2 border-b border-transparent ${
                                item.active
                                    ? "text-[#00284C] border-b-[#00284C]"
                                    : "text-[#43474F] hover:text-[#00284C]"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Join Now in drawer - Deep Blue color matched */}
                <div className="mt-auto pt-6 border-t border-[#efe0d6]">
                    <Link
                        to="/jobs"
                        onClick={() => setMenuOpen(false)}
                        className="flex w-full items-center justify-center rounded-lg bg-[#00284C] py-3.5 text-center font-bold text-white shadow-sm hover:bg-[#001c36] transition-all duration-300"
                    >
                        Join Now
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
