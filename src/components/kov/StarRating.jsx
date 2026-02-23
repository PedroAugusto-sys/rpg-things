/**
 * Exibe estrelas douradas (rating/raridade) no estilo KOV.
 * value: 1 a max (ex.: 5), estrelas preenchidas = value, restante vazias.
 */
export default function StarRating({ value = 0, max = 5, className = '' }) {
  const filled = Math.min(Math.max(0, value), max)
  return (
    <div
      className={`flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`Raridade: ${filled} de ${max} estrelas`}
    >
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className="text-lg md:text-xl"
          style={{ color: i < filled ? 'var(--kov-gold)' : 'var(--kov-text-dim)' }}
        >
          ★
        </span>
      ))}
    </div>
  )
}
