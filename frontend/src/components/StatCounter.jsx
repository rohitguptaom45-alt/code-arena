import React, { useEffect, useRef, useState } from 'react'

export default function StatCounter({ target, suffix = '', label, duration = 1500 }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(step)
            else setValue(target)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <div ref={ref} className="text-center">
      <div className="font-display font-extrabold text-3xl md:text-4xl text-ink">
        {value.toLocaleString('en-IN')}
        {suffix}
      </div>
      <div className="text-sm text-ink-soft mt-1">{label}</div>
    </div>
  )
}
