// Oil/Honey illustration for "Huiles et Extraits"
export function HuileIllustration({ width = 228, height = 170 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 228 170" fill="none">
      {/* Background tint */}
      <rect width="228" height="170" rx="12" fill="#f0f8e8" opacity="0.5"/>

      {/* Honey jar */}
      <rect x="82" y="70" width="64" height="72" rx="8" fill="#ffd166" stroke="#226217" strokeWidth="2"/>
      <rect x="78" y="60" width="72" height="18" rx="6" fill="#ffb347" stroke="#226217" strokeWidth="2"/>
      <ellipse cx="114" cy="60" rx="36" ry="8" fill="#ffc850"/>
      {/* Jar label */}
      <rect x="88" y="82" width="52" height="38" rx="4" fill="white" opacity="0.7"/>
      <path d="M97 95 Q114 90 131 95" stroke="#226217" strokeWidth="1.5" fill="none"/>
      <path d="M97 102 Q114 98 131 102" stroke="#226217" strokeWidth="1.5" fill="none"/>
      {/* Honey drip */}
      <path d="M114 142 Q112 155 114 162 Q116 155 114 142Z" fill="#ffd166"/>

      {/* Leaf branch left */}
      <path d="M60 120 C48 105 40 90 45 75" stroke="#226217" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <ellipse cx="50" cy="83" rx="16" ry="22" transform="rotate(-30 50 83)" fill="#7ec25d"/>
      <ellipse cx="42" cy="100" rx="13" ry="18" transform="rotate(-20 42 100)" fill="#9ee051"/>
      <ellipse cx="57" cy="115" rx="12" ry="15" transform="rotate(-10 57 115)" fill="#226217" opacity="0.8"/>

      {/* Leaf branch right */}
      <path d="M168 120 C180 105 188 90 183 75" stroke="#226217" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <ellipse cx="178" cy="83" rx="16" ry="22" transform="rotate(30 178 83)" fill="#7ec25d"/>
      <ellipse cx="186" cy="100" rx="13" ry="18" transform="rotate(20 186 100)" fill="#9ee051"/>
      <ellipse cx="171" cy="115" rx="12" ry="15" transform="rotate(10 171 115)" fill="#226217" opacity="0.8"/>

      {/* Small flowers */}
      <circle cx="52" cy="72" r="7" fill="#9ee051"/>
      <circle cx="52" cy="72" r="3.5" fill="white" opacity="0.7"/>
      <circle cx="176" cy="72" r="7" fill="#9ee051"/>
      <circle cx="176" cy="72" r="3.5" fill="white" opacity="0.7"/>

      {/* Bottom grass */}
      {[70,85,100,114,128,142,158].map((x,i)=>(
        <path key={i} d={`M${x} 168 Q${x+(i%3-1)*3} ${150+i%3*4} ${x+(i%3-1)*2} ${138+i%4*5}`}
          stroke={['#9ee051','#7ec25d','#226217'][i%3]} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      ))}
    </svg>
  )
}

