export default function BotanicalLeft({ style, className }) {
  return (
    <svg viewBox="0 0 181 753" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block', ...style }} className={className}>
      <defs>
        <radialGradient id="leafGrad1" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#9ee051"/>
          <stop offset="100%" stopColor="#226217"/>
        </radialGradient>
        <radialGradient id="leafGrad2" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#7ec25d"/>
          <stop offset="100%" stopColor="#1a5010"/>
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="90" cy="748" rx="45" ry="6" fill="#226217" opacity="0.15"/>

      {/* Grass blades */}
      <path d="M62 748 Q56 718 54 700 Q60 698 64 716Z" fill="#7ec25d"/>
      <path d="M72 750 Q70 722 69 703 Q75 703 77 722Z" fill="#9ee051"/>
      <path d="M83 752 Q82 724 82 706 Q88 707 88 726Z" fill="#226217"/>
      <path d="M96 751 Q97 723 100 706 Q105 708 103 727Z" fill="#7ec25d"/>
      <path d="M108 750 Q112 720 115 703 Q120 706 116 725Z" fill="#9ee051"/>
      <path d="M118 748 Q124 720 128 705 Q132 709 127 727Z" fill="#49b337"/>

      {/* Small ground plants */}
      <path d="M44 745 Q40 728 36 715 Q42 714 44 730Z" fill="#9ee051" opacity="0.7"/>
      <path d="M142 744 Q147 727 152 716 Q157 717 153 732Z" fill="#7ec25d" opacity="0.7"/>

      {/* Main trunk - organic curve */}
      <path d="M90 748 C89 710 86 665 84 615 C82 565 83 515 85 465 C87 415 88 360 89 305 C90 260 91 215 90 170 C89 140 89 118 90 95"
        stroke="#2d6b1e" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <path d="M90 748 C91 710 94 665 94 615 C94 565 92 515 90 465 C89 415 89 360 89.5 305"
        stroke="#49b337" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.3"/>

      {/* Branch Left 1 - low */}
      <path d="M85 580 C72 565 54 555 35 552" stroke="#2d6b1e" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      {/* Branch Right 1 - low */}
      <path d="M87 605 C101 590 120 582 140 580" stroke="#2d6b1e" strokeWidth="5.5" strokeLinecap="round" fill="none"/>

      {/* Branch Left 2 - mid-low */}
      <path d="M86 460 C70 445 49 436 26 433" stroke="#2d6b1e" strokeWidth="5" strokeLinecap="round" fill="none"/>
      {/* Branch Right 2 - mid-low */}
      <path d="M88 485 C104 468 126 460 148 457" stroke="#2d6b1e" strokeWidth="5" strokeLinecap="round" fill="none"/>

      {/* Branch Left 3 - mid */}
      <path d="M88 355 C73 338 52 329 28 326" stroke="#2d6b1e" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      {/* Branch Right 3 - mid */}
      <path d="M89 378 C107 361 130 353 153 350" stroke="#2d6b1e" strokeWidth="4.5" strokeLinecap="round" fill="none"/>

      {/* Branch Left 4 - upper */}
      <path d="M89 240 C74 224 54 216 30 213" stroke="#226217" strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Branch Right 4 - upper */}
      <path d="M90 262 C108 246 130 238 152 235" stroke="#226217" strokeWidth="4" strokeLinecap="round" fill="none"/>

      {/* LOW BRANCH CLUSTERS */}
      <ellipse cx="28" cy="549" rx="21" ry="29" transform="rotate(-18 28 549)" fill="#226217"/>
      <ellipse cx="16" cy="540" rx="16" ry="23" transform="rotate(-28 16 540)" fill="#7ec25d"/>
      <ellipse cx="38" cy="541" rx="14" ry="20" transform="rotate(-8 38 541)" fill="#9ee051" opacity="0.9"/>

      <ellipse cx="144" cy="577" rx="20" ry="27" transform="rotate(16 144 577)" fill="#226217"/>
      <ellipse cx="156" cy="568" rx="15" ry="22" transform="rotate(26 156 568)" fill="#7ec25d"/>

      {/* MID-LOW BRANCH CLUSTERS */}
      <ellipse cx="20" cy="429" rx="22" ry="31" transform="rotate(-20 20 429)" fill="#49b337"/>
      <ellipse cx="8" cy="440" rx="16" ry="24" transform="rotate(-30 8 440)" fill="#7ec25d"/>
      <ellipse cx="32" cy="420" rx="15" ry="21" transform="rotate(-10 32 420)" fill="#226217"/>

      <ellipse cx="152" cy="453" rx="20" ry="28" transform="rotate(18 152 453)" fill="#49b337"/>
      <ellipse cx="164" cy="444" rx="14" ry="20" transform="rotate(28 164 444)" fill="#7ec25d"/>
      <ellipse cx="142" cy="462" rx="13" ry="18" transform="rotate(8 142 462)" fill="#9ee051"/>

      {/* MID BRANCH CLUSTERS */}
      <ellipse cx="22" cy="321" rx="24" ry="34" transform="rotate(-18 22 321)" fill="#226217"/>
      <ellipse cx="10" cy="332" rx="18" ry="26" transform="rotate(-28 10 332)" fill="#7ec25d"/>
      <ellipse cx="34" cy="313" rx="16" ry="23" transform="rotate(-8 34 313)" fill="#9ee051" opacity="0.9"/>

      <ellipse cx="157" cy="345" rx="22" ry="30" transform="rotate(16 157 345)" fill="#226217"/>
      <ellipse cx="169" cy="336" rx="16" ry="23" transform="rotate(26 169 336)" fill="#7ec25d"/>
      <ellipse cx="147" cy="354" rx="13" ry="19" transform="rotate(6 147 354)" fill="#9ee051"/>

      {/* UPPER BRANCH CLUSTERS */}
      <ellipse cx="24" cy="208" rx="26" ry="37" transform="rotate(-16 24 208)" fill="#226217"/>
      <ellipse cx="12" cy="220" rx="20" ry="29" transform="rotate(-26 12 220)" fill="#7ec25d"/>
      <ellipse cx="36" cy="200" rx="17" ry="25" transform="rotate(-6 36 200)" fill="#9ee051" opacity="0.9"/>
      <circle cx="10" cy="217" r="5" fill="#9ee051"/>

      <ellipse cx="155" cy="230" rx="23" ry="32" transform="rotate(15 155 230)" fill="#226217"/>
      <ellipse cx="167" cy="221" rx="17" ry="24" transform="rotate(25 167 221)" fill="#7ec25d"/>
      <circle cx="168" cy="220" r="4" fill="#9ee051"/>

      {/* TOP CANOPY - layered depth */}
      <ellipse cx="82" cy="155" rx="34" ry="52" fill="#1a5010"/>
      <ellipse cx="100" cy="148" rx="30" ry="48" fill="#226217"/>
      <ellipse cx="90" cy="130" rx="42" ry="60" fill="#2d6b1e"/>
      <ellipse cx="74" cy="120" rx="32" ry="48" fill="#7ec25d"/>
      <ellipse cx="106" cy="124" rx="28" ry="44" fill="#49b337"/>
      <ellipse cx="90" cy="108" rx="38" ry="56" fill="#226217"/>
      <ellipse cx="78" cy="98" rx="26" ry="40" fill="#7ec25d" opacity="0.9"/>
      <ellipse cx="102" cy="102" rx="24" ry="38" fill="#9ee051" opacity="0.85"/>
      <ellipse cx="90" cy="86" rx="30" ry="46" fill="#226217"/>

      {/* Small flower/berry accents */}
      <circle cx="22" cy="208" r="4.5" fill="#9ee051"/>
      <circle cx="156" cy="228" r="4" fill="#9ee051"/>
      <circle cx="90" cy="84" r="6" fill="#fffdf7" opacity="0.7"/>
      <circle cx="74" cy="96" r="4" fill="#fffdf7" opacity="0.6"/>
      <circle cx="106" cy="100" r="3.5" fill="#fffdf7" opacity="0.6"/>
    </svg>
  )
}
