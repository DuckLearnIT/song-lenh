type Props = {
  text: string
  className?: string
}

/** Splits text into masked characters. Animate `.ch` elements from the parent. */
export default function SplitChars({ text, className = '' }: Props) {
  return (
    <span className={`whitespace-nowrap ${className}`} aria-label={text}>
      {Array.from(text).map((c, i) => (
        <span key={i} className="mask" aria-hidden="true">
          <span className="ch">{c === ' ' ? ' ' : c}</span>
        </span>
      ))}
    </span>
  )
}
