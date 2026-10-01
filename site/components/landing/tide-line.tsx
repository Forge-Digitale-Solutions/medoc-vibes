type TideLineProps = {
  color: string;
  className?: string;
};

function wavePath(width: number, period: number, amp: number, base: number) {
  let d = `M0 ${base}`;
  for (let x = 0; x < width; x += period) {
    d += ` q${period / 4} ${-amp} ${period / 2} 0 t${period / 2} 0`;
  }
  return d;
}

export function TideLine({ color, className = "" }: TideLineProps) {
  return (
    <div className={`h-6 overflow-hidden ${className}`.trim()} aria-hidden>
      <svg
        viewBox="0 0 2880 24"
        preserveAspectRatio="none"
        className="mv-drift-tide block h-6 w-[200%]"
      >
        <path
          d={wavePath(2880, 160, 9, 12)}
          fill="none"
          stroke={color}
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
