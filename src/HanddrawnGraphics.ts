import UberNoise from "uber-noise";

import * as PIXI from "pixi.js";

declare module "pixi.js" {
  interface Graphics {
    wiggle: number | null;
    noise: UberNoise | null;
    maxSegmentLength: number;

    points: { position: PIXI.Point; draw: boolean }[] | null;

    stripes: {
      normal: PIXI.Point;
      distance: number;
      shift: number;
    }
  }
}


/**
 * calculate the intersection point of two lines
 *
 * @param aa start point of line a
 * @param ab end point of line a
 * @param ba start point of line b
 * @param bb end point of line b
 * @param output store the intersection point
 * @returns the intersection point or undefined
 */
export const lineIntersectsLine = (
  aa: PIXI.Point,
  ab: PIXI.Point,
  ba: PIXI.Point,
  bb: PIXI.Point,
  output: PIXI.Point | undefined = undefined
): PIXI.Point | undefined => {
  const a_dx = ab.x - aa.x;
  const a_dy = ab.y - aa.y;
  const b_dx = bb.x - ba.x;
  const b_dy = bb.y - ba.y;
  const s =
    (-a_dy * (aa.x - ba.x) + a_dx * (aa.y - ba.y)) /
    (-b_dx * a_dy + a_dx * b_dy);
  const t =
    (+b_dx * (aa.y - ba.y) - b_dy * (aa.x - ba.x)) /
    (-b_dx * a_dy + a_dx * b_dy);
  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    return output
      ? output.set(aa.x + t * (ab.x - aa.x), aa.y + t * (ab.y - aa.y))
      : new PIXI.Point(aa.x + t * (ab.x - aa.x), aa.y + t * (ab.y - aa.y));
  }
  return undefined;
};

Object.defineProperties(PIXI.Graphics.prototype, {
  wiggle: {
    value: 0,
    writable: true,
  },
  maxSegmentLength: {
    value: 10,
    writable: true,
  },
  noise: {
    value: null,
    writable: true,
  },
  points: {
    value: null,
    writable: true,
  },
  stripes: {
    value: null,
    writable: true,
  }
});

// Store references to the original methods
const originalMoveTo = PIXI.Graphics.prototype.moveTo;
const originalLineTo = PIXI.Graphics.prototype.lineTo;
const originalEllipse = PIXI.Graphics.prototype.ellipse;


function drawLineInside(start: PIXI.Point, normal: PIXI.Point, size: PIXI.Point, lines: PIXI.Point[], graphics: PIXI.Graphics) {
  let tangent = new PIXI.Point(normal.y, -normal.x);
  tangent.normalize();
  tangent.multiplyScalar(Math.max(size.y, size.x) * 100, tangent);

  let a = start.clone().add(tangent);
  let b = start.clone().add(tangent.multiplyScalar(-1));
  let p = intersects(lines, a, b);

  if (p.length == 2) {
    graphics.moveTo(p[0].x, p[0].y);
    graphics.lineTo(p[1].x, p[1].y);
    return true;
  }
  return false;
}


function intersects(lines: PIXI.Point[], a: PIXI.Point, b: PIXI.Point) {
  let points = [];
  for (let i = 0; i <  lines.length; i += 2) {
    let point = lineIntersectsLine(a, b, lines[i], lines[i + 1]);
    if (point) points.push(point);
  }
  return points;
}

