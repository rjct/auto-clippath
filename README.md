# auto-clippath
![GitHub package.json version](https://img.shields.io/github/package-json/v/rjct/auto-clippath)
[![NPM](https://img.shields.io/badge/npm-auto--clippath-blue)](https://www.npmjs.com/package/auto-clippath)

TypeScript-based library for generating CSS/SVG clipPath coordinates from images with transparent backgrounds.

### Demo
- https://rjct.github.io/auto-clippath

### TypeScript Usage
To use the library with TypeScript, you need to install the module using npm:
``
npm install auto-clippath
``

Or using Yarn:
``
yarn add auto-clippath
``
Then you can import any function as follows:

```typescript
import { autoClipPath } from 'auto-clippath';

const { clipPath } = await autoClipPath(
    HTMLImageElement,
    { width: 100, height: 200 },
    
    // Optional
    { 
        gap: 5,                 // Additional space around the detected area
        distance: 5,            // Minimal distance between path points
        shift: { x: 5, y: 5 }   // Shift detected area, useful for sprites
    }
); // returns array of path points { x: number, y: number }[]
```

### Browser Usage
The library can also be used directly in browsers without TypeScript. First, download the auto-clippath.min.js file from the GitHub repository. Then use the `autoClipPath` or `window.autoClipPath`.

```html
<script src="auto-clippath.min.js"></script>
<script>
    const { clipPath } = await autoClipPath(
        HTMLImageElement, 
        { width: 100, height: 200 },

        // Optional
        {
            gap: 5,                 // Additional space around the detected area
            distance: 5,            // Minimal distance between path points
            shift: { x: 5, y: 5 }   // Shift detected area, useful for sprites
        }
    );
    
    console.log(clipPath);  // Array of path points { x: number, y: number }[]
```
