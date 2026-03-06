import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Hide loading screen as soon as React mounts
const hideLoader = () => {
  const el = document.getElementById("loading-screen");
  if (el) {
    el.classList.add("hide");
    setTimeout(() => el.remove(), 500);
  }
};

// Hide immediately — React has mounted
hideLoader();
