import React, { useEffect, useState } from 'react'
import { Mail, Phone, MapPin, Globe, Code2, Heart } from 'lucide-react'
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from './SocialIcons'

const icons = [GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon, Mail, Phone, MapPin, Globe, Code2, Heart]
const colors = ['#E84393', '#6CB4EE', '#FD79A8', '#A8D8EA', '#E84393', '#6CB4EE']

function randomBetween(a, b) { return Math.random() * (b - a) + a }

export default function BubbleAnimation({ count = 20 }) {
  const [bubbles, setBubbles] = useState([])

  useEffect(() => {
    const generated = Array.from({ length: count }, (_, i) => {
      const Icon = icons[Math.floor(Math.random() * icons.length)]
      const color = colors[Math.floor(Math.random() * colors.length)]
      const size = randomBetween(18, 40)
      const dur = randomBetween(14, 24)
      const delay = randomBetween(0, 6)
      const x = randomBetween(3, 95)
      const y = randomBetween(3, 95)
      const op = randomBetween(0.12, 0.3)
      const driftX = randomBetween(-40, 40)
      const driftY = randomBetween(-50, -15)
      return { id: i, Icon, color, size, dur, delay, x, y, op, driftX, driftY }
    })
    setBubbles(generated)
  }, [count])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {bubbles.map(b => (
        <div
          key={b.id}
          style={{
            position: 'absolute',
            left: `${b.x}%`,
            top: `${b.y}%`,
            opacity: b.op,
            pointerEvents: 'none',
            animation: `bubbleDrift${b.id % 4} ${b.dur}s ease-in-out ${b.delay}s infinite`,
          }}
        >
          <b.Icon size={b.size} color={b.color} />
        </div>
      ))}
      <style>{`
        @keyframes bubbleDrift0 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(15px, -30px) rotate(8deg); }
          50% { transform: translate(-10px, -20px) rotate(-5deg); }
          75% { transform: translate(20px, -45px) rotate(3deg); }
        }
        @keyframes bubbleDrift1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-20px, -25px) rotate(-6deg); }
          50% { transform: translate(15px, -40px) rotate(4deg); }
          75% { transform: translate(-15px, -15px) rotate(-3deg); }
        }
        @keyframes bubbleDrift2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -40px) rotate(5deg); }
          50% { transform: translate(-20px, -15px) rotate(-8deg); }
          75% { transform: translate(15px, -35px) rotate(6deg); }
        }
        @keyframes bubbleDrift3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-15px, -35px) rotate(-4deg); }
          50% { transform: translate(20px, -25px) rotate(7deg); }
          75% { transform: translate(-10px, -45px) rotate(-5deg); }
        }
      `}</style>
    </div>
  )
}
