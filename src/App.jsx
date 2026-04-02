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

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      <div className={`app-shell ${sidebarCollapsed ? "app-shell-collapsed" : ""} ${loading ? "app-shell-hidden" : "app-shell-ready"}`}>
        <div className="mobile-bar">
          <button className="burger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
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
