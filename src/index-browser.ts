import autoClipPath from "./index";

declare global {
  interface Window {
    autoClipPath: typeof autoClipPath;
  }
}

window.autoClipPath = window.autoClipPath || autoClipPath;
