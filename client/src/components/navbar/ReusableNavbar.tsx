import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export interface NavLinkItem {
  name: string;
  url: string;
  end?: boolean; // exact match for the active style (use on Home / Dashboard)
}

export interface NavbarUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface ReusableNavbarProps {
  brand: string;
  homeUrl: string;
  links: NavLinkItem[];
  user: NavbarUser | null; // null = not signed in
  onLogout: () => void;
  authUrl: string;
  profileUrl?: string;
  badge?: string; // e.g. "Admin"
}

const desktopLink = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
  }`;

const mobileLink = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
  }`;

function ReusableNavbar({
  brand,
  homeUrl,
  links,
  user,
  onLogout,
  authUrl,
  profileUrl,
  badge,
}: ReusableNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close the user dropdown when clicking outside of it
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  const handleLogout = () => {
    setMenuOpen(false);
    setMobileOpen(false);
    onLogout();
    navigate(authUrl);

    
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to={user ? homeUrl : authUrl} className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">{brand}</span>
          {badge && (
            <span className="rounded bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white">
              {badge}
            </span>
          )}
        </Link>

        {/* Desktop links */}
        {user && (
          <div className="hidden items-center gap-6 md:flex">
            {links.map((item) => (
              <NavLink key={item.url} to={item.url} end={item.end} className={desktopLink}>
                {item.name}
              </NavLink>
            ))}
          </div>
        )}

        {/* Desktop right side */}
        <div className="hidden md:block">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white"
                aria-label="Open user menu"
                aria-expanded={menuOpen}
              >
                {initial}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-2">
                    <p className="truncate text-sm font-semibold capitalize text-gray-900">
                      {user.name}
                    </p>
                    {user.email && (
                      <p className="truncate text-xs text-gray-500">{user.email}</p>
                    )}
                  </div>
                  {profileUrl && (
                    <Link
                      to={profileUrl}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={authUrl}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile toggle (inline SVG, no icon library needed) */}
        <button
          className="p-2 text-gray-600 md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="space-y-1 border-t border-gray-200 px-4 py-3 md:hidden">
          {user ? (
            <>
              {links.map((item) => (
                <NavLink
                  key={item.url}
                  to={item.url}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={mobileLink}
                >
                  {item.name}
                </NavLink>
              ))}
              {profileUrl && (
                <Link
                  to={profileUrl}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Profile
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to={authUrl}
              onClick={() => setMobileOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default ReusableNavbar;