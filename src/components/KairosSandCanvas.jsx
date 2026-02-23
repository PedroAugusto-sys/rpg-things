import { useRef, useEffect, useState } from 'react'

const SAND_COUNT = 140
const SAND_COUNT_MOBILE = 20
const GLYPH_CHANCE = 0.07
const BURST_COUNT = 90
const BURST_COUNT_MOBILE = 0
const BURST_GLYPH_CHANCE = 0.08
const BURST_LIFESPAN_MIN = 2
const BURST_LIFESPAN_MAX = 3
const BURST_FRICTION = 0.985
const BURST_GRAVITY = 0.08
const MIN_SIZE = 1
const MAX_SIZE = 3.5
const GLYPH_SIZE_MIN = 6
const GLYPH_SIZE_MAX = 11
const FALL_SPEED_MIN = 0.2
const FALL_SPEED_MAX = 0.7
const SWAY_AMPLITUDE = 0.6
const SWAY_FREQUENCY = 0.002
const OPACITY_MIN = 0.3
const OPACITY_MAX = 0.9
const GLYPH_OPACITY = 0.5
const BLUR_DEPTH_THRESHOLD = 0.55

function createParticle(width, height, existing = []) {
  const isGlyph = Math.random() < GLYPH_CHANCE
  const size = isGlyph
    ? GLYPH_SIZE_MIN + Math.random() * (GLYPH_SIZE_MAX - GLYPH_SIZE_MIN)
    : MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE)
  const fallSpeed = FALL_SPEED_MIN + (size / (isGlyph ? GLYPH_SIZE_MAX : MAX_SIZE)) * (FALL_SPEED_MAX - FALL_SPEED_MIN)
  const opacity = OPACITY_MIN + Math.random() * (OPACITY_MAX - OPACITY_MIN)
  const phase = Math.random() * Math.PI * 2
  const depth = Math.random()
  return {
    type: isGlyph ? 'glyph' : 'sand',
    x: Math.random() * (width + 24) - 12,
    y: existing.length ? Math.random() * height : Math.random() * (height + 40) - 40,
    size,
    fallSpeed,
    opacity,
    phase,
    depth,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.015,
  }
}

function createBurstParticle(width, height, centerX, centerY) {
  const isGlyph = Math.random() < BURST_GLYPH_CHANCE
  const life = BURST_LIFESPAN_MIN + Math.random() * (BURST_LIFESPAN_MAX - BURST_LIFESPAN_MIN)
  const spreadX = width * 0.4
  const spreadY = height * 0.35
  const x = centerX + (Math.random() - 0.5) * spreadX
  const y = centerY - height * 0.2 + Math.random() * spreadY * 0.5
  let vx = (Math.random() - 0.5) * 1.2
  let vy = Math.random() * 1.8 + 0.4
  if (Math.random() < 0.2) vy = -Math.random() * 0.6 - 0.1
  const size = isGlyph ? 8 + Math.random() * 6 : 1.2 + Math.random() * 1.8
  const depth = Math.random()
  return {
    type: isGlyph ? 'glyph' : 'sand',
    x,
    y,
    vx,
    vy,
    life,
    maxLife: life,
    size,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    depth,
    opacity: 0.85,
    burst: true,
  }
}

function initParticles(width, height, count = SAND_COUNT) {
  const particles = []
  for (let i = 0; i < count; i++) {
    particles.push(createParticle(width, height, particles))
  }
  return particles
}

