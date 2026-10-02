type Props = {
  fill: string
  flip?: boolean
  className?: string
}

/** Organic river-wave edge used to pour one section into the next. */
export default function Wave({ fill, flip, className = '' }: Props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`block w-full h-[clamp(40px,7vw,110px)] ${className}`}
      style={{ transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <path
        fill={fill}
        d="M0 120V58C120 20 220 2 340 22c130 22 190 78 330 76 150-2 190-70 340-80 150-10 290 30 430 48v54Z"
      />
    </svg>
  )
}