// Beauty/Argan illustration for "Soins & Beauté"
export function SoinIllustration({ width = 228, height = 170 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 228 170" fill="none">
      <rect width="228" height="170" rx="12" fill="#f0f8e8" opacity="0.5"/>

      {/* Argan oil bottle */}
      <rect x="96" y="55" width="36" height="85" rx="10" fill="white" stroke="#226217" strokeWidth="2"/>
      <rect x="100" y="48" width="28" height="14" rx="5" fill="#e0e0e0" stroke="#226217" strokeWidth="1.5"/>
      <rect x="108" y="40" width="12" height="12" rx="3" fill="#bdbdbd" stroke="#226217" strokeWidth="1.5"/>
      {/* Oil content */}
      <rect x="98" y="90" width="32" height="44" rx="8" fill="#ffd166" opacity="0.5"/>
      {/* Label */}
      <rect x="100" y="62" width="28" height="20" rx="3" fill="#9ee051" opacity="0.3"/>
      <path d="M104 69 Q114 66 124 69" stroke="#226217" strokeWidth="1" fill="none"/>
      <path d="M104 74 Q114 72 124 74" stroke="#226217" strokeWidth="1" fill="none"/>

      {/* Argan tree branches */}
      <path d="M72 155 C62 138 55 118 58 98 C60 84 68 72 72 60" stroke="#2d6b1e" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M156 155 C166 138 173 118 170 98 C168 84 160 72 156 60" stroke="#2d6b1e" strokeWidth="3.5" strokeLinecap="round" fill="none"/>

      {/* Argan leaves left */}
      <ellipse cx="56" cy="118" rx="18" ry="12" transform="rotate(-40 56 118)" fill="#7ec25d"/>
      <ellipse cx="48" cy="98" rx="15" ry="10" transform="rotate(-35 48 98)" fill="#9ee051"/>
      <ellipse cx="60" cy="78" rx="14" ry="9" transform="rotate(-25 60 78)" fill="#226217" opacity="0.85"/>

      {/* Argan leaves right */}
      <ellipse cx="172" cy="118" rx="18" ry="12" transform="rotate(40 172 118)" fill="#7ec25d"/>
      <ellipse cx="180" cy="98" rx="15" ry="10" transform="rotate(35 180 98)" fill="#9ee051"/>
      <ellipse cx="168" cy="78" rx="14" ry="9" transform="rotate(25 168 78)" fill="#226217" opacity="0.85"/>

      {/* Argan nuts */}
      <ellipse cx="50" cy="110" rx="6" ry="8" fill="#c8a96e"/>
      <ellipse cx="178" cy="110" rx="6" ry="8" fill="#c8a96e"/>
      <ellipse cx="62" cy="68" rx="5" ry="7" fill="#c8a96e"/>
      <ellipse cx="166" cy="68" rx="5" ry="7" fill="#c8a96e"/>

      {/* Rose petals decoration */}
      {[0,60,120,180,240,300].map((r,i)=>(
        <ellipse key={i} cx={114+Math.cos(r*Math.PI/180)*12} cy={30+Math.sin(r*Math.PI/180)*12}
          rx="7" ry="4" transform={`rotate(${r} ${114+Math.cos(r*Math.PI/180)*12} ${30+Math.sin(r*Math.PI/180)*12})`}
          fill="#ff8fab" opacity="0.7"/>
      ))}
      <circle cx="114" cy="30" r="5" fill="#ff6b9d"/>

      {/* Bottom grass */}
      {[70,85,100,114,128,142,158].map((x,i)=>(
        <path key={i} d={`M${x} 168 Q${x+(i%3-1)*3} ${150} ${x} ${138+i%3*4}`}
          stroke={['#9ee051','#7ec25d','#226217'][i%3]} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      ))}
    </svg>
  )
}

// Herbs & Spices illustration
export function HerbeIllustration({ width = 228, height = 170 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 228 170" fill="none">
      <rect width="228" height="170" rx="12" fill="#f0f8e8" opacity="0.5"/>

      {/* Herb stems - thyme/rosemary style */}
      {/* Left cluster */}
      <path d="M75 165 C73 148 70 130 68 115 C66 100 68 88 72 75" stroke="#226217" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M85 165 C85 145 84 125 83 108 C82 94 84 82 88 70" stroke="#49b337" strokeWidth="3" strokeLinecap="round" fill="none"/>

      {/* Left herb leaves - alternate pairs */}
      {[80,95,110,125,140,155].map((y,i)=>(
        <g key={i}>
          <ellipse cx={70+(i%2)*2} cy={y} rx="9" ry="5" transform={`rotate(${-30+(i%2)*60} ${70+(i%2)*2} ${y})`} fill="#7ec25d"/>
          <ellipse cx={80+(i%2)*2} cy={y-3} rx="8" ry="4" transform={`rotate(${30-(i%2)*60} ${80+(i%2)*2} ${y-3})`} fill="#9ee051"/>
        </g>
      ))}

      {/* Center herb bunch */}
      <path d="M110 165 C110 140 109 118 110 98 C110 82 112 68 114 55" stroke="#2d6b1e" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M118 165 C119 142 120 120 121 102 C122 86 120 72 118 58" stroke="#226217" strokeWidth="3" strokeLinecap="round" fill="none"/>

      {/* Center leaves */}
      {[65,80,95,110,125,140,155].map((y,i)=>(
        <g key={i}>
          <ellipse cx={104} cy={y} rx="11" ry="6" transform={`rotate(-35 104 ${y})`} fill="#226217"/>
          <ellipse cx={118} cy={y-2} rx="10" ry="5" transform={`rotate(35 118 ${y-2})`} fill="#7ec25d"/>
          <ellipse cx={112} cy={y+4} rx="8" ry="4" transform={`rotate(0 112 ${y+4})`} fill="#9ee051" opacity="0.8"/>
        </g>
      ))}

      {/* Right herb cluster */}
      <path d="M148 165 C148 145 149 127 150 110 C151 96 149 84 145 72" stroke="#226217" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M158 165 C159 148 160 130 160 113 C160 99 158 86 155 74" stroke="#49b337" strokeWidth="3" strokeLinecap="round" fill="none"/>

      {/* Right herb leaves */}
      {[80,95,110,125,140,155].map((y,i)=>(
        <g key={i}>
          <ellipse cx={143+(i%2)*2} cy={y} rx="9" ry="5" transform={`rotate(${-30+(i%2)*60} ${143+(i%2)*2} ${y})`} fill="#7ec25d"/>
          <ellipse cx={155+(i%2)*2} cy={y-2} rx="8" ry="4" transform={`rotate(${30-(i%2)*60} ${155+(i%2)*2} ${y-2})`} fill="#9ee051"/>
        </g>
      ))}

      {/* Flower tops */}
      <circle cx="114" cy="44" r="10" fill="#9ee051"/>
      <circle cx="114" cy="44" r="6" fill="#7ec25d"/>
      <circle cx="114" cy="44" r="3" fill="white" opacity="0.8"/>

      <circle cx="74" cy="62" r="7" fill="#9ee051"/>
      <circle cx="74" cy="62" r="3.5" fill="white" opacity="0.7"/>
      <circle cx="154" cy="62" r="7" fill="#9ee051"/>
      <circle cx="154" cy="62" r="3.5" fill="white" opacity="0.7"/>

      {/* Small spice dots */}
      {[0,1,2,3,4,5,6,7,8].map(i=>(
        <circle key={i} cx={88+i*7} cy={168} r="2" fill="#c8a000" opacity="0.6"/>
      ))}
    </svg>
  )
}

