export interface Size2D {
    width: number;
    height: number;
}
export interface Coordinates {
    x: number;
    y: number;
}
export default function autoClipPath(image: HTMLImageElement, imageSize: Size2D, options?: {
    shift: Coordinates;
    gap: number;
    distance: number;
}): Promise<{
    clipPath: Coordinates[];
    time: number;
}>;
