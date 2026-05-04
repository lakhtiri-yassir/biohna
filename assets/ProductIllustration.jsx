// Honey jar with botanical accent — used as the product illustration overlay
export default function ProductIllustration({ style, rotate = 9.71, width = 209, height = 314 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 209 314" fill="none"
      style={{ transform: `rotate(${rotate}deg)`, ...style }}>
      {/* Jar body */}
      <rect x="34" y="80" width="141" height="196" rx="20" fill="#ffd97d" stroke="#c8900a" strokeWidth="3"/>
      {/* Jar neck */}
      <rect x="50" y="58" width="109" height="30" rx="8" fill="#ffe09a" stroke="#c8900a" strokeWidth="2.5"/>
      {/* Lid */}
      <rect x="44" y="40" width="121" height="24" rx="10" fill="#f0a500" stroke="#c8900a" strokeWidth="2.5"/>
      {/* Lid highlight */}
      <rect x="52" y="44" width="105" height="8" rx="4" fill="rgba(255,255,255,0.3)"/>

      {/* Jar label */}
      <rect x="42" y="108" width="125" height="120" rx="10" fill="white" opacity="0.75"/>
      {/* Label botanical frame */}
      <path d="M52 115 Q104 108 156 115 Q162 125 162 148 Q162 175 156 185 Q104 192 52 185 Q46 175 46 148 Q46 125 52 115 Z"
        fill="#f0f8e8" stroke="#9ee051" strokeWidth="1.5"/>
      {/* Label text lines */}
      <path d="M62 132 Q104 128 146 132" stroke="#226217" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M62 142 Q104 139 146 142" stroke="#226217" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M70 152 Q104 149 138 152" stroke="#9ee051" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

      {/* Small botanical on label */}
      <path d="M104 158 C100 145 97 135 99 125" stroke="#49b337" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="97" cy="130" rx="8" ry="12" transform="rotate(-20 97 130)" fill="#9ee051" opacity="0.7"/>
      <ellipse cx="111" cy="128" rx="7" ry="11" transform="rotate(20 111 128)" fill="#7ec25d" opacity="0.7"/>

      {/* Honey drip */}
      <path d="M104 276 Q101 294 104 308 Q107 294 104 276Z" fill="#ffd97d" stroke="#c8900a" strokeWidth="1"/>
      <path d="M128 272 Q125 288 128 300 Q131 288 128 272Z" fill="#ffd97d" stroke="#c8900a" strokeWidth="0.8"/>

      {/* Jar shine */}
      <path d="M52 88 Q55 82 55 160" stroke="rgba(255,255,255,0.5)" strokeWidth="6" strokeLinecap="round" fill="none"/>

      {/* Hex pattern on jar */}
      <path d="M58 244 L66 240 L74 244 L74 252 L66 256 L58 252 Z" stroke="#c8900a" strokeWidth="1" fill="none" opacity="0.4"/>
      <path d="M74 244 L82 240 L90 244 L90 252 L82 256 L74 252 Z" stroke="#c8900a" strokeWidth="1" fill="none" opacity="0.4"/>

      {/* Small bee silhouette */}
      <ellipse cx="155" cy="90" rx="8" ry="5" fill="#ffd97d" stroke="#333" strokeWidth="0.8"/>
      <path d="M147 90 L163 90" stroke="#333" strokeWidth="1.5"/>
      <path d="M150 86 Q155 80 160 86" fill="rgba(200,200,255,0.5)" stroke="#333" strokeWidth="0.6"/>
      <path d="M150 94 Q155 100 160 94" fill="rgba(200,200,255,0.5)" stroke="#333" strokeWidth="0.6"/>
    </svg>
  )
}
