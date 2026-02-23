/**
 * Barra de atributo no estilo KOV.
 * variant: 'atk' | 'def' | 'spd' | 'legendary' (degradê laranja→ouro) ou color via style
 */
const VARIANT_COLORS = {
  atk: 'var(--kov-atk)',
  def: 'var(--kov-def)',
  spd: 'var(--kov-spd)',
  legendary: 'legendary',
}

const STAT_GRADIENT = 'linear-gradient(90deg, var(--kov-stat-gradient-start), var(--kov-stat-gradient-end))'

export default function StatBar({ label, value, max = 20, variant, color, displayValue, showBreakdown = false, className = '' }) {
  const useGradient = variant === 'legendary' || color === 'legendary'
  const fillStyle = useGradient
    ? { width: `${max > 0 ? (value / max) * 100 : 0}%`, backgroundImage: STAT_GRADIENT, backgroundSize: '100% 100%' }
    : { width: `${max > 0 ? (value / max) * 100 : 0}%`, backgroundColor: color || (variant && VARIANT_COLORS[variant] !== 'legendary' && VARIANT_COLORS[variant]) || 'var(--kov-gold)' }
  const rawText = displayValue != null ? String(displayValue) : value
  const hasBonus = typeof rawText === 'string' && rawText.includes('+')
  const [basePart, bonusPart] = hasBonus ? rawText.split(/(\+\d+)$/) : [rawText, null]
  const showBreakdownNow = hasBonus && showBreakdown
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="w-24 text-sm text-[var(--kov-text-muted)] shrink-0">{label}</span>
      <div className="kov-stat-bar flex-1 min-w-0">
        <div className="kov-stat-bar-fill" style={fillStyle} />
      </div>
      <span className="text-sm font-medium w-8 text-right">
        {showBreakdownNow ? (
          <>
            <span style={{ color: 'var(--kov-stat-value)' }}>{basePart}</span>
            <span style={{ color: 'var(--kov-stat-value-bonus)' }}>{bonusPart}</span>
          </>
        ) : (
          <span style={{ color: hasBonus ? 'var(--kov-stat-value-bonus)' : 'var(--kov-stat-value)' }}>{value}</span>
        )}
      </span>
    </div>
  )
}
