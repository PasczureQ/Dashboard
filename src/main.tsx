import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Hide loading screen
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loading-screen")?.classList.add("hide");
  }, 400);
});
