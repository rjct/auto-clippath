import autoClipPath from "./core";
declare global {
    interface Window {
        autoClipPath: typeof autoClipPath;
    }
}
