export interface Size2D {
  width: number;
  height: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

export default async function autoClipPath(
  image: HTMLImageElement,
  imageSize: Size2D,
  options?: {
    shift: Coordinates;
    gap: number;
    distance: number;
  },
): Promise<{ clipPath: Coordinates[]; time: number }> {
  const { width, height } = imageSize;

  const shift = options && "shift" in options ? options.shift : { x: 0, y: 0 };
  const gap = options && "gap" in options ? options.gap : 0;
  const distance =
    options && "distance" in options ? options.distance : Infinity;

  const t = performance.now();

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d")!;

  try {
    ctx.drawImage(
      image,
      -shift.x,
      -shift.y,
      width,
      height,
      0,
      0,
      width,
      height,
    );

    return new Promise((resolve) => {
      resolve({
        clipPath: generateClipPathForNonTransparentEdges(
          ctx.getImageData(0, 0, width, height),
          gap,
          distance,
        ),
        time: performance.now() - t,
      });
    });
  } catch (e) {
    throw new Error(e);
  }
}

function generateConvexHull(points: Coordinates[]): Coordinates[] {
  if (points.length <= 3) {
    return points;
  }

  const getOrientation = (
    p: Coordinates,
    q: Coordinates,
    r: Coordinates,
  ): number => {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    if (val === 0) return 0;

    return val > 0 ? 1 : 2;
  };

  const sortByPolarAngle = (a: Coordinates, b: Coordinates): number => {
    const orientation = getOrientation(points[0], a, b);

    if (orientation === 0) {
      return (
        Math.hypot(a.x - points[0].x, a.y - points[0].y) -
        Math.hypot(b.x - points[0].x, b.y - points[0].y)
      );
    }

    return orientation === 2 ? -1 : 1;
  };

  points.sort(sortByPolarAngle);

  const stack: Coordinates[] = [];
  stack.push(points[0]);

  for (let i = 2; i < points.length; i++) {
    let top = stack.length - 1;

    while (
      top >= 1 &&
      getOrientation(stack[top - 1], stack[top], points[i]) !== 2
    ) {
      stack.pop();
      top = stack.length - 1;
    }

    stack.push(points[i]);
  }

  return stack;
}

function crossProduct(
  p1: Coordinates,
  p2: Coordinates,
  p3: Coordinates,
): number {
  return (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
}
function distance(p1: Coordinates, p2: Coordinates): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

function expandConvexHull(
  convexHull: Coordinates[],
  gap: number,
  minDistanceBetweenPoints: number,
): Coordinates[] {
  const expandedHull: Coordinates[] = [];

  function addPointToHull(point: Coordinates) {
    if (
      expandedHull.length === 0 ||
      distance(point, expandedHull[expandedHull.length - 1]) >
        minDistanceBetweenPoints
    ) {
      expandedHull.push({
        x: Math.round(point.x),
        y: Math.round(point.y),
      });
    }
  }

  for (let i = 0; i < convexHull.length; i++) {
    const currentPoint = convexHull[i];
    const nextPoint = convexHull[(i + 1) % convexHull.length];

    const dx = nextPoint.x - currentPoint.x;
    const dy = nextPoint.y - currentPoint.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;

    const expandedCurrentPoint: Coordinates = {
      x: currentPoint.x + unitY * gap,
      y: currentPoint.y - unitX * gap,
    };
    const expandedNextPoint: Coordinates = {
      x: nextPoint.x + unitY * gap,
      y: nextPoint.y - unitX * gap,
    };

    addPointToHull(expandedCurrentPoint);

    let j = expandedHull.length;
    while (
      j >= 2 &&
      crossProduct(
        expandedHull[j - 2],
        expandedHull[j - 1],
        expandedNextPoint,
      ) <= 0
    ) {
      expandedHull.pop();
      j--;
    }

    if (i !== convexHull.length - 1) addPointToHull(expandedNextPoint);
  }

  return expandedHull;
}

function generateClipPathForNonTransparentEdges(
  imageData: ImageData,
  gap: number,
  minDistanceBetweenPoints: number,
): Coordinates[] {
  const { width, height, data } = imageData;

  const isOpaque = (x: number, y: number): boolean => {
    const alpha = data[(y * width + x) * 4 + 3];

    return alpha > 1;
  };

  const edgePoints: Coordinates[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (isOpaque(x, y)) {
        edgePoints.push({ x, y });
      }
    }
  }

  const convexHull = generateConvexHull(edgePoints);

  return expandConvexHull(convexHull, gap, minDistanceBetweenPoints);
}
