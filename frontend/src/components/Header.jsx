import { Link, NavLink } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNotifications } from "../context/NotificationContext.jsx";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { isSignedIn, user, signOut } = useAuth();
  const { notifications, unreadCount, markAllRead, clearNotifications } = useNotifications();
  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold tracking-wide transition ${
      isActive
        ? "bg-white text-blue-700 shadow"
        : "text-blue-900/70 hover:bg-white/80 hover:text-blue-700"
    }`;

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
  };

  const toggleNotifications = () => {
    if (!isNotificationOpen) {
      markAllRead();
    }
    setIsNotificationOpen((current) => !current);
  };

  const userLabel = user?.full_name || user?.email || "Guest User";

  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <nav className="glass-surface container mx-auto rounded-2xl px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-blue-900 font-bold text-xl flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                <path d="M12 12a10 10 0 0 0-5 8.66" />
                <path d="M22 12a10 10 0 0 1-8.66-5" />
              </svg>
              Lost & Found
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-8 flex items-center space-x-2">
              <NavLink to="/browse" className={navLinkClass}>
                Browse
              </NavLink>
              {isSignedIn && (
                <>
                <NavLink to="/add-item" className={navLinkClass}>
                  Post an Item
                </NavLink>
                <NavLink to="/my-listings" className={navLinkClass}>
                  My Listings
                </NavLink>
                <NavLink to="/my-claims" className={navLinkClass}>
                  My Claims
                </NavLink>{" "}
                {user?.role === 'admin' && (
                  <NavLink to="/admin" className={navLinkClass}>
                    Dashboard
                  </NavLink>
                )}
                <NavLink to="/admin/report" className={navLinkClass}>
                  Admin Report
                </NavLink>{" "}
                <div className="rounded-full bg-blue-50 px-3 py-2 text-xs text-blue-900">
                  {userLabel}
                </div>
                <button
                  type="button"
                  onClick={toggleNotifications}
                  className="relative rounded-full border border-blue-100 bg-white p-2 text-blue-700 transition hover:bg-blue-50"
                  aria-label="Open notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-white px-1.5 text-center text-xs font-bold text-blue-700">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleSignOut}
                  className="brand-button rounded-full px-4 py-2 text-sm font-semibold"
                >
                  Sign Out
                </button>
                </>
              )}
              {!isSignedIn && (
                <Link
                  to="/sign-in"
                  className="brand-button rounded-full px-4 py-2 text-sm font-semibold"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-blue-800 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden pb-3 space-y-1">
            <NavLink to="/browse" className={`${navLinkClass({})} block`}>
              Browse
            </NavLink>
            {isSignedIn && (
              <>
              <NavLink to="/add-item" className={`${navLinkClass({})} block`}>
                Post an Item
              </NavLink>
              <NavLink
                to="/my-listings"
                className={`${navLinkClass({})} block`}
              >
                My Listings
              </NavLink>
              <NavLink to="/my-claims" className={`${navLinkClass({})} block`}>
                My Claims
              </NavLink>
              {user?.role === 'admin' && (
                <NavLink to="/admin" className={`${navLinkClass({})} block`}>
                  Dashboard
                </NavLink>
              )}
              <NavLink to="/admin/report" className={`${navLinkClass({})} block`}>
                Admin Report
              </NavLink>
              <div className="px-3 pt-3 pb-1 text-sm text-blue-900/70">
                {userLabel}
              </div>
              <button
                onClick={handleSignOut}
                className="brand-button block w-full rounded-full px-3 py-2 text-center text-sm font-semibold"
              >
                Sign Out
              </button>
              </>
            )}
            {!isSignedIn && (
              <Link
                to="/sign-in"
                className="brand-button block w-full rounded-full px-3 py-2 text-center text-sm font-semibold"
              >
                Sign In
              </Link>
            )}
          </div>
        )}

        {isNotificationOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 px-4 pt-24" onClick={() => setIsNotificationOpen(false)}>
            <div
              className="glass-surface w-full max-w-lg rounded-2xl p-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Notifications</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearNotifications}
                    className="rounded-md px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                  >
                    Clear all
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNotificationOpen(false)}
                    className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                    aria-label="Close notifications"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {notifications.length === 0 ? (
                <p className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                  No notifications yet. Uploading or editing items will create dummy alerts here.
                </p>
              ) : (
                <div className="max-h-72 space-y-3 overflow-auto pr-1">
                  {notifications.map((entry) => (
                    <div key={entry.id} className="rounded-xl border border-blue-100 bg-blue-50/70 p-3">
                      <p className="text-sm font-medium text-slate-700">{entry.message}</p>
                      <p className="mt-1 text-xs text-slate-500">{new Date(entry.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
