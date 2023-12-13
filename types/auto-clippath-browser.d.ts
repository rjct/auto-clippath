import autoClipPath from "./auto-clippath";
declare global {
  interface Window {
    autoClipPath: typeof autoClipPath;
  }
}
