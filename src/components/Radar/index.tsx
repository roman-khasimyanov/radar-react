import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { getPersonaInitialsColor, LabelBase } from '@fluentui/react';
import { Group } from '@visx/group';
import { Line, LineRadial } from '@visx/shape';
import { genAngles, genPoints, genPolygonPoints } from './utils';
import './style';
import { scaleLinear } from '@visx/scale';
import { Point } from '@visx/point';

export type RadarProps = PropsWithChildren<{
  data: Array<{
    key: string;
    values: Array<{
      key: string;
      label: string;
      level: number;
    }>;
  }>;
}>;

export const Radar = ({ data }: RadarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const resetSize = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
      setContainerHeight(containerRef.current.clientHeight);
    }
  };
  const nullPoint = new Point({ x: 0, y: 0 });
  useEffect(() => {
    resetSize();
    const onResize = () => {
      resetSize();
    }
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, [containerRef.current]);

  const dataMaxLevel = data.reduce((prev, cur) => {
    cur.values.forEach((v) => {
      if (v.level > prev) {
        prev = v.level;
      };
    });
    return prev;
  }, 0);

  const dataDomains = data.reduce((prev, cur) => {
    cur.values.forEach((v) => {
      const dKeys = prev.map((p) => p.key);
      if (!(dKeys.includes(v.key))) {
        prev = [
          ...prev,
          {
            key: v.key,
            label: v.label,
          },
        ];
      };
    });
    return prev;
  }, [] as Array<{
    key: string;
    label: string;
  }>);



  const radius = Math.min(containerWidth, containerHeight) / 2;
  const dataDomainPoints = genPoints(dataDomains.length, radius);
  const yScale = scaleLinear<number>({
    range: [0, radius],
    domain: [0, dataMaxLevel],
  });
  return (
    <div className="radar-container" ref={containerRef}>
      <svg width={containerWidth} height={containerHeight}>
        <rect fill="#ffffff" width={containerWidth} height={containerHeight} fx={14} />
        <Group top={containerHeight / 2} left={containerWidth / 2}>
          {
            [
              ...new Array(dataMaxLevel).fill(1).map((_, i) => {
                console.log(i);
                return (
                  <LineRadial
                    key={`web-level-${i}`}
                    data={genAngles(dataDomains.length)}
                    angle={(d) => scaleLinear<number>({
                      range: [0, Math.PI * 2],
                      domain: [360, 0],
                    })(d.angle) ?? 0}
                    radius={((i + 1) * radius) / dataMaxLevel}
                    fill="none"
                    stroke="#a1a1a1"
                    strokeWidth={2}
                    strokeOpacity={0.8}
                    strokeLinecap="round"
                  />
                );
              })
            ]
          }
          {dataDomainPoints.map((_, i) => (
            <Line key={`radar-line-${i}`} from={nullPoint} to={dataDomainPoints[i]} stroke="#a1a1a1" />
          ))}
          {
            data.map((d) => {

              const polygonPoints = genPolygonPoints(
                d.values,
                dataDomains.length,
                (x) => yScale(x),
                (d) => d.level,
              );
              return (
                <>
                  <polygon
                    points={polygonPoints.pointString}
                    fill={getPersonaInitialsColor({ text: d.key })}
                    fillOpacity={0.4}
                    stroke={getPersonaInitialsColor({ text: d.key })}
                    strokeWidth={1}
                    className="radar-polygon"
                  />
                  {polygonPoints.points.map((point, i) => (
                    <circle
                      key={`radar-point-${i}`}
                      cx={point.x}
                      cy={point.y}
                      r={3}
                      fill={getPersonaInitialsColor({ text: d.key })}
                    />
                  ))}
                </>
              )
            })
          }
        </Group>
      </svg>
    </div>
  );
};
