// LeafIcon - Biohna plant seedling logo (natural 49×58)
export function LeafIcon({ size = 49, color = 'currentColor', style }) {
  const h = Math.round(size * 58/49)
  return (
    <svg width={size} height={h} viewBox="0 0 49 58" fill="none" style={style}>
      {/* stem */}
      <path d="M24.5 56 L24.5 33" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      {/* main leaf shape */}
      <path d="M24.5 4 C13 -1 3 7 5.5 20 C8 31 15.5 37 24.5 37 C33.5 37 41 31 43.5 20 C46 7 36 -1 24.5 4Z" fill={color}/>
      {/* center vein */}
      <path d="M24.5 5 L24.5 35" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
      {/* lateral veins left */}
      <path d="M24.5 14 Q17 18 13 20" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round"/>
      <path d="M24.5 21 Q18 24 15 26" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round"/>
      {/* lateral veins right */}
      <path d="M24.5 14 Q32 18 36 20" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round"/>
      <path d="M24.5 21 Q31 24 34 26" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round"/>
      {/* small base leaves */}
      <path d="M24.5 39 C19 35 13.5 38.5 15.5 43.5 C17 46.5 21 47 24.5 44.5Z" fill={color} opacity="0.75"/>
      <path d="M24.5 39 C30 35 35.5 38.5 33.5 43.5 C32 46.5 28 47 24.5 44.5Z" fill={color} opacity="0.75"/>
    </svg>
  )
}

// SearchIcon - magnifying glass (natural 45×45)
export function SearchIcon({ size = 45, color = 'currentColor', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 45 45" fill="none" style={style}>
      <circle cx="19" cy="19" r="11.5" stroke={color} strokeWidth="3.5" fill="none"/>
      <path d="M28 28 L40.5 40.5" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
    </svg>
  )
}

// HeartIcon - heart/wishlist (natural 39×42)
export function HeartIcon({ size = 39, color = 'currentColor', style }) {
  const h = Math.round(size * 42/39)
  return (
    <svg width={size} height={h} viewBox="0 0 39 42" fill="none" style={style}>
      <path d="M19.5 37.5 C19.5 37.5 3.5 25.5 3.5 14.5 C3.5 8.5 8 4.5 13.5 4.5 C16.5 4.5 19 6.5 19.5 8.5 C20 6.5 22.5 4.5 25.5 4.5 C31 4.5 35.5 8.5 35.5 14.5 C35.5 25.5 19.5 37.5 19.5 37.5Z" fill={color}/>
    </svg>
  )
}

// UserIcon - profile silhouette (natural 35×35)
export function UserIcon({ size = 35, color = 'currentColor', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 35 35" fill="none" style={style}>
      <circle cx="17.5" cy="12" r="7" fill={color}/>
      <path d="M4 31 C4 23 10 18 17.5 18 C25 18 31 23 31 31" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

// TrashIcon - delete item (natural 11×13)
export function TrashIcon({ width = 11, height = 13, color = 'currentColor', style }) {
  return (
    <svg width={width} height={height} viewBox="0 0 11 13" fill="none" style={style}>
      <rect x="1" y="3" width="9" height="9" rx="1.5" stroke={color} strokeWidth="1.2" fill="none"/>
      <path d="M0.5 3 L10.5 3" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M3.5 3 L3.5 1.5 Q3.5 1 4 1 L7 1 Q7.5 1 7.5 1.5 L7.5 3" stroke={color} strokeWidth="1.2"/>
      <line x1="4.5" y1="5.5" x2="4.5" y2="9.5" stroke={color} strokeWidth="1" strokeLinecap="round"/>
      <line x1="6.5" y1="5.5" x2="6.5" y2="9.5" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  )
}

// CloseIcon - X button
export function CloseIcon({ size = 14, color = 'currentColor', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={style}>
      <path d="M2 2 L12 12 M12 2 L2 12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// ArrowRightIcon - for buttons (natural 18×18)
export function ArrowRightIcon({ size = 18, color = 'currentColor', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={style}>
      <path d="M3 9 H15 M10 4 L15 9 L10 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// MemberIcon - person with star for CTA (natural 74×75)
export function MemberIcon({ width = 74, height = 75, color = 'currentColor', style }) {
  return (
    <svg width={width} height={height} viewBox="0 0 74 75" fill="none" style={style}>
      <circle cx="37" cy="24" r="14" fill={color} opacity="0.9"/>
      <path d="M10 67 C10 52 22 43 37 43 C52 43 64 52 64 67" fill={color} opacity="0.9"/>
      <path d="M55 10 L56.8 15.4 L62.5 15.4 L57.9 18.7 L59.7 24 L55 20.7 L50.3 24 L52.1 18.7 L47.5 15.4 L53.2 15.4 Z" fill="#9ee051"/>
    </svg>
  )
}

// FavoriteIcon - heart with plus (for product cards, 39×39)
export function FavoriteIcon({ size = 39, color = 'currentColor', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 39 39" fill="none" style={style}>
      <circle cx="19.5" cy="19.5" r="18" fill="white" stroke="#e0e0e0" strokeWidth="1"/>
      <path d="M19.5 27 C19.5 27 9 20 9 13.5 C9 10 11.5 7.5 14.5 7.5 C16.5 7.5 18 8.8 19.5 10.5 C21 8.8 22.5 7.5 24.5 7.5 C27.5 7.5 30 10 30 13.5 C30 20 19.5 27 19.5 27Z" fill={color}/>
    </svg>
  )
}
