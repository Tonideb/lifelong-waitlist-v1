import React, { useEffect, useState } from 'react';

interface SparkleProps {
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}

const DEFAULT_COLOR = '#fe240b';
const DEFAULT_SIZE = 10;

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const Sparkle: React.FC<SparkleProps> = ({
  color = DEFAULT_COLOR,
  size = DEFAULT_SIZE,
  style,
}) => {
  const path = `M${size / 2} 0L${size / 1.5} ${size / 1.5}L${size} ${
    size / 2
  }L${size / 1.5} ${size / 1.5}L${size / 2} ${size}L${size / 2.5} ${
    size / 1.5
  }L0 ${size / 2}L${size / 2.5} ${size / 1.5}Z`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill={color}
      style={{
        position: 'absolute',
        animation: 'sparkle-fade-scale 0.7s ease-in-out forwards',
        transform: `rotate(${random(0, 360)}deg) scale(${random(0.5, 1)})`,
        ...style,
      }}
    >
      <path d={path} />
    </svg>
  );
};

interface SparkleGroupProps {
  x: number;
  y: number;
}

export const SparkleGroup: React.FC<SparkleGroupProps> = ({ x, y }) => {
  const [sparkles] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      size: random(10, 20),
      style: {
        top: y + random(-20, 20),
        left: x + random(-20, 20),
        position: 'fixed' as const,
        zIndex: 9999,
      },
    }))
  );

  return (
    <>
      {sparkles.map((sparkle) => (
        <Sparkle
          key={sparkle.id}
          size={sparkle.size}
          style={sparkle.style}
        />
      ))}
    </>
  );
}; 