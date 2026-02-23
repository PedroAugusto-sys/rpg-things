import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SnowCanvas from './SnowCanvas'
import KairosSandCanvas from './KairosSandCanvas'
import SiteIntroBanner from './kov/SiteIntroBanner'
import Button from './kov/Button'
import StatBar from './kov/StatBar'
import StatIcon from './kov/StatIcon'

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

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < breakpoint)
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const fn = () => setIsMobile(mql.matches)
    mql.addEventListener('change', fn)
    return () => mql.removeEventListener('change', fn)
  }, [breakpoint])
  return isMobile
}

export default function CharacterShowcase({ characters }) {
  const [introDismissed, setIntroDismissed] = useState(false)
  const [selected, setSelected] = useState(null)
  const [entranceDone, setEntranceDone] = useState(false)
  const [hoveredCardId, setHoveredCardId] = useState(null)
  const [hoveredStatKey, setHoveredStatKey] = useState(null)
  const [portraitHovered, setPortraitHovered] = useState(false)
  const [portraitRotateY, setPortraitRotateY] = useState(0)
  const conceptImages = selected ? getConceptImages(selected.imagens) : []
  const isUlfgar = selected?.id === 'char-001'
  const isKairos = selected?.id === 'char-002'
  const [snowTrigger, setSnowTrigger] = useState(0)
  const [sandTrigger, setSandTrigger] = useState(0)
  const [discordCopied, setDiscordCopied] = useState(false)
  const isMobile = useIsMobile(640)
  const portraitGlowOn = selected && (hoveredCardId === selected.id || portraitHovered)

  const handleCopyDiscord = useCallback(() => {
    navigator.clipboard.writeText('astrocard').then(() => {
      setDiscordCopied(true)
      setTimeout(() => setDiscordCopied(false), 2500)
    })
  }, [])
  const portraitGlowColor = selected?.corTema || '#c9a227'
  const whooshRef = useRef(null)
  const cardRefsRef = useRef({})
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
  useEffect(() => {
    if (!isMobile || !selected?.id) return
    const el = cardRefsRef.current[selected.id]
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [selected?.id, isMobile])

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
    if (char.id === 'char-001') setSnowTrigger((t) => t + 1)
  }, [selected?.id])

  if (!characters?.length) return null

  return (
    <div
      className="min-h-screen text-white transition-colors duration-500 bg-no-repeat md:bg-cover md:bg-center bg-contain bg-top"
      style={{
        backgroundColor: 'var(--kov-bg)',
        backgroundImage: 'url("/imagens/assets/Frame%201.svg")',
      }}
    >
      <AnimatePresence>
        {!introDismissed && (
          <SiteIntroBanner key="intro" onEnter={() => setIntroDismissed(true)} />
        )}
      </AnimatePresence>

      {introDismissed && (
        <div className="flex flex-col min-h-screen">
      {/* Background glow dinâmico (blur que muda com o personagem) */}
      <div
        className="fixed inset-0 opacity-20 blur-[120px] pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: selected?.corTema ?? 'var(--kov-gold)' }}
        aria-hidden
      />

      {/* Neve caindo quando Ulfgar está selecionado (fundo) */}
      {isUlfgar && <SnowCanvas active trigger={snowTrigger} className="z-[5]" />}

      {/* Camada de neve à frente do título (profundidade) */}
      {isUlfgar && <SnowCanvas active foreground trigger={snowTrigger} className="z-[15]" />}

      {/* Areia do Tempo: partículas contínuas + burst no flip do retrato */}
      <KairosSandCanvas active={isKairos} trigger={sandTrigger} />

      <div className="relative z-10 flex-1 px-4 py-4 sm:px-6 sm:py-6 md:p-8 lg:p-10 pt-[max(1rem,env(safe-area-inset-top))]">
        <AnimatePresence mode="wait">
          {selected && (
            <motion.h1
              key="title"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="title-cronicas text-center text-2xl sm:text-3xl md:text-5xl uppercase mb-8 sm:mb-10 md:mb-12"
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                background: 'linear-gradient(180deg, #f5e6c8 0%, var(--kov-gold) 50%, #8b6914 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: 'clamp(0.05em, 2vw, 0.28em)',
                filter: 'drop-shadow(0 0 20px var(--kov-glow)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
              }}
            >
              CRÔNICAS DE {selected.nome.toUpperCase()}
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Carrossel: horizontal com snap no mobile, linha no desktop */}
        <div
          className={`flex flex-row justify-center gap-4 sm:gap-4 md:gap-8 mb-8 sm:mb-12 md:mb-16 lg:mb-20 overflow-x-auto overflow-y-visible py-4 sm:py-6 md:py-8 px-0 sm:px-4 ${selected ? 'mt-6 sm:mt-12 md:mt-16 items-center pt-4 sm:pt-8 md:pt-12' : 'items-end'} ${isMobile ? 'snap-x snap-mandatory' : ''} ${isMobile ? 'pl-[max(1rem,calc(50vw-140px))] pr-[max(1rem,calc(50vw-140px))]' : ''}`}
          style={{
            WebkitOverflowScrolling: 'touch',
            ...(isMobile ? { scrollPaddingInline: 'max(1rem, calc(50vw - 140px))' } : {}),
          }}
        >
          {characters.map((char, index) => {
            const isSelected = selected?.id === char.id
            const isHovered = hoveredCardId === char.id
            const cardGlow =
              isSelected
                ? `0 0 40px ${char.corTema}40, 0 0 80px ${char.corTema}20`
                : isHovered
                  ? `0 0 28px ${char.corTema}50, 0 0 56px ${char.corTema}28`
                  : 'none'
            const cardWidth = isMobile ? 280 : (isSelected ? 320 : 240)
            const cardHeight = Math.round(cardWidth * 1.28)
            return (
              <motion.div
                key={char.id}
                ref={(el) => { if (el) cardRefsRef.current[char.id] = el }}
                className={`shrink-0 ${isMobile ? 'snap-center' : ''}`}
                style={{
                  width: isMobile ? 'min(280px, 85vw)' : cardWidth,
                  height: cardHeight,
                  ...(isMobile ? { scrollSnapStop: 'always' } : {}),
                }}
                initial={{ opacity: 0, y: 40, scale: 0.85 }}
                animate={{
                  opacity: isSelected ? 1 : isHovered ? 0.95 : 0.6,
                  y: 0,
                  scale: isSelected ? 1 : 0.92,
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
                  whileHover={{ scale: isSelected ? 1 : 1.01 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label={`Selecionar personagem ${char.nome}${char.titulo ? `, ${char.titulo}` : ''}`}
                  aria-pressed={isSelected}
                  className={`
                    w-full h-full cursor-pointer text-left flex flex-col relative
                    rounded-lg overflow-visible kov-frame
                    transition-[box-shadow,border-color,background-color] duration-[280ms] ease-out
                    hover:z-20
                    ${isSelected ? 'ring-2 ring-[var(--kov-gold-soft)] ring-offset-2 ring-offset-[var(--kov-bg)]' : ''}
                  `}
                  style={{
                    backgroundColor: isHovered ? 'var(--kov-bg-elevated)' : 'var(--kov-bg-card)',
                    borderColor: isSelected ? 'var(--kov-gold-soft)' : 'var(--kov-border)',
                    boxShadow: cardGlow,
                  }}
                >
                <div className="flex flex-col h-full min-h-0 min-w-0 overflow-hidden">
                  {/* Faixa fina de cor no topo */}
                  <div
                    className="h-1.5 w-full shrink-0"
                    style={{ backgroundColor: char.corTema || 'var(--kov-gold)' }}
                  />

                  {/* Conteúdo centralizado: avatar maior mais abaixo, depois nome, título e tags */}
                  <div className="flex-1 flex flex-col items-center justify-center min-h-0 min-w-0 px-3 pb-4 pt-6 overflow-hidden">
                    <div
                      className="h-20 w-20 rounded-full border-2 border-[var(--kov-bg-card)] shadow-lg flex items-center justify-center overflow-hidden shrink-0"
                      style={{ backgroundColor: char.corTema || 'var(--kov-gold)' }}
                    >
                      {char.imagens?.avatar ? (
                        <img
                          src={char.imagens.avatar}
                          alt=""
                          className="h-full w-full object-cover object-top"
                        />
                      ) : (
                        <span className="text-lg font-bold text-[var(--kov-text)]">
                          {getInitials(char.nome)}
                        </span>
                      )}
                    </div>
                    <h2 className="text-base font-bold leading-tight text-[var(--kov-text)] text-center mt-3 w-full min-w-0 px-0.5">
                      <span className="block truncate" title={char.nome}>{char.nome}</span>
                      {char.titulo && (
                        <span className="block text-xs font-normal opacity-80 mt-0.5 truncate max-w-full" style={{ color: char.corTema || 'var(--kov-gold)' }} title={char.titulo}>
                          {char.titulo}
                        </span>
                      )}
                    </h2>
                    <div className="flex flex-wrap justify-center gap-1.5 mt-2 w-full min-w-0 overflow-hidden">
                      {(char.multiclasseFromIndex != null ? char.classe?.slice(0, char.multiclasseFromIndex) : char.classe)?.map((c, i) => {
                        const style = char.classeTagStyles?.[i] ?? getTagStyle(i)
                        return (
                          <span key={`${c}-${i}`} className="inline-flex items-center gap-1">
                            <span
                              className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium max-w-[120px] min-w-0 truncate ${style.bg} ${style.text} ${style.border}`}
                              title={c}
                            >
                              {c}
                            </span>
                            {((char.multiclasseFromIndex != null ? i === char.multiclasseFromIndex : i > 0) && char.multiclasse !== false) && (
                              <span className="relative group inline-block">
                                <span className="rounded border border-violet-500/50 bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-medium text-violet-200 cursor-help shrink-0">
                                  (Multiclasse)
                                </span>
                                {char.classe?.length > (char.multiclasseFromIndex ?? 1) && (
                                  <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block z-[100] pointer-events-none">
                                    <div className="rounded-lg border border-[var(--kov-border)] bg-[var(--kov-bg-elevated)] shadow-xl p-2 min-w-[80px] whitespace-nowrap">
                                      <span className="rounded border border-violet-500/50 bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-medium text-violet-200">
                                        {char.multiclasseTooltip ?? char.classe.slice(char.multiclasseFromIndex ?? 1).join(': ')}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </span>
                            )}
                          </span>
                        )
                      })}
                      {char.multiclasse !== false && char.multiclasseFromIndex != null && char.classe?.length > char.multiclasseFromIndex && (
                        <span className="relative group inline-block shrink-0">
                          <span className="rounded border border-violet-500/50 bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-medium text-violet-200 cursor-help">
                            (Multiclasse)
                          </span>
                          <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block z-[100] pointer-events-none">
                            <div className="rounded-lg border border-[var(--kov-border)] bg-[var(--kov-bg-elevated)] shadow-xl p-2 min-w-[80px] whitespace-nowrap">
                              <span className="rounded border border-violet-500/50 bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-medium text-violet-200">
                                {char.multiclasseTooltip ?? char.classe.slice(char.multiclasseFromIndex).join(': ')}
                              </span>
                            </div>
                          </div>
                        </span>
                      )}
                      {char.personalidade?.map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium max-w-[110px] min-w-0 truncate border-sky-400/50 bg-sky-500/15 text-sky-200"
                          title={p}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
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
              {/* Aba de navegação estilo KOV */}
              <div className="flex justify-center mb-6">
                <Button variant="secondary" disabled className="cursor-default" aria-label="Aba Sobre">
                  Sobre
                </Button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06, duration: WHOOSH_DURATION * 0.9 }}
                className="rounded-xl kov-frame p-4 sm:p-6 md:p-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                  {/* Coluna Sobre */}
                  <div>
                    {/* Atributos, Classe, Antecedente e Perícias */}
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-[var(--kov-bg)] border border-[var(--kov-border)]">
                      {selected.stats && (
                        <>
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--kov-text-muted)]">Human (Marca de Manipulação)</span>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--kov-gold)]">Atributos</h4>
                          </div>
                          <div className="space-y-1 mb-4">
                            {[
                              { key: 'str', label: 'Força', value: selected.stats.str, displayValue: selected.stats.strDisplay, variant: 'legendary' },
                              { key: 'dex', label: 'Destreza', value: selected.stats.dex, variant: 'legendary' },
                              { key: 'con', label: 'Constituição', value: selected.stats.con, displayValue: selected.stats.conDisplay, variant: 'legendary' },
                              { key: 'int', label: 'Inteligência', value: selected.stats.int, displayValue: selected.stats.intDisplay, variant: 'legendary' },
                              { key: 'wis', label: 'Sabedoria', value: selected.stats.wis, displayValue: selected.stats.wisDisplay, variant: 'legendary' },
                              { key: 'cha', label: 'Carisma', value: selected.stats.cha, variant: 'legendary' },
                            ]
                              .filter(({ key }) => selected.stats[key] != null)
                              .map(({ key, label, value, displayValue, variant }) => (
                                <div
                                  key={key}
                                  className="flex items-center gap-2 rounded px-2 py-1.5 transition-colors duration-200 hover:bg-[var(--kov-bg-elevated)]"
                                  onMouseEnter={() => setHoveredStatKey(key)}
                                  onMouseLeave={() => setHoveredStatKey(null)}
                                >
                                  <StatIcon type={key} />
                                  <StatBar
                                    label={label}
                                    value={value}
                                    max={20}
                                    displayValue={displayValue}
                                    showBreakdown={hoveredStatKey === key}
                                    variant={variant}
                                    className="flex-1 min-w-0"
                                  />
                                </div>
                              ))}
                          </div>
                        </>
                      )}
                      {selected.classe?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--kov-gold)] mb-1">Classe</p>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {(selected.multiclasseFromIndex != null ? selected.classe.slice(0, selected.multiclasseFromIndex) : selected.classe).map((c, i) => {
                              const tagStyle = selected.classeTagStyles?.[i] ?? getTagStyle(i)
                              return (
                                <span key={i} className="inline-flex items-center gap-1.5">
                                  <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-medium ${tagStyle.bg} ${tagStyle.text} ${tagStyle.border}`}>
                                    {c}
                                  </span>
                                  {((selected.multiclasseFromIndex != null ? i === selected.multiclasseFromIndex : i > 0) && selected.multiclasse !== false) && (
                                    <span className="relative group inline-block">
                                      <span className="rounded border border-violet-500/50 bg-violet-500/20 px-1.5 py-0.5 text-xs font-medium text-violet-200 cursor-help">
                                        (Multiclasse)
                                      </span>
                                      {selected.classe?.length > (selected.multiclasseFromIndex ?? 1) && (
                                        <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block z-50 pointer-events-none">
                                          <div className="rounded-lg border border-[var(--kov-border)] bg-[var(--kov-bg-elevated)] shadow-xl p-2 min-w-[80px]">
                                            <span className="rounded border border-violet-500/50 bg-violet-500/20 px-1.5 py-0.5 text-xs font-medium text-violet-200 whitespace-nowrap">
                                              {selected.multiclasseTooltip ?? selected.classe.slice(selected.multiclasseFromIndex ?? 1).join(': ')}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </span>
                                  )}
                                </span>
                              )
                            })}
                            {selected.multiclasse !== false && selected.multiclasseFromIndex != null && selected.classe?.length > selected.multiclasseFromIndex && (
                              <span className="relative group inline-block">
                                <span className="rounded border border-violet-500/50 bg-violet-500/20 px-1.5 py-0.5 text-xs font-medium text-violet-200 cursor-help">
                                  (Multiclasse)
                                </span>
                                <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block z-50 pointer-events-none">
                                  <div className="rounded-lg border border-[var(--kov-border)] bg-[var(--kov-bg-elevated)] shadow-xl p-2 min-w-[80px]">
                                    <span className="rounded border border-violet-500/50 bg-violet-500/20 px-1.5 py-0.5 text-xs font-medium text-violet-200 whitespace-nowrap">
                                      {selected.multiclasseTooltip ?? selected.classe.slice(selected.multiclasseFromIndex ?? 1).join(': ')}
                                    </span>
                                  </div>
                                </div>
                              </span>
                            )}
                          </div>
                          {selected.classePericias?.length > 0 && (
                            <p className="text-xs text-[var(--kov-text-muted)] mt-0.5">
                              Perícias – {selected.classePericias.join(', ')}.
                            </p>
                          )}
                          {selected.classeTalento && (
                            <p className="text-xs text-[var(--kov-text-muted)] mt-0.5">
                              Talento – {selected.classeTalento}.
                            </p>
                          )}
                        </div>
                      )}
                      {selected.antecedente && (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--kov-gold)] mb-1">
                            Antecedente ({selected.antecedente})
                          </p>
                          {selected.antecedentePericias?.length > 0 && (
                            <p className="text-xs text-[var(--kov-text-muted)]">
                              Perícias – {selected.antecedentePericias.join(', ')}.
                            </p>
                          )}
                          {selected.antecedenteFerramentas?.length > 0 && (
                            <p className="text-xs text-[var(--kov-text-muted)] mt-0.5">
                              Ferramentas – {selected.antecedenteFerramentas.join(', ')}.
                            </p>
                          )}
                          {selected.antecedenteTraco && (
                            <p className="text-xs text-[var(--kov-text-muted)] mt-0.5">
                              Traço – {selected.antecedenteTraco}.
                            </p>
                          )}
                        </div>
                      )}
                      {selected.equipamento?.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-[var(--kov-border)]">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--kov-gold)] mb-2">
                            Equipamento
                          </p>
                          {selected.equipamento.map((bloco, i) => (
                            <div key={i} className="mb-2 last:mb-0">
                              <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--kov-text-muted)] mb-0.5">
                                Equipamento inicial de {bloco.origem}
                              </p>
                              <ul className="text-xs text-[var(--kov-text-muted)] list-disc list-inside space-y-0.5">
                                {bloco.itens.map((item, j) => (
                                  <li key={j}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div
                      className="my-6 h-px w-full"
                      style={{ backgroundColor: 'var(--kov-border)', opacity: 0.6 }}
                      aria-hidden
                    />
                    <h3
                      className="text-2xl md:text-3xl font-serif mb-4"
                      style={{ color: selected.corTema || 'var(--kov-gold)' }}
                    >
                      Sobre
                    </h3>
                    {selected.alinhamento && (
                      <p className="text-sm font-medium mb-2 opacity-90" style={{ color: selected.corAcento ?? selected.corTema }}>
                        {selected.alinhamento}
                      </p>
                    )}
                    {selected.citacao && (
                      <blockquote className="text-[var(--kov-text-muted)] border-l-2 pl-4 mb-4 italic" style={{ borderColor: selected.corAcento ?? selected.corTema ?? 'var(--kov-border)' }}>
                        "{selected.citacao}"
                      </blockquote>
                    )}
                    <p className="leading-relaxed italic text-[var(--kov-text)]">
                      "{selected.bio}"
                    </p>
                    {(selected.personalidade?.length > 0 || (selected.classe?.length > 1 && selected.multiclasse !== false)) && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {selected.personalidade?.map((p) => (
                          <span
                            key={p}
                            className="rounded border px-2.5 py-1 text-xs font-medium border-[var(--kov-border)] bg-[var(--kov-bg-elevated)] text-[var(--kov-gold-soft)]"
                          >
                            {p}
                          </span>
                        ))}
                        {selected.classe?.length > (selected.multiclasseFromIndex ?? 1) && selected.multiclasse !== false && (
                          <span className="relative group inline-block">
                            <span className="rounded border border-violet-500/50 bg-violet-500/20 px-2.5 py-1 text-xs font-medium text-violet-200 cursor-help">
                              (Multiclasse)
                            </span>
                            <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block z-50 pointer-events-none">
                              <div className="rounded-lg border border-[var(--kov-border)] bg-[var(--kov-bg-elevated)] shadow-xl p-2 min-w-[80px]">
                                <span className="rounded border border-violet-500/50 bg-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-200 whitespace-nowrap">
                                  {selected.multiclasseTooltip ?? selected.classe.slice(selected.multiclasseFromIndex ?? 1).join(': ')}
                                </span>
                              </div>
                            </div>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Coluna imagem / concept art (sticky: segue o scroll até o fim da seção) */}
                  <div className="min-h-0 flex items-center sticky top-24 sm:top-32 md:top-40 self-start">
                    <div className={`w-full ${conceptImages.length === 1 ? 'max-w-2xl mx-auto' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'}`}>
                      {conceptImages.length > 0 ? (
                        conceptImages.map((src, i) => (
                          <div
                            key={src}
                            className="perspective-[1200px] cursor-pointer"
                            onMouseEnter={() => setPortraitHovered(true)}
                            onMouseLeave={() => setPortraitHovered(false)}
                            onClick={() => {
                              setPortraitRotateY((prev) => prev + 360)
                              if (isUlfgar) setSnowTrigger((t) => t + 1)
                              if (isKairos) setSandTrigger((t) => t + 1)
                            }}
                          >
                            <motion.div
                              className={`rounded-xl overflow-hidden kov-frame ${conceptImages.length === 1 ? 'aspect-[3/4] max-h-[min(55vh,400px)] sm:max-h-[min(60vh,480px)] md:max-h-[520px] w-full flex items-center justify-center' : ''}`}
                              style={{
                                backgroundColor: 'var(--kov-bg-panel)',
                                transformStyle: 'preserve-3d',
                                backfaceVisibility: 'visible',
                              }}
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
                                className={`rounded-xl border border-white/20 w-full object-contain ${conceptImages.length === 1 ? 'aspect-[3/4] max-h-[min(55vh,400px)] sm:max-h-[min(60vh,480px)] md:max-h-[520px]' : 'object-cover aspect-video'} ${portraitGlowOn ? '' : 'shadow-2xl'}`}
                                style={{
                                  transform: 'translateZ(0)',
                                  backgroundColor: `color-mix(in srgb, ${portraitGlowColor} 18%, #0c0b0a)`,
                                  ...(portraitGlowOn
                                    ? { boxShadow: `0 0 0 2px ${portraitGlowColor}, 0 0 30px ${portraitGlowColor}40, 0 0 60px ${portraitGlowColor}25` }
                                    : {}),
                                }}
                              />
                            </motion.div>
                          </div>
                        ))
                      ) : (
                        <div
                          className="rounded-xl kov-frame aspect-video flex items-center justify-center text-[var(--kov-text-muted)] text-sm"
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

      {/* Footer */}
      <footer
        className="mt-auto py-3 px-3 sm:py-4 sm:px-4 md:px-6 text-xs sm:text-sm border-t-2 flex flex-row items-center justify-between gap-2 sm:gap-4"
        style={{
          backgroundColor: 'var(--kov-bg)',
          borderColor: 'var(--kov-border)',
          color: 'var(--kov-text-muted)',
          paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
        }}
      >
        <span className="flex-1 min-w-0 text-center">Acervo RPG — Biblioteca de Personagens</span>
        <div className="relative shrink-0 flex items-center justify-end">
          {discordCopied && (
            <span className="absolute right-0 bottom-full mb-1 text-xs text-[var(--kov-gold)] whitespace-nowrap">
              Nick do discord copiado com sucesso
            </span>
          )}
          <button
            type="button"
            onClick={handleCopyDiscord}
            className="kov-footer-discord-btn p-1.5 rounded-md text-[var(--kov-text-muted)] hover:text-[var(--kov-gold)] border border-transparent hover:border-[var(--kov-border)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kov-gold)]"
            aria-label="Copiar usuário do Discord (astrocard)"
            title="Copiar astrocard"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </button>
        </div>
      </footer>
        </div>
      )}
    </div>
  )
}
