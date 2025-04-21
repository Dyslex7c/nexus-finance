"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Hexagon, Wallet } from "lucide-react"

interface CryptoLoaderProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function CryptoLoader({ size = "md", className }: CryptoLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Size mappings
  const dimensions = {
    sm: { size: 120, icon: 48, inner: 24, particles: 20, orbitRadius: 40 },
    md: { size: 180, icon: 64, inner: 32, particles: 30, orbitRadius: 60 },
    lg: { size: 240, icon: 96, inner: 48, particles: 40, orbitRadius: 80 },
    xl: { size: 320, icon: 128, inner: 64, particles: 50, orbitRadius: 100 },
  }

  const {
    size: containerSize,
    icon: iconSize,
    inner: innerSize,
    particles: particleCount,
    orbitRadius,
  } = dimensions[size]

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // Set canvas size - making it match the container size to keep animations contained
    const pixelRatio = window.devicePixelRatio || 1
    const width = containerSize
    const height = containerSize

    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.scale(pixelRatio, pixelRatio)

    // Center point
    const centerX = width / 2
    const centerY = height / 2

    // Create particles
    const particles: {
      x: number
      y: number
      size: number
      speed: number
      angle: number
      orbitRadius: number
      color: string
      rgbColor: string
      opacity: number
      pulse: number
      pulseSpeed: number
      trail: { x: number; y: number; opacity: number }[]
    }[] = []

    // Helper function to convert HSL to RGB
    const hslToRgb = (h: number, s: number, l: number) => {
      s /= 100
      l /= 100
      const k = (n: number) => (n + h / 30) % 12
      const a = s * Math.min(l, 1 - l)
      const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
      return `rgb(${Math.round(f(0) * 255)}, ${Math.round(f(8) * 255)}, ${Math.round(f(4) * 255)})`
    }

    // Create a more diverse color palette
    const colorPalette = [
      { h: 180, s: 70, l: 60 }, // Cyan
      { h: 210, s: 70, l: 60 }, // Blue
      { h: 270, s: 70, l: 60 }, // Purple
      { h: 330, s: 70, l: 60 }, // Pink
      { h: 150, s: 70, l: 60 }, // Teal
    ]

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const orbitRadiusVariation = orbitRadius * (0.5 + Math.random() * 0.5)

      // Select a color from the palette
      const colorIndex = Math.floor(Math.random() * colorPalette.length)
      const { h, s, l } = colorPalette[colorIndex]
      const rgbColor = hslToRgb(h, s, l)

      particles.push({
        x: centerX + Math.cos(angle) * orbitRadiusVariation,
        y: centerY + Math.sin(angle) * orbitRadiusVariation,
        size: 1.5 + Math.random() * 3,
        speed: 0.01 + Math.random() * 0.03,
        angle,
        orbitRadius: orbitRadiusVariation,
        color: `hsl(${h}, ${s}%, ${l}%)`,
        rgbColor,
        opacity: 0.6 + Math.random() * 0.4,
        pulse: Math.random() * Math.PI * 2, // Random starting phase
        pulseSpeed: 0.02 + Math.random() * 0.03,
        trail: [], // Store trail positions
      })
    }

    // Create energy lines
    const energyLines: {
      startAngle: number
      length: number
      width: number
      speed: number
      color: string
      opacity: number
    }[] = []

    for (let i = 0; i < 12; i++) {
      const startAngle = (i / 12) * Math.PI * 2
      const colorIndex = i % colorPalette.length
      const { h, s, l } = colorPalette[colorIndex]

      energyLines.push({
        startAngle,
        length: 10 + Math.random() * 15,
        width: 0.5 + Math.random() * 1.5,
        speed: 0.01 + Math.random() * 0.02,
        color: `hsl(${h}, ${s}%, ${l}%)`,
        opacity: 0.6 + Math.random() * 0.4,
      })
    }

    // Animation variables
    let rotation = 0
    let pulsePhase = 0
    let haloSize = 0
    let haloOpacity = 0.5
    let frameCount = 0

    // Animation function
    const animate = () => {
      frameCount++
      ctx.clearRect(0, 0, width, height)

      // Create circular mask to contain everything
      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, width / 2, 0, Math.PI * 2)
      ctx.clip()

      // Background glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, orbitRadius * 1.2)
      gradient.addColorStop(0, "rgba(34, 211, 238, 0.15)")
      gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.08)")
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Update pulse phase
      pulsePhase += 0.02
      haloSize = orbitRadius * (0.8 + Math.sin(pulsePhase) * 0.2)
      haloOpacity = 0.3 + Math.sin(pulsePhase) * 0.2

      // Draw outer halo
      ctx.beginPath()
      ctx.arc(centerX, centerY, haloSize, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(34, 211, 238, ${haloOpacity})`
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Draw second outer halo
      ctx.beginPath()
      ctx.arc(centerX, centerY, haloSize * 0.8, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(168, 85, 247, ${haloOpacity * 0.8})`
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw energy lines
      energyLines.forEach((line) => {
        line.startAngle += line.speed

        const startX = centerX + Math.cos(line.startAngle) * (iconSize / 3)
        const startY = centerY + Math.sin(line.startAngle) * (iconSize / 3)
        const endX = centerX + Math.cos(line.startAngle) * (iconSize / 3 + line.length)
        const endY = centerY + Math.sin(line.startAngle) * (iconSize / 3 + line.length)

        // Extract RGB values from hex color
        let r = 0,
          g = 0,
          b = 0
        const hslMatch = line.color.match(/hsl$$(\d+),\s*(\d+)%,\s*(\d+)%$$/)
        if (hslMatch) {
          const h = Number.parseInt(hslMatch[1])
          const s = Number.parseInt(hslMatch[2])
          const l = Number.parseInt(hslMatch[3])
          const rgbColor = hslToRgb(h, s, l)
          const rgbMatch = rgbColor.match(/rgb$$(\d+),\s*(\d+),\s*(\d+)$$/)
          if (rgbMatch) {
            r = Number.parseInt(rgbMatch[1])
            g = Number.parseInt(rgbMatch[2])
            b = Number.parseInt(rgbMatch[3])
          }
        }

        const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
        gradient.addColorStop(0, line.color)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = gradient
        ctx.lineWidth = line.width
        ctx.globalAlpha = line.opacity
        ctx.stroke()
        ctx.globalAlpha = 1
      })

      // Update and draw particles
      particles.forEach((particle) => {
        // Update particle position
        particle.angle += particle.speed
        const newX = centerX + Math.cos(particle.angle) * particle.orbitRadius
        const newY = centerY + Math.sin(particle.angle) * particle.orbitRadius

        // Add current position to trail
        if (frameCount % 3 === 0) {
          particle.trail.push({
            x: particle.x,
            y: particle.y,
            opacity: 0.7,
          })

          // Limit trail length
          if (particle.trail.length > 5) {
            particle.trail.shift()
          }
        }

        // Update position
        particle.x = newX
        particle.y = newY

        // Update pulse
        particle.pulse += particle.pulseSpeed
        const pulseFactor = 0.7 + Math.sin(particle.pulse) * 0.3

        // Extract RGB values from the rgbColor string
        const rgbMatch = particle.rgbColor.match(/rgb$$(\d+),\s*(\d+),\s*(\d+)$$/)
        let r = 0,
          g = 0,
          b = 0
        if (rgbMatch) {
          r = Number.parseInt(rgbMatch[1])
          g = Number.parseInt(rgbMatch[2])
          b = Number.parseInt(rgbMatch[3])
        }

        // Draw particle trail
        particle.trail.forEach((point, index) => {
          const trailOpacity = point.opacity * (index / particle.trail.length)

          ctx.beginPath()
          ctx.arc(point.x, point.y, particle.size * 0.6 * (index / particle.trail.length + 0.2), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${trailOpacity})`
          ctx.fill()

          // Fade out trail points
          point.opacity *= 0.85
        })

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * pulseFactor, 0, Math.PI * 2)

        // Create gradient for particle
        const particleGradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * pulseFactor,
        )
        particleGradient.addColorStop(0, particle.color)
        particleGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.fillStyle = particleGradient
        ctx.globalAlpha = particle.opacity * pulseFactor
        ctx.fill()
        ctx.globalAlpha = 1

        // Occasionally emit a burst
        if (Math.random() < 0.001) {
          drawParticleBurst(particle.x, particle.y, r, g, b)
        }
      })

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < orbitRadius / 3) {
            const opacity = (1 - distance / (orbitRadius / 3)) * 0.2

            // Extract RGB values for both particles
            const rgbMatch1 = particles[i].rgbColor.match(/rgb$$(\d+),\s*(\d+),\s*(\d+)$$/)
            const rgbMatch2 = particles[j].rgbColor.match(/rgb$$(\d+),\s*(\d+),\s*(\d+)$$/)

            let r1 = 0,
              g1 = 0,
              b1 = 0,
              r2 = 0,
              g2 = 0,
              b2 = 0

            if (rgbMatch1) {
              r1 = Number.parseInt(rgbMatch1[1])
              g1 = Number.parseInt(rgbMatch1[2])
              b1 = Number.parseInt(rgbMatch1[3])
            }

            if (rgbMatch2) {
              r2 = Number.parseInt(rgbMatch2[1])
              g2 = Number.parseInt(rgbMatch2[2])
              b2 = Number.parseInt(rgbMatch2[3])
            }

            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)

            const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y)
            gradient.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, ${opacity})`)
            gradient.addColorStop(1, `rgba(${r2}, ${g2}, ${b2}, ${opacity})`)

            ctx.strokeStyle = gradient
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Draw hexagonal grid pattern
      const gridSize = 10
      const gridOpacity = 0.1 + Math.sin(pulsePhase * 0.5) * 0.05

      ctx.strokeStyle = `rgba(34, 211, 238, ${gridOpacity})`
      ctx.lineWidth = 0.5

      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2
        const nextAngle = ((i + 1) / 6) * Math.PI * 2

        for (let radius = orbitRadius * 0.3; radius <= orbitRadius; radius += gridSize) {
          ctx.beginPath()
          ctx.arc(centerX, centerY, radius, angle, nextAngle)
          ctx.stroke()

          // Radial lines
          if (i % 2 === 0) {
            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            const endX = centerX + Math.cos(angle) * orbitRadius
            const endY = centerY + Math.sin(angle) * orbitRadius
            ctx.lineTo(endX, endY)
            ctx.stroke()
          }
        }
      }

      // Update rotation
      rotation += 0.005

      // Restore context (remove clipping)
      ctx.restore()

      requestAnimationFrame(animate)
    }

    // Function to draw particle burst
    const drawParticleBurst = (x: number, y: number, r: number, g: number, b: number) => {
      const burstParticles = 8
      const burstRadius = 8

      for (let i = 0; i < burstParticles; i++) {
        const angle = (i / burstParticles) * Math.PI * 2
        const burstX = x + Math.cos(angle) * burstRadius
        const burstY = y + Math.sin(angle) * burstRadius

        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(burstX, burstY)

        const gradient = ctx.createLinearGradient(x, y, burstX, burstY)
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.8)`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      // No cleanup needed for canvas
    }
  }, [containerSize, iconSize, innerSize, orbitRadius, particleCount, size])

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
    >
      {/* Circular container with glow effect */}
      <div
        className="absolute rounded-full"
        style={{
          width: `${containerSize}px`,
          height: `${containerSize}px`,
          background: "radial-gradient(circle, rgba(8,145,178,0.1) 0%, rgba(6,182,212,0.05) 50%, rgba(0,0,0,0) 70%)",
          boxShadow: "0 0 20px rgba(8,145,178,0.2) inset",
        }}
      />

      {/* Canvas for particle effects */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full rounded-full"
        style={{
          filter: "blur(0.5px)",
          transform: "translate3d(0, 0, 0)", // Hardware acceleration
        }}
      />

      {/* Main container */}
      <div
        ref={containerRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          animation: "float 3s ease-in-out infinite",
        }}
      >
        {/* Hexagon container with 3D effect */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Rotating hexagon */}
          <div
            style={{
              width: `${iconSize}px`,
              height: `${iconSize}px`,
              animation: "spin 8s linear infinite",
              transform: "rotateY(30deg)",
              transformStyle: "preserve-3d",
              position: "relative",
            }}
          >
            {/* Hexagon icon */}
            <Hexagon
              style={{
                width: "100%",
                height: "100%",
                color: "#22d3ee",
                fill: "rgba(8, 145, 178, 0.3)",
                filter: "drop-shadow(0 0 10px rgba(34, 211, 238, 0.5))",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />

            {/* Inner wallet icon */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: `${innerSize}px`,
                height: `${innerSize}px`,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            >
              <Wallet
                style={{
                  width: "100%",
                  height: "100%",
                  color: "#a5f3fc",
                  filter: "drop-shadow(0 0 5px rgba(165, 243, 252, 0.7))",
                }}
              />
            </div>
          </div>

          {/* Pulsating rings */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: `${iconSize * (1 + i * 0.2)}px`,
                height: `${iconSize * (1 + i * 0.2)}px`,
                borderRadius: "50%",
                border: `${1 + i * 0.3}px solid ${i % 2 === 0 ? "rgba(34, 211, 238, 0.3)" : "rgba(168, 85, 247, 0.3)"}`,
                transform: "translate(-50%, -50%)",
                animation: `pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite ${i * 0.6}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes spin {
          0% { transform: rotateY(30deg) rotateZ(0deg); }
          100% { transform: rotateY(30deg) rotateZ(360deg); }
        }
        
        @keyframes pulse-ring {
          0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
