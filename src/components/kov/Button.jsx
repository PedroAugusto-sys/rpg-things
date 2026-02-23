/**
 * Botão no estilo KOV (Knight of Valheim).
 * variant: 'primary' | 'secondary' | 'ghost'
 */
export default function Button({
  variant = 'secondary',
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
}) {
  const base =
    'inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 cursor-pointer hover:brightness-110 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--kov-bg)] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed rounded '
  const variants = {
    primary: 'border-2 px-6 py-2.5 bg-[var(--kov-gold)] border-[var(--kov-gold)] text-[var(--kov-bg)] hover:bg-[var(--kov-gold-soft)] hover:border-[var(--kov-gold-soft)] focus-visible:ring-[var(--kov-gold)]',
    secondary:
      'border-2 px-6 py-2.5 border-[var(--kov-border)] text-[var(--kov-gold)] bg-[var(--kov-bg-panel)] hover:bg-[var(--kov-bg-elevated)] hover:border-[var(--kov-gold-soft)] focus-visible:ring-[var(--kov-gold)]',
    ghost:
      'border border-transparent px-6 py-2.5 text-[var(--kov-gold)] hover:bg-[var(--kov-bg-elevated)] focus-visible:ring-[var(--kov-gold)]',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`kov-btn ${base} ${variants[variant] || variants.secondary} ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
