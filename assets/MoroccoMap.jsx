export default function MoroccoMap({ style, className }) {
  // Morocco outline: simplified but recognizable
  // Northwestern tip of Africa, bordered by Atlantic (W), Mediterranean (N), Algeria (E), Western Sahara (S)
  return (
    <svg viewBox="0 0 400 460" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block', ...style }} className={className}>
      <defs>
        <radialGradient id="moroccoGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#9ee051" stopOpacity="0.6"/>
          <stop offset="60%" stopColor="#7ec25d" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#226217" stopOpacity="0.3"/>
        </radialGradient>
        <filter id="mapGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      {/* Morocco main shape - approximate outline */}
      <path
        d="M 95 15
           C 108 12 125 10 145 14
           C 165 18 180 24 195 22
           C 210 20 225 14 238 16
           C 252 18 260 28 268 32
           C 274 35 280 36 285 38
           C 290 40 292 45 290 52
           C 288 58 284 64 285 70
           C 286 78 292 84 290 92
           C 288 100 280 108 278 116
           C 276 124 280 132 278 140
           C 276 148 270 154 268 162
           C 266 170 268 178 266 188
           C 264 198 258 208 256 218
           C 254 228 256 238 254 248
           C 252 258 246 268 245 280
           C 244 292 246 305 244 318
           C 242 330 236 340 235 355
           C 234 368 236 382 234 398
           C 232 414 228 430 226 444
           C 224 458 222 465 220 460
           L 44 460
           C 42 450 40 432 38 415
           C 36 398 38 382 36 366
           C 34 350 28 336 26 320
           C 24 304 26 290 24 276
           C 22 262 16 250 14 238
           C 12 226 14 214 12 202
           C 10 190 4 180 4 168
           C 4 156 8 146 10 134
           C 12 122 10 110 12 100
           C 14 90 20 82 22 72
           C 24 62 22 52 26 44
           C 30 36 38 30 48 24
           C 58 18 78 16 95 15 Z"
        fill="url(#moroccoGrad)"
        stroke="#7ec25d"
        strokeWidth="2"
        filter="url(#mapGlow)"
      />

      {/* Atlas mountain range suggestion */}
      <path d="M 60 140 Q 100 120 140 135 Q 180 150 220 140 Q 240 135 255 145"
        stroke="#226217" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" fill="none"/>
      <path d="M 80 180 Q 130 160 175 175 Q 210 188 240 180"
        stroke="#226217" strokeWidth="1" strokeDasharray="3 3" opacity="0.35" fill="none"/>

      {/* Major cities dots */}
      <circle cx="110" cy="52" r="5" fill="#226217" opacity="0.7"/>
      <circle cx="96" cy="60" r="3.5" fill="#226217" opacity="0.6"/>
      <circle cx="85" cy="145" r="5" fill="#226217" opacity="0.7"/>
      <circle cx="168" cy="88" r="4" fill="#226217" opacity="0.6"/>
      <circle cx="130" cy="110" r="4" fill="#226217" opacity="0.6"/>
      <circle cx="60" cy="200" r="3.5" fill="#226217" opacity="0.55"/>
      <circle cx="108" cy="240" r="4" fill="#226217" opacity="0.6"/>

      {/* City labels - tiny dots for major cities */}
      <circle cx="110" cy="52" r="2" fill="white" opacity="0.8"/>
      <circle cx="85" cy="145" r="2" fill="white" opacity="0.8"/>
      <circle cx="168" cy="88" r="2" fill="white" opacity="0.7"/>

      {/* Decorative botanical accent */}
      <path d="M 270 200 Q 285 190 295 205 Q 300 215 288 220 Q 275 218 270 200 Z" fill="#9ee051" opacity="0.3"/>
      <path d="M 30 300 Q 18 288 20 300 Q 22 312 34 308 Q 38 302 30 300 Z" fill="#9ee051" opacity="0.25"/>
    </svg>
  )
}
