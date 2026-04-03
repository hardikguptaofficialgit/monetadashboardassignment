import { useEffect } from "react";

const LOADER_DURATION = 3450;

const LoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    // Hide the splash screen after the intro animation finishes
    const timer = window.setTimeout(() => {
      onComplete?.();
    }, LOADER_DURATION);

    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="loading-screen" aria-label="Loading Moneta">
      {/* Inner wrapper added for perfect Flexbox centering */}
      <div className="loading-content">
        

        <svg 
          className="moneta-loader" 
          viewBox="0 0 760 280" 
          role="img" 
          aria-labelledby="moneta-loader-title"
        >
          <title id="moneta-loader-title">Moneta loading animation</title>
          <defs>
            <linearGradient id="moneta-underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c7682f" />
              <stop offset="100%" stopColor="#f1bc61" />
            </linearGradient>
          </defs>

          <text x="50%" y="138" textAnchor="middle" className="moneta-script moneta-stroke">
            Moneta
          </text>
          <text x="50%" y="138" textAnchor="middle" className="moneta-script moneta-fill">
            Moneta
          </text>

          <path className="moneta-underline" d="M176 198C250 230 508 232 585 188" />
        </svg>

      </div>
    </div>
  );
};

export default LoadingScreen;