
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/dark-mode-v2.css";

console.log("🚀 Starting React app...");
try {
  const root = document.getElementById("root");
  if (!root) throw new Error("Root element not found");

  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("✅ App rendered");
} catch (e) {
  console.error("❌ Error running app:", e);
}
