import { useRef, useEffect } from 'react'

const FLAKE_COUNT = 180
const FLAKE_COUNT_FOREGROUND = 48
const FOREGROUND_OPACITY = 0.32
const MIN_SIZE = 1
const MAX_SIZE = 4
const SWAY_AMPLITUDE = 0.8
const SWAY_FREQUENCY = 0.002
const FALL_SPEED_MIN = 0.15
const FALL_SPEED_MAX = 0.8
const OPACITY_MIN = 0.25
const OPACITY_MAX = 0.9

function createFlake(width, height, existingFlakes = []) {
  const size = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE)
  const fallSpeed = FALL_SPEED_MIN + (size / MAX_SIZE) * (FALL_SPEED_MAX - FALL_SPEED_MIN)
  const opacity = OPACITY_MIN + (size / MAX_SIZE) * (OPACITY_MAX - OPACITY_MIN)
  const phase = Math.random() * Math.PI * 2
  return {
    x: Math.random() * (width + 20) - 10,
    y: existingFlakes.length ? Math.random() * height : Math.random() * (height + 50) - 50,
    size,
    fallSpeed,
    opacity,
    phase,
  }
}

function initFlakes(width, height, count = FLAKE_COUNT) {
  const flakes = []
  for (let i = 0; i < count; i++) {
    flakes.push(createFlake(width, height, flakes))
  }
  return flakes
}

export default function SnowCanvas({ active = true, foreground = false, className = '' }) {
  const canvasRef = useRef(null)
  const flakesRef = useRef([])
  const animationRef = useRef(null)
  const dimensionsRef = useRef({ w: 0, h: 0 })
  const flakeCount = foreground ? FLAKE_COUNT_FOREGROUND : FLAKE_COUNT

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active) return

    const ctx = canvas.getContext('2d')
    let time = 0

    function setSize() {
      const w = window.innerWidth
      const h = window.innerHeight
      const dpr = window.devicePixelRatio || 1

      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      dimensionsRef.current = { w: window.innerWidth, h: window.innerHeight }

      const { w: cw, h: ch } = dimensionsRef.current
      if (flakesRef.current.length === 0) {
        flakesRef.current = initFlakes(cw, ch, flakeCount)
      } else {
        flakesRef.current = flakesRef.current.map((f) => ({
          ...f,
          x: Math.min(f.x, cw + 10),
          y: f.y % (ch + 20),
        }))
      }
    }

    function loop() {
      const { w, h } = dimensionsRef.current
      if (!w || !h) {
        animationRef.current = requestAnimationFrame(loop)
        return
      }

      ctx.clearRect(0, 0, w, h)
      time += 1

      flakesRef.current.forEach((flake) => {
        const sway = Math.sin(time * SWAY_FREQUENCY + flake.phase) * SWAY_AMPLITUDE * (1 + flake.size * 0.5)
        flake.x += sway
        flake.y += flake.fallSpeed

        if (flake.y > h + flake.size) {
          flake.y = -flake.size
          flake.x = Math.random() * (w + 20) - 10
        }
        if (flake.y < -flake.size) flake.y = h + flake.size
        if (flake.x > w + flake.size) flake.x = -flake.size
        if (flake.x < -flake.size) flake.x = w + flake.size

        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2)
        const opacity = foreground ? flake.opacity * FOREGROUND_OPACITY : flake.opacity
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(loop)
    }

    const handleResize = () => {
      setSize()
    }

    setSize()
    window.addEventListener('resize', handleResize)
    animationRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [active, foreground, flakeCount])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ left: 0, top: 0, width: '100%', height: '100%' }}
      aria-hidden
    />
  )
}