function drawGlyph(ctx, x, y, size, rotation, alpha) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * GLYPH_OPACITY})`
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(-size * 0.5, 0)
  ctx.lineTo(size * 0.5, 0)
  ctx.moveTo(0, -size * 0.5)
  ctx.lineTo(0, size * 0.5)
  ctx.stroke()
  ctx.restore()
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    const fn = () => setIsMobile(mql.matches)
    mql.addEventListener('change', fn)
    return () => mql.removeEventListener('change', fn)
  }, [])
  return isMobile
}

export default function KairosSandCanvas({ active = false, trigger = 0, className = '' }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef(null)
  const dimensionsRef = useRef({ w: 0, h: 0 })
  const timeRef = useRef(0)
  const lastTriggerRef = useRef(0)
  const isMobile = useIsMobile()
  const sandCount = isMobile ? SAND_COUNT_MOBILE : SAND_COUNT
  const burstCount = isMobile ? BURST_COUNT_MOBILE : BURST_COUNT

  useEffect(() => {
    if (active && trigger > 0 && trigger !== lastTriggerRef.current) {
      lastTriggerRef.current = trigger
      const w = dimensionsRef.current.w || window.innerWidth
      const h = dimensionsRef.current.h || window.innerHeight
      const cx = w / 2
      const cy = h / 2
      if (w && h) {
        for (let i = 0; i < burstCount; i++) {
          particlesRef.current.push(createBurstParticle(w, h, cx, cy))
        }
      }
    }
  }, [active, trigger, burstCount])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active) return

    const ctx = canvas.getContext('2d')

    function setSize() {
      const w = window.innerWidth
      const h = window.innerHeight
      const mobile = w < 768
      const dpr = mobile ? 1 : (window.devicePixelRatio || 1)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dimensionsRef.current = { w: window.innerWidth, h: window.innerHeight }
      const { w: cw, h: ch } = dimensionsRef.current
      if (particlesRef.current.length !== sandCount) {
        particlesRef.current = initParticles(cw, ch, sandCount)
      } else {
        particlesRef.current = particlesRef.current.map((p) => ({
          ...p,
          x: Math.min(p.x, cw + 12),
          y: ((p.y % (ch + 40)) + ch + 40) % (ch + 40) - 20,
        }))
      }
    }

    let lastFrame = 0
    const mobileFpsInterval = 1000 / 30

    function loop(now = 0) {
      const { w, h } = dimensionsRef.current
      if (!w || !h) {
        animationRef.current = requestAnimationFrame(loopWithTime)
        return
      }
      const mobile = w < 768
      if (mobile && now - lastFrame < mobileFpsInterval) {
        animationRef.current = requestAnimationFrame(loopWithTime)
        return
      }
      lastFrame = now

      ctx.clearRect(0, 0, w, h)
      timeRef.current += 1
      const time = timeRef.current
      const dt = 1 / 60

      particlesRef.current = particlesRef.current.filter((p) => {
        if (p.burst) {
          p.life -= dt
          if (p.life <= 0) return false
          p.x += p.vx
          p.y += p.vy
          p.vx *= BURST_FRICTION
          p.vy *= BURST_FRICTION
          p.vy += BURST_GRAVITY * (1 - p.depth)
          if (p.type === 'glyph') p.rotation += p.rotationSpeed
          return true
        }
        const sway = Math.sin(time * SWAY_FREQUENCY + p.phase) * SWAY_AMPLITUDE * (1 + p.size * 0.3)
        p.x += sway
        p.y += p.fallSpeed
        if (p.y > h + p.size) {
          p.y = -p.size
          p.x = Math.random() * (w + 24) - 12
        }
        if (p.y < -p.size) p.y = h + p.size
        if (p.x > w + p.size) p.x = -p.size
        if (p.x < -p.size) p.x = w + p.size
        if (p.type === 'glyph') p.rotation += p.rotationSpeed
        return true
      })

      const mobile = dimensionsRef.current.w < 768
      particlesRef.current
        .sort((a, b) => a.depth - b.depth)
        .forEach((p) => {
          if (mobile && p.type === 'glyph') return
          const useBlur = !mobile && p.depth > BLUR_DEPTH_THRESHOLD
          if (useBlur) ctx.filter = 'blur(1.5px)'
          else ctx.filter = 'none'

          let alpha = p.opacity * 0.85
          if (p.burst) {
            const t = 1 - p.life / p.maxLife
            alpha = (t < 0.15 ? t / 0.15 : t > 0.7 ? (1 - t) / 0.3 : 1) * 0.85
          }

          if (p.type === 'sand') {
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`
            ctx.fill()
          } else {
            drawGlyph(ctx, p.x, p.y, p.size, p.rotation, p.burst ? alpha / 0.85 : p.opacity)
          }
          ctx.filter = 'none'
        })

      animationRef.current = requestAnimationFrame(loopWithTime)
    }

    const loopWithTime = (t) => loop(t)

    setSize()
    window.addEventListener('resize', setSize)
    animationRef.current = requestAnimationFrame(loopWithTime)
    return () => {
      window.removeEventListener('resize', setSize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [active, sandCount])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-30 ${className}`}
      style={{ left: 0, top: 0, width: '100%', height: '100%' }}
      aria-hidden
    />
  )
}

export { KairosSandCanvas }
