import { Point } from "@visx/point";
import { off } from "process";

export const genAngles = (length: number) =>
  [...new Array(length + 1)].map((_, i) => ({
    angle: i * (360 / length),
  }));

export const genPoints = (length: number, radius: number) => {
  const step = (Math.PI * 2) / length;
  const offset = (length % 2 !== 0 ? Math.PI / length : 0)
  return [...new Array(length)].map((_, i) => new Point({
    x: radius * Math.sin(i * step + offset),
    y: radius * Math.cos(i * step + offset),
  }));
};

export const genPolygonPoints = <Datum>(
  dataArray: Datum[],
  axisCount: number,
  scale: (n: number) => number,
  getValue: (d: Datum) => number,
) => {
  const step = (Math.PI * 2) / axisCount;
  const offset = (axisCount % 2 !== 0 ? Math.PI / axisCount : 0)
  const points: { x: number; y: number }[] = new Array(dataArray.length).fill({ x: 0, y: 0 });
  const pointString: string = new Array(dataArray.length + 1).fill('').reduce((res, _, i) => {
    if (i > dataArray.length) return res;
    const xVal = scale(getValue(dataArray[i - 1])) * Math.sin(i * step + offset);
    const yVal = scale(getValue(dataArray[i - 1])) * Math.cos(i * step + offset);
    points[i - 1] = { x: xVal, y: yVal };
    res += `${xVal},${yVal} `;
    return res;
  });

  return { points, pointString };
}
