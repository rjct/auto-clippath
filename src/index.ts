import autoClipPath from "./core";

declare global {
  interface Window {
    autoClipPath: typeof autoClipPath;
  }
}

window.autoClipPath = window.autoClipPath || autoClipPath;