PIXI.Graphics.prototype.lineTo = function (
  x: number,
  y: number,
): PIXI.Graphics {
  if (!this.wiggle || this.wiggle == 0) {
    return originalLineTo.call(this, x, y);
  }

  if (!this.noise)
    this.noise = new UberNoise({ scale: 1 / (this.maxSegmentLength ?? 1) });

  if (!this.points) this.points = [];

  let last: PIXI.Point;
  // get last point
  if (this.points.length === 0) {
    last = new PIXI.Point(0, 0);
  } else {
    last = this.points[this.points.length - 1].position;
  }

  // get distance between last point and new point
  const distance = Math.hypot(last.x - x, last.y - y);
  const segments = Math.ceil(distance / this.maxSegmentLength);

  for (let i = 0; i <= segments; i++) {
    const px = last.x + (x - last.x) * (i / segments);
    const py = last.y + (y - last.y) * (i / segments);

    let dx = this.noise.get(px, py) * this.wiggle * 0.5;
    let dy = this.noise.get(-px + 123, -py - 94.549) * this.wiggle * 0.5;

    this.points.push({
      position: new PIXI.Point(px + dx, py + dy),
      draw: true,
    });

    originalLineTo.call(this, px + dx, py + dy);
  }

  return this;
};

PIXI.Graphics.prototype.moveTo = function (
  x: number,
  y: number,
): PIXI.Graphics {
  if (!this.wiggle || this.wiggle == 0) {
    return originalMoveTo.call(this, x, y);
  }

  if (!this.noise)
    this.noise = new UberNoise({ scale: 1 / (this.maxSegmentLength ?? 1) });

  if (!this.points) this.points = [];
  let dx = this.noise.get(x, y) * this.wiggle * 0.5;
  let dy = this.noise.get(-x + 123, -y - 94.549) * this.wiggle * 0.5;

  this.points.push({ position: new PIXI.Point(x + dx, y + dy), draw: false });
  return originalMoveTo.call(this, x + dx, y + dy);
};

PIXI.Graphics.prototype.rect = function (
  x: number,
  y: number,
  width: number,
  height: number,
): PIXI.Graphics {
  this.moveTo(x, y);
  this.lineTo(x + width, y);
  this.lineTo(x + width, y + height);
  this.lineTo(x, y + height);
  this.lineTo(x, y);


  if(this.stripes) {
    let normal = this.stripes.normal;
    let distance = this.stripes.distance;
    let shift = this.stripes.shift;

    let lines = [new PIXI.Point(x, y), new PIXI.Point(x + width, y), 
      new PIXI.Point(x + width, y), new PIXI.Point(x + width, y + height),  
      new PIXI.Point(x + width, y + height), new PIXI.Point(x, y + height),  
      new PIXI.Point(x, y + height), new PIXI.Point(x, y)];

    let startA = new PIXI.Point(shift % distance, 0);
    let startB = startA.clone();

    // draw first line
    let drawn = drawLineInside(startA, normal, new PIXI.Point(width, height), lines, this);

    // move vector
    let move = normal.multiplyScalar(distance);

    let moveNegative = move.multiplyScalar(-1);

    while (drawn) {
      startA.add(move, startA);
      startB.add(moveNegative, startB);
      drawn = drawLineInside(startA, normal, new PIXI.Point(width, height), lines, this);
      drawn = drawLineInside(startB, normal, new PIXI.Point(width, height), lines, this) || drawn;
    }
  }
  return this;
};

PIXI.Graphics.prototype.circle = function (
  x: number,
  y: number,
  radius: number,
): PIXI.Graphics {
  return this.ellipse(x, y, radius, radius);
};

PIXI.Graphics.prototype.ellipse = function (
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
): PIXI.Graphics {
  if (!this.wiggle || this.wiggle == 0) {
    return originalEllipse.call(this, x, y, radiusX, radiusY);
  }
  const circumference =
    Math.PI * ((3 / 2) * (radiusX + radiusY) - Math.sqrt(radiusX * radiusY));
  const segments = Math.ceil(circumference / this.maxSegmentLength);
  const step = (Math.PI * 2) / segments;

  for (let i = 0; i < Math.PI * 2; i += step) {
    const px = x + Math.cos(i) * radiusX;
    const py = y + Math.sin(i) * radiusY;

    if (i === 0) {
      this.moveTo(px, py);
    } else {
      this.lineTo(px, py);
    }
  }
  return this.closePath();
};