// Tea/Infusion illustration
export function InfusionIllustration({ width = 228, height = 170 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 228 170" fill="none">
      <rect width="228" height="170" rx="12" fill="#f0f8e8" opacity="0.5"/>

      {/* Tea cup */}
      <path d="M78 110 L84 155 Q114 162 144 155 L150 110 Z" fill="#fffdf7" stroke="#226217" strokeWidth="2"/>
      <path d="M78 110 Q114 104 150 110" stroke="#226217" strokeWidth="2" fill="none"/>
      {/* Cup interior color */}
      <path d="M82 115 L87 150 Q114 156 141 150 L146 115 Q114 110 82 115 Z" fill="#c8a000" opacity="0.3"/>
      {/* Handle */}
      <path d="M150 120 Q165 120 165 135 Q165 150 150 150" stroke="#226217" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Saucer */}
      <ellipse cx="114" cy="158" rx="42" ry="8" fill="white" stroke="#226217" strokeWidth="1.5"/>

      {/* Steam wisps */}
      <path d="M97 105 Q93 95 97 86 Q101 77 97 68" stroke="#7ec25d" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
      <path d="M114 102 Q110 91 114 81 Q118 71 114 61" stroke="#9ee051" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
      <path d="M131 105 Q135 95 131 86 Q127 77 131 68" stroke="#7ec25d" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>

      {/* Mint / tea leaves left */}
      <path d="M55 155 C45 138 40 120 44 104 C46 92 52 80 58 68" stroke="#2d6b1e" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <ellipse cx="47" cy="112" rx="16" ry="10" transform="rotate(-35 47 112)" fill="#7ec25d"/>
      <ellipse cx="42" cy="94" rx="14" ry="9" transform="rotate(-28 42 94)" fill="#9ee051"/>
      <ellipse cx="52" cy="78" rx="13" ry="8" transform="rotate(-20 52 78)" fill="#226217" opacity="0.85"/>
      <ellipse cx="60" cy="60" rx="12" ry="8" transform="rotate(-15 60 60)" fill="#7ec25d"/>

      {/* Mint / tea leaves right */}
      <path d="M173 155 C183 138 188 120 184 104 C182 92 176 80 170 68" stroke="#2d6b1e" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <ellipse cx="181" cy="112" rx="16" ry="10" transform="rotate(35 181 112)" fill="#7ec25d"/>
      <ellipse cx="186" cy="94" rx="14" ry="9" transform="rotate(28 186 94)" fill="#9ee051"/>
      <ellipse cx="176" cy="78" rx="13" ry="8" transform="rotate(20 176 78)" fill="#226217" opacity="0.85"/>
      <ellipse cx="168" cy="60" rx="12" ry="8" transform="rotate(15 168 60)" fill="#7ec25d"/>

      {/* Tea leaf droplets in cup */}
      <circle cx="100" cy="135" r="4" fill="#226217" opacity="0.4"/>
      <circle cx="115" cy="140" r="3" fill="#226217" opacity="0.4"/>
      <circle cx="130" cy="135" r="4" fill="#226217" opacity="0.4"/>

      {/* Ground grass */}
      {[70,85,100,114,128,142,158].map((x,i)=>(
        <path key={i} d={`M${x} 168 Q${x+(i%3-1)*3} ${154} ${x} ${142+i%3*4}`}
          stroke={['#9ee051','#7ec25d','#226217'][i%3]} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      ))}
    </svg>
  )
}
