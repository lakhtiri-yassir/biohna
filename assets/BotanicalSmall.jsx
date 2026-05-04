export default function BotanicalSmall({ style, className }) {
  return (
    <svg viewBox="0 0 147 208" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block', ...style }} className={className}>

      {/* Ground */}
      <ellipse cx="73" cy="204" rx="35" ry="4" fill="#226217" opacity="0.15"/>

      {/* Grass */}
      {[38,50,62,74,86,98,110].map((x,i)=>(
        <path key={i} d={`M${x} 206 Q${x+(i%3-1)*5} ${185+i%3*5} ${x+(i%3-1)*3} ${172+i%4*4}`}
          stroke={['#9ee051','#7ec25d','#226217'][i%3]} strokeWidth="2" strokeLinecap="round" fill="none"/>
      ))}

      {/* Left stem */}
      <path d="M55 205 C53 178 49 155 46 135 C44 118 46 105 52 92" stroke="#226217" strokeWidth="5" strokeLinecap="round" fill="none"/>
      {/* Right stem */}
      <path d="M90 205 C92 178 96 155 99 135 C101 118 99 105 93 92" stroke="#226217" strokeWidth="5" strokeLinecap="round" fill="none"/>
      {/* Center stem */}
      <path d="M73 205 C73 175 72 148 72 122 C72 104 73 88 74 72" stroke="#2d6b1e" strokeWidth="6" strokeLinecap="round" fill="none"/>

      {/* Left branches */}
      <path d="M50 150 C40 140 28 134 16 132" stroke="#226217" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M48 120 C36 108 22 102 8 100" stroke="#49b337" strokeWidth="3" strokeLinecap="round" fill="none"/>

      {/* Right branches */}
      <path d="M96 150 C108 140 120 134 132 132" stroke="#226217" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M98 120 C112 108 126 102 140 100" stroke="#49b337" strokeWidth="3" strokeLinecap="round" fill="none"/>

      {/* Branch leaf clusters */}
      <ellipse cx="12" cy="130" rx="16" ry="22" transform="rotate(-20 12 130)" fill="#7ec25d"/>
      <ellipse cx="4" cy="138" rx="11" ry="15" transform="rotate(-30 4 138)" fill="#9ee051"/>
      <ellipse cx="5" cy="97" rx="14" ry="19" transform="rotate(-22 5 97)" fill="#226217"/>

      <ellipse cx="135" cy="129" rx="15" ry="21" transform="rotate(20 135 129)" fill="#7ec25d"/>
      <ellipse cx="143" cy="138" rx="11" ry="15" transform="rotate(30 143 138)" fill="#9ee051"/>
      <ellipse cx="143" cy="98" rx="13" ry="18" transform="rotate(22 143 98)" fill="#226217"/>

      {/* Top clusters */}
      <ellipse cx="64" cy="64" rx="22" ry="32" fill="#226217"/>
      <ellipse cx="80" cy="58" rx="20" ry="30" fill="#7ec25d"/>
      <ellipse cx="72" cy="48" rx="25" ry="36" fill="#2d6b1e"/>
      <ellipse cx="62" cy="40" rx="18" ry="26" fill="#9ee051" opacity="0.9"/>
      <ellipse cx="82" cy="44" rx="16" ry="24" fill="#7ec25d"/>

      {/* Top flower */}
      <circle cx="72" cy="38" r="9" fill="#9ee051"/>
      <circle cx="72" cy="38" r="5" fill="#7ec25d"/>
      <circle cx="72" cy="38" r="2.5" fill="#fffdf7" opacity="0.8"/>
    </svg>
  )
}
