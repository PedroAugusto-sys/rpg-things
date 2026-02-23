import { motion } from 'framer-motion'
import Button from './Button'

/**
 * Banner de introdução ao site no estilo KOV (Knight of Valheim).
 * Moldura dourada, partículas, título e subtítulo. Exibido na primeira carga
 * até o usuário clicar em "Entrar" / "Ver personagens".
 */
export default function SiteIntroBanner({ onEnter }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto"
      style={{ backgroundColor: 'var(--kov-bg)', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Partículas douradas (embers) */}
      <div className="kov-intro-particles absolute inset-0 overflow-hidden pointer-events-none" aria-hidden />

      {/* Moldura com Border.svg */}
      <div className="kov-intro-frame kov-border-svg relative w-full max-w-xl mx-auto flex flex-col items-center justify-center py-5 px-4 sm:py-8 sm:px-8 md:py-10 md:px-10 max-[480px]:max-w-[calc(100vw-1.5rem)] min-w-0 overflow-hidden">
        {/* Logo */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mb-3 sm:mb-4">
          <img
            src="/imagens/assets/Logo.svg"
            alt="Biblioteca de Personagens"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Título principal */}
        <motion.h1
          className="text-lg sm:text-xl md:text-3xl font-serif font-bold text-center uppercase tracking-wider mb-2 w-full max-w-full break-words leading-tight"
          style={{
            fontFamily: "'Cinzel', serif",
            background: 'linear-gradient(180deg, #f5e6c8 0%, var(--kov-gold) 40%, #8b6914 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            filter: 'drop-shadow(0 0 24px var(--kov-glow)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Biblioteca de Personagens
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          className="text-sm sm:text-base md:text-lg text-center mb-4 sm:mb-6 w-full max-w-full truncate"
          style={{ color: 'var(--kov-text-muted)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          Acervo RPG
        </motion.p>

        {/* Botão Entrar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <Button variant="primary" onClick={onEnter} aria-label="Entrar e ver personagens">
            Ver personagens
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
