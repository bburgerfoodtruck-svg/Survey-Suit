import { useEffect, useState } from "react";
import VentilationApp from "./VentilationApp.jsx";
import HhsrsApp from "./HhsrsApp.jsx";
import "./styles.css";

const THEME_KEY = "vd_theme_v1";

function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      className="btn ghost"
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Toggle theme"
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}

export default function App() {
  const [mode, setMode] = useState("home"); // home | ventilation | hhsrs
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") setTheme(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }, [theme]);

  const headerRight = (
    <div className="actions">
      <ThemeToggle theme={theme} setTheme={setTheme} />
      {mode !== "home" ? (
        <button className="btn secondary" type="button" onClick={() => setMode("home")}>
          ← Change survey
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="container">
      {mode === "home" ? (
        <div className="card">
          <div className="topbar">
            <div>
              <div className="kicker">Survey suite</div>
              <div className="h1">Select a survey type</div>
              <div className="small">
                Choose what you’re inspecting today. Each survey has its own workflow and PDF output.
              </div>
            </div>
            <div className="actions">
              <ThemeToggle theme={theme} setTheme={setTheme} />
            </div>
          </div>

          <div className="hr" />

          <div className="row">
            <div className="field" style={{ gridColumn: "span 6" }}>
              <div className="card" style={{ background: "linear-gradient(180deg,#ffffff,#f8fafc)" }}>
                <div className="h2">Ventilation / Damp / Mould</div>
                <div className="small" style={{ marginTop: 6 }}>
                  Room-by-room capture with optional windows/doors/conditions, wet-room ventilation checks and evidence photos.
                  Generates a client PDF.
                </div>
                <div style={{ height: 12 }} />
                <button className="btn" onClick={() => setMode("ventilation")}>Start Ventilation Survey</button>
              </div>
            </div>

            <div className="field" style={{ gridColumn: "span 6" }}>
              <div className="card" style={{ background: "linear-gradient(180deg,#ffffff,#f8fafc)" }}>
                <div className="h2">HHSRS Calculator</div>
                <div className="small" style={{ marginTop: 6 }}>
                  29 hazard list with likelihood/outcome scoring and a summary report PDF.
                  (You can swap in your exact model later.)
                </div>
                <div style={{ height: 12 }} />
                <button className="btn" onClick={() => setMode("hhsrs")}>Start HHSRS Survey</button>
              </div>
            </div>
          </div>
        </div>
      ) : mode === "ventilation" ? (
        <>
          <div style={{ height: 0 }} />
          <VentilationApp />
          <div style={{ height: 12 }} />
          <div className="card">{headerRight}</div>
        </>
      ) : (
        <>
          {headerRight}
          <div style={{ height: 12 }} />
          <HhsrsApp headerRight={null} />
        </>
      )}

      <div style={{ height: 16 }} />
      <div className="small" style={{ textAlign: "center", opacity: 0.85 }}>
        Survey Suite • v1.2 • Switch surveys from the home screen • Theme: {theme}
      </div>
    </div>
  );
}
