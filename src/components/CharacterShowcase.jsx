import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SnowCanvas from './SnowCanvas'

const WHOOSH_DURATION = 0.28

const TAG_COLORS = [
  { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/50' },
  { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/50' },
  { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/50' },
  { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/50' },
  { bg: 'bg-violet-500/20', text: 'text-violet-300', border: 'border-violet-500/50' },
  { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/50' },
]

function getTagStyle(index) {
  return TAG_COLORS[index % TAG_COLORS.length]
}

function getInitials(nome) {
  return nome
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function getConceptImages(imagens) {
  if (!imagens) return []
  const { conceptArt } = imagens
  if (Array.isArray(conceptArt)) return conceptArt.filter(Boolean)
  return conceptArt ? [conceptArt] : []
}

export default function CharacterShowcase({ characters }) {
  const [selected, setSelected] = useState(null)
  const [entranceDone, setEntranceDone] = useState(false)
  const [hoveredCardId, setHoveredCardId] = useState(null)
  const [ulfgarPortraitHovered, setUlfgarPortraitHovered] = useState(false)
  const [portraitRotateY, setPortraitRotateY] = useState(0)
  const conceptImages = selected ? getConceptImages(selected.imagens) : []
  const isUlfgar = selected?.id === 'char-001'
  const ulfgarCardHovered = hoveredCardId === 'char-001'
  const ulfgarGlowOn = isUlfgar && (ulfgarCardHovered || ulfgarPortraitHovered)
  const whooshRef = useRef(null)
  useEffect(() => {
    whooshRef.current = new Audio('/audios/whoosh.mp3')
  }, [])
  useEffect(() => {
    const t = setTimeout(() => setEntranceDone(true), 800)
    return () => clearTimeout(t)
  }, [])
  useEffect(() => {
    setPortraitRotateY(0)
  }, [selected?.id])

  const handleSelectCard = useCallback((char) => {
    if (char.id === selected?.id) {
      setSelected(null)
      return
    }
    const audio = whooshRef.current
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(() => {})
    }
    setSelected(char)
  }, [selected?.id])

  if (!characters?.length) return null

  return (
    <div className="min-h-screen bg-slate-950 text-white transition-colors duration-500">
      {/* Background glow dinâmico (blur que muda com o personagem) */}
      <div
        className="fixed inset-0 opacity-25 blur-[120px] pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: selected?.corTema ?? '#1e293b' }}
        aria-hidden
      />

      {/* Neve caindo quando Ulfgar está selecionado (fundo) */}
      {isUlfgar && <SnowCanvas active className="z-[5]" />}

      {/* Camada de neve à frente do título (profundidade) */}
      {isUlfgar && <SnowCanvas active foreground className="z-[15]" />}

      <div className={`relative z-10 p-8 md:p-10 ${selected ? 'pt-24 md:pt-28' : ''}`}>
        <AnimatePresence mode="wait">
          {selected && (
            <motion.h1
              key="title"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="title-cronicas text-center text-3xl md:text-5xl uppercase mb-12"
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                background: 'linear-gradient(180deg, #FFFFFF 0%, #A5C9FF 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '0.28em',
                filter: 'drop-shadow(0 0 20px rgba(165, 201, 255, 0.5)) drop-shadow(0 0 40px rgba(165, 201, 255, 0.3))',
              }}
            >
              CRÔNICAS DE ULFGAR
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Carrossel centralizado: card focado maior + glow */}
        <div className={`flex justify-center gap-4 md:gap-8 mb-16 md:mb-20 overflow-x-auto pb-4 ${selected ? 'mt-16 items-center pt-12' : 'items-end'}`}>
          {characters.map((char, index) => {
            const isSelected = selected?.id === char.id
            const isHovered = hoveredCardId === char.id
            const cardGlow =
              isSelected
                ? `0 0 40px ${char.corTema}40, 0 0 80px ${char.corTema}20`
                : isHovered
                  ? `0 0 28px ${char.corTema}50, 0 0 56px ${char.corTema}28`
                  : 'none'
            const cardWidth = isSelected ? 320 : 240
            return (
              <motion.div
                key={char.id}
                className="shrink-0"
                style={{ width: cardWidth }}
                initial={{ opacity: 0, y: 40, scale: 0.85 }}
                animate={{
                  opacity: isSelected ? 1 : isHovered ? 0.95 : 0.6,
                  y: 0,
                  scale: isSelected ? 1.05 : 0.92,
                }}
                transition={{
                  type: 'tween',
                  duration: entranceDone ? WHOOSH_DURATION : 0.45,
                  delay: entranceDone ? 0 : 0.2 + index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <motion.button
                  type="button"
                  onClick={() => handleSelectCard(char)}
                  onMouseEnter={() => setHoveredCardId(char.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  whileHover={{ scale: isSelected ? 1.02 : 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  className={`
                    w-full h-full cursor-pointer text-left block
                    rounded-xl overflow-hidden border-2
                    transition-[box-shadow,border-color,background-color] duration-[280ms] ease-out
                    ${isSelected ? 'border-white/60' : 'border-white/10 hover:opacity-80'}
                  `}
                  style={{
                    backgroundColor: isHovered ? 'rgba(42, 43, 46, 0.98)' : '#1e1f22',
                    boxShadow: cardGlow,
                  }}
                >
                <div>
                  {/* Banner estilo Discord */}
                  <div
                    className="h-14 w-full shrink-0"
                    style={{ backgroundColor: char.corTema }}
                  />

                  <div className="relative px-4 pb-5 -mt-7">
                    {/* Avatar circular com borda */}
                    <div className="flex justify-start">
                      <div
                        className="h-14 w-14 rounded-full border-[3px] border-[#1e1f22] shadow-xl flex items-center justify-center overflow-hidden shrink-0"
                        style={{ backgroundColor: char.corTema }}
                      >
                        {char.imagens?.avatar ? (
                          <img
                            src={char.imagens.avatar}
                            alt=""
                            className="h-full w-full object-cover object-top"
                          />
                        ) : (
                          <span className="text-base font-bold text-white">
                            {getInitials(char.nome)}
                          </span>
                        )}
                      </div>
                    </div>

                    <h2 className="mt-2 text-lg font-bold text-white">
                      {char.nome}
                      {char.titulo && (
                        <span className="block text-sm font-normal opacity-80" style={{ color: char.corTema }}>
                          {char.titulo}
                        </span>
                      )}
                    </h2>

                    {/* Badges de classe */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {char.classe?.map((c, i) => {
                        const style = getTagStyle(i)
                        return (
                          <span
                            key={`${c}-${i}`}
                            className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${style.bg} ${style.text} ${style.border}`}
                          >
                            {c}
                          </span>
                        )
                      })}
                    </div>
                    {/* Tags de personalidade (ex.: Ulfgar) */}
                    {char.personalidade?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {char.personalidade.map((p, i) => (
                          <span
                            key={p}
                            className="inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium border-sky-400/50 bg-sky-500/15 text-sky-200"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                </motion.button>
              </motion.div>
            )
          })}
        </div>

        {/* Seção de detalhes: Sobre + Concept Art (fade-in + slide-up) */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.section
              key={selected.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: WHOOSH_DURATION, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-5xl mx-auto"
            >
              {/* Aba de navegação (estilo referência) */}
              <div className="flex justify-center mb-6">
                <span
                  className="rounded-full border border-white/20 bg-white/5 px-6 py-2 text-sm font-medium tracking-wide"
                  style={{ color: selected.corTema }}
                >
                  Sobre
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06, duration: WHOOSH_DURATION * 0.9 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-md"
              >
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-8 md:gap-10">
                  {/* Coluna Sobre */}
                  <div>
                    <h3
                      className="text-2xl md:text-3xl font-serif mb-4"
                      style={{ color: selected.corTema }}
                    >
                      Sobre
                    </h3>
                    {selected.alinhamento && (
                      <p className="text-sm font-medium mb-2 opacity-90" style={{ color: selected.corAcento ?? selected.corTema }}>
                        {selected.alinhamento}
                      </p>
                    )}
                    {selected.citacao && (
                      <blockquote className="text-slate-300 border-l-2 pl-4 mb-4 italic" style={{ borderColor: selected.corAcento ?? selected.corTema }}>
                        "{selected.citacao}"
                      </blockquote>
                    )}
                    <p className="text-slate-300 leading-relaxed italic">
                      "{selected.bio}"
                    </p>
                    {selected.personalidade?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {selected.personalidade.map((p) => (
                          <span
                            key={p}
                            className="rounded border px-2.5 py-1 text-xs font-medium border-amber-400/40 bg-amber-500/10 text-amber-200"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Coluna imagem / concept art */}
                  <div className="min-h-0 flex items-center">
                    <div className={`w-full ${conceptImages.length === 1 ? 'max-w-2xl mx-auto' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'}`}>
                      {conceptImages.length > 0 ? (
                        conceptImages.map((src, i) => (
                          <div
                            key={src}
                            className="perspective-[1200px] cursor-pointer"
                            onMouseEnter={() => isUlfgar && setUlfgarPortraitHovered(true)}
                            onMouseLeave={() => setUlfgarPortraitHovered(false)}
                            onClick={() => setPortraitRotateY((prev) => prev + 360)}
                          >
                            <motion.div
                              className={`rounded-xl overflow-hidden bg-slate-900/95 ${conceptImages.length === 1 ? 'aspect-[3/4] max-h-[520px] w-full flex items-center justify-center' : ''}`}
                              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'visible' }}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                rotateY: portraitRotateY,
                              }}
                              transition={{
                                opacity: { delay: 0.15 + i * 0.05 },
                                rotateY: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
                                scale: { duration: 0.25 },
                                rotate: { duration: 0.25 },
                              }}
                              whileHover={{ scale: 1.03, rotate: 1 }}
                            >
                              <motion.img
                                src={src}
                                alt={`Concept art ${i + 1} - ${selected.nome}`}
                                className={`rounded-xl shadow-2xl border border-white/20 w-full object-contain bg-slate-900 ${conceptImages.length === 1 ? 'aspect-[3/4] max-h-[520px]' : 'object-cover aspect-video'} ${ulfgarGlowOn ? 'ring-2 ring-[#60a5fa] shadow-[0_0_30px_#60a5fa40,0_0_60px_#60a5fa25]' : ''}`}
                                style={{ transform: 'translateZ(0)' }}
                              />
                            </motion.div>
                          </div>
                        ))
                      ) : (
                        <div
                          className="rounded-xl border border-white/10 bg-white/5 aspect-video flex items-center justify-center text-slate-500 text-sm"
                          style={{ gridColumn: '1 / -1' }}
                        >
                          Nenhuma concept art disponível
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
