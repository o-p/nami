const svgStyle = { position: 'absolute' }

export default function PrizeText({
  text,
  size,
}: {
  text: string
  size: number
}) {
  return (
    <svg
      viewBox="0 -50 500 450"
      width={size}
      height={size}
      // @ts-ignore
      style={svgStyle}
    >
      <defs>
        <linearGradient
          id="rainbow"
          x1="10%"
          x2="100%"
          y1="10%"
          y2="80%"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FF1493" offset="0%" />
          <stop stop-color="#0000FF" offset="37%" />
          <stop stop-color="#FF8C00" offset="100%" />
        </linearGradient>
      </defs>
      <path
        id="curve"
        d="M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97"
        fill="none"
      />
      <text
        stroke="#FF68"
        strokeWidth={4}
        width="500"
        fontWeight={800}
        fontSize={80}
        fill="url(#rainbow)"
      >
        <textPath xlinkHref="#curve">
          {text}
        </textPath>
      </text>
    </svg>
  )
}
