export default function InterestGraph({ center, nodes }) {
  const safeNodes = (nodes || []).slice(0, 6)
  const width = 640
  const height = 360
  const cx = width / 2
  const cy = height / 2
  const radius = 128

  const points = safeNodes.map((_, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / Math.max(safeNodes.length, 1)
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    }
  })

  return (
    <div className="overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Interest graph connecting ${safeNodes.join(', ')} to ${center}`}
      >
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#7c8cff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c8cff" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>

        <circle cx={cx} cy={cy} r="150" fill="url(#coreGlow)" />

        {points.map((point, index) => (
          <line
            key={`edge-${safeNodes[index]}`}
            x1={cx}
            y1={cy}
            x2={point.x}
            y2={point.y}
            stroke="url(#edgeGrad)"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="graph-edge"
            style={{ animationDelay: `${index * 120}ms` }}
          />
        ))}

        <g className="graph-core">
          <circle cx={cx} cy={cy} r="46" fill="#12141f" stroke="#a5b4fc" strokeWidth="1.5" />
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#f8fafc"
            fontSize="12"
            fontWeight="700"
          >
            {wrapLabel(center, 16).map((line, i, arr) => (
              <tspan key={line} x={cx} dy={i === 0 ? `-${(arr.length - 1) * 7}` : 14}>
                {line}
              </tspan>
            ))}
          </text>
        </g>

        {points.map((point, index) => (
          <g key={safeNodes[index]} className="graph-node" style={{ animationDelay: `${180 + index * 90}ms` }}>
            <circle cx={point.x} cy={point.y} r="28" fill="#0e1018" stroke="#7c8cff" strokeWidth="1.2" />
            <text
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#e2e8f0"
              fontSize="10"
              fontWeight="600"
            >
              {wrapLabel(safeNodes[index], 12).map((line, i, arr) => (
                <tspan key={line} x={point.x} dy={i === 0 ? `-${(arr.length - 1) * 6}` : 12}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function wrapLabel(label, max) {
  const words = String(label || '').split(' ')
  const lines = []
  let current = ''
  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word
    if (next.length > max && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  })
  if (current) lines.push(current)
  return lines.slice(0, 3)
}
