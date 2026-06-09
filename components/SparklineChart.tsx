interface SparklineProps {
  data: number[];
  positive?: boolean;
  width?: number;
  height?: number;
}

export function SparklineChart({
  data,
  positive = true,
  width = 80,
  height = 28,
}: SparklineProps) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const color = positive ? "var(--red)" : "var(--green)";
  const glowColor = positive
    ? "rgba(239, 68, 68, 0.35)"
    : "rgba(16, 185, 129, 0.35)";

  const id = `spark-grad-${data.join("-")}-${positive}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={glowColor} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <polyline
        fill={`url(#${id})`}
        stroke="none"
        points={`0,${height} ${points} ${width},${height}`}
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
