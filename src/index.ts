import { generateClipPath } from "./core";

declare global {
  interface Window {
    autoClipPath: typeof generateClipPath;
  }
}

window.autoClipPath = window.autoClipPath || generateClipPath;
