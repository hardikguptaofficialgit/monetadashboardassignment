import { useEffect, useState } from "react";
import { useStore } from "./store/useStore";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import TransactionModal from "./components/TransactionModal";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const { theme, initializeApp } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // keep the document theme in sync with the app setting
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    // load any saved mock data when the app starts
    void initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    // prevent the page from scrolling underneath the mobile drawer
    document.body.style.overflow = sidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      <div className={`app-shell ${sidebarCollapsed ? "app-shell-collapsed" : ""} ${loading ? "app-shell-hidden" : "app-shell-ready"}`}>
        <div className="mobile-bar">
          <button
            className={`burger ${sidebarOpen ? "open" : ""}`}
            onClick={() => setSidebarOpen((current) => !current)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-pressed={sidebarOpen}
            type="button"
          >
            {sidebarOpen ? (
              <svg className="burger-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3.5" y="4.5" width="17" height="15" rx="4.5" className="burger-frame" />
                <path d="M8.5 8.5 15.5 15.5" className="burger-line" />
                <path d="M15.5 8.5 8.5 15.5" className="burger-line" />
                <circle cx="17.5" cy="7.5" r="1.1" className="burger-dot" />
              </svg>
            ) : (
              <svg className="burger-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3.5" y="4.5" width="17" height="15" rx="4.5" className="burger-frame" />
                <path d="M8 8.5H16" className="burger-line" />
                <path d="M8 12H14.5" className="burger-line" />
                <path d="M8 15.5H16" className="burger-line" />
                <circle cx="17.5" cy="12" r="1.25" className="burger-dot" />
              </svg>
            )}
          </button>
          <div className="mobile-wordmark" aria-label="Moneta">
            <span>Moneta</span>
          </div>
          <div style={{ width: 36 }} />
        </div>

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
        />

        <main className={`main-area ${sidebarCollapsed ? "main-area-collapsed" : ""}`}>
          <Dashboard />
        </main>

        <TransactionModal />
      </div>
    </>
  );
}

export default App;
