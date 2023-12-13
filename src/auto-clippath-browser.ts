import autoClipPath from "./auto-clippath";

declare global {
  interface Window {
    autoClipPath: typeof autoClipPath;
  }
}

window.autoClipPath = window.autoClipPath || autoClipPath;
