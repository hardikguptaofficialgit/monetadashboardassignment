import { useStore } from "../store/useStore";
import { Finance, Interfaces } from "doodle-icons";
import AppIcon from "./AppIcon";

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { activePage, setActivePage, role, setRole, theme, toggleTheme } = useStore();

  // switch page and close the mobile drawer after navigation
  const go = (id) => {
    setActivePage(id);
    onClose?.();
  };

  // keep sidebar links in one place so the menu stays easy to update
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Interfaces.Dashboard },
    { id: "transactions", label: "Transactions", icon: Finance.Bill },
    { id: "insights", label: "Insights", icon: Interfaces.Bulb },
  ];

  const getIconColor = (isActive = false) => (isActive ? "var(--sidebar-icon-strong)" : "var(--sidebar-icon)");

  return (
    <>
      <div className={`sidebar-shade ${isOpen ? "show" : ""}`} onClick={onClose} />

      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isOpen ? "open" : ""} theme-${theme}`}>
        <div className="brand">
          <div className="brand-main">
            <div className="brand-text brand-text-only" aria-label="Moneta">
              <h2>Moneta</h2>
              <span>Money Clarity</span>
            </div>
          </div>
          <button
            className="brand-action"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-pressed={isCollapsed}
            data-sidebar="trigger"
            type="button"
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
              aria-hidden="true"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d={isCollapsed ? "M14 3v18" : "M9 3v18"} />
            </svg>
            <span className="sr-only">{isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}</span>
          </button>
        </div>

        <div className="nav-group">
          <span className="nav-label">Menu</span>
          {navItems.map(({ id, label, icon: Icon }) => {
            // highlight the current page in the sidebar
            const isActive = activePage === id;
            const iconColor = getIconColor(isActive);
            
            return (
              <button
                key={id}
                className={`nav-btn ${isActive ? "active" : ""}`}
                onClick={() => go(id)}
                title={isCollapsed ? label : undefined}
                type="button"
              >
                <AppIcon icon={Icon} size={18} color={iconColor} opacity={1} />
                <span className="nav-btn-text">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="sidebar-foot">
          
          <div className="theme-row" onClick={toggleTheme} role="button" tabIndex={0} aria-label="Toggle theme" title={isCollapsed ? "Toggle theme" : undefined}>
            <AppIcon icon={Interfaces.Sun} size={18} color={getIconColor(false)} opacity={1} />
            <span>{theme === "light" ? "Light Mode" : "Dark Mode"}</span>
            <div className={`theme-switch ${theme === "dark" ? "toggled" : ""}`}>
              <div className="theme-dot" />
            </div>
          </div>

          <div className="role-pills">
            <button className={`role-pill ${role === "viewer" ? "on" : ""}`} onClick={() => setRole("viewer")}>
              Viewer
            </button>
            <button className={`role-pill ${role === "admin" ? "on" : ""}`} onClick={() => setRole("admin")}>
              Admin
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
