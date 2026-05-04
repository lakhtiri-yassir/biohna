'use client'

import { useEffect, useState } from 'react'

const DESIGN_WIDTH = 1920

export default function ViewportScale({ children }) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      setScale(window.innerWidth / DESIGN_WIDTH)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div style={{ width: '100vw', overflowX: 'hidden' }}>
      <div
        style={{
          width: `${DESIGN_WIDTH}px`,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
