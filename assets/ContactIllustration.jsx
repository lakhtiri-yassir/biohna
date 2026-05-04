export default function ContactIllustration({ style }) {
  return (
    <svg viewBox="0 0 591 750" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block', ...style }}>
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#f0f8e8"/>
          <stop offset="100%" stopColor="#fffdf7"/>
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="591" height="750" fill="url(#bgGrad)" rx="24"/>

      {/* === LARGE CENTRAL TREE === */}
      <path d="M296 748 C294 700 290 640 288 575 C286 515 288 460 290 405 C292 360 294 315 294 270 C294 230 294 195 296 158"
        stroke="#1a5010" strokeWidth="14" strokeLinecap="round" fill="none"/>
      <path d="M296 748 C298 700 302 640 302 575 C302 515 300 460 298 405 C296 360 296 315 296 270"
        stroke="#49b337" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.3"/>

      {/* Main trunk bark texture */}
      <path d="M294 650 C290 625 287 595 286 565" stroke="#2d6b1e" strokeWidth="4" strokeLinecap="round" opacity="0.4" fill="none"/>
      <path d="M298 580 C302 552 304 520 303 490" stroke="#49b337" strokeWidth="3" strokeLinecap="round" opacity="0.3" fill="none"/>

      {/* BRANCHES */}
      <path d="M291 480 C270 460 240 450 210 447" stroke="#1a5010" strokeWidth="8" strokeLinecap="round" fill="none"/>
      <path d="M293 510 C318 490 348 480 376 478" stroke="#1a5010" strokeWidth="8" strokeLinecap="round" fill="none"/>
      <path d="M291 390 C266 368 234 358 200 354" stroke="#226217" strokeWidth="7" strokeLinecap="round" fill="none"/>
      <path d="M293 416 C322 395 354 386 383 383" stroke="#226217" strokeWidth="7" strokeLinecap="round" fill="none"/>
      <path d="M292 300 C268 278 238 268 204 264" stroke="#226217" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M294 325 C324 304 357 295 388 292" stroke="#226217" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M293 210 C272 190 248 182 220 179" stroke="#49b337" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M295 233 C320 212 346 204 371 201" stroke="#49b337" strokeWidth="5" strokeLinecap="round" fill="none"/>

      {/* Lower left branch cluster */}
      <ellipse cx="200" cy="444" rx="38" ry="52" fill="#1a5010"/>
      <ellipse cx="184" cy="436" rx="30" ry="44" fill="#226217"/>
      <ellipse cx="208" cy="428" rx="26" ry="38" fill="#49b337"/>
      <ellipse cx="194" cy="418" rx="34" ry="48" fill="#226217"/>
      <ellipse cx="178" cy="425" rx="22" ry="34" fill="#7ec25d" opacity="0.9"/>
      <ellipse cx="212" cy="422" rx="20" ry="30" fill="#9ee051" opacity="0.8"/>

      {/* Lower right branch cluster */}
      <ellipse cx="382" cy="475" rx="36" ry="50" fill="#1a5010"/>
      <ellipse cx="396" cy="466" rx="28" ry="42" fill="#226217"/>
      <ellipse cx="376" cy="460" rx="32" ry="46" fill="#49b337"/>
      <ellipse cx="390" cy="450" rx="24" ry="36" fill="#7ec25d" opacity="0.9"/>

      {/* Mid-left cluster */}
      <ellipse cx="194" cy="350" rx="40" ry="56" fill="#226217"/>
      <ellipse cx="178" cy="342" rx="32" ry="48" fill="#49b337"/>
      <ellipse cx="206" cy="336" rx="28" ry="42" fill="#7ec25d"/>
      <ellipse cx="192" cy="326" rx="36" ry="52" fill="#226217"/>
      <ellipse cx="174" cy="332" rx="24" ry="36" fill="#9ee051" opacity="0.85"/>
      <circle cx="174" cy="330" r="8" fill="#9ee051"/>
      <circle cx="174" cy="330" r="4" fill="#fffdf7" opacity="0.6"/>

      {/* Mid-right cluster */}
      <ellipse cx="390" cy="379" rx="38" ry="54" fill="#226217"/>
      <ellipse cx="405" cy="370" rx="30" ry="46" fill="#49b337"/>
      <ellipse cx="396" cy="356" rx="34" ry="50" fill="#7ec25d" opacity="0.9"/>
      <ellipse cx="408" cy="362" rx="22" ry="34" fill="#9ee051" opacity="0.8"/>

      {/* Upper-left cluster */}
      <ellipse cx="208" cy="260" rx="36" ry="52" fill="#226217"/>
      <ellipse cx="192" cy="252" rx="28" ry="44" fill="#7ec25d"/>
      <ellipse cx="206" cy="244" rx="32" ry="48" fill="#49b337"/>
      <ellipse cx="190" cy="236" rx="24" ry="36" fill="#9ee051" opacity="0.85"/>
      <circle cx="194" cy="234" r="7" fill="#fffdf7" opacity="0.6"/>

      {/* Upper-right cluster */}
      <ellipse cx="380" cy="288" rx="35" ry="50" fill="#226217"/>
      <ellipse cx="395" cy="280" rx="27" ry="42" fill="#7ec25d"/>
      <ellipse cx="386" cy="268" rx="30" ry="46" fill="#49b337"/>
      <ellipse cx="398" cy="274" rx="21" ry="32" fill="#9ee051" opacity="0.8"/>

      {/* Top-left cluster */}
      <ellipse cx="218" cy="175" rx="32" ry="46" fill="#226217"/>
      <ellipse cx="204" cy="167" rx="24" ry="38" fill="#7ec25d"/>
      <ellipse cx="214" cy="157" rx="28" ry="42" fill="#49b337"/>
      <ellipse cx="200" cy="150" rx="20" ry="30" fill="#9ee051" opacity="0.85"/>

      {/* Top-right cluster */}
      <ellipse cx="374" cy="198" rx="30" ry="44" fill="#226217"/>
      <ellipse cx="388" cy="190" rx="24" ry="36" fill="#7ec25d"/>
      <ellipse cx="380" cy="180" rx="26" ry="40" fill="#49b337"/>

      {/* MAIN CANOPY - top */}
      <ellipse cx="272" cy="130" rx="52" ry="76" fill="#1a5010"/>
      <ellipse cx="318" cy="122" rx="46" ry="70" fill="#226217"/>
      <ellipse cx="296" cy="106" rx="60" ry="85" fill="#2d6b1e"/>
      <ellipse cx="278" cy="94" rx="44" ry="64" fill="#49b337"/>
      <ellipse cx="314" cy="98" rx="40" ry="60" fill="#7ec25d" opacity="0.9"/>
      <ellipse cx="296" cy="78" rx="52" ry="76" fill="#226217"/>
      <ellipse cx="280" cy="66" rx="38" ry="56" fill="#7ec25d"/>
      <ellipse cx="312" cy="70" rx="34" ry="52" fill="#9ee051" opacity="0.85"/>
      <ellipse cx="296" cy="52" rx="44" ry="65" fill="#226217"/>

      {/* Canopy highlight flowers */}
      <circle cx="280" cy="64" r="9" fill="#9ee051"/>
      <circle cx="280" cy="64" r="5" fill="#7ec25d"/>
      <circle cx="280" cy="64" r="2.5" fill="#fffdf7" opacity="0.8"/>
      <circle cx="312" cy="68" r="7" fill="#9ee051"/>
      <circle cx="312" cy="68" r="3.5" fill="#fffdf7" opacity="0.7"/>

      {/* === SMALL PLANTS (foreground) === */}

      {/* Bottom-left small plant */}
      <path d="M80 748 C78 720 74 695 70 672 C68 655 70 640 74 628" stroke="#226217" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M80 748 C82 720 86 695 90 672" stroke="#49b337" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M72 700 C58 686 44 679 28 677" stroke="#226217" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M75 670 C90 656 105 648 122 646" stroke="#226217" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <ellipse cx="24" cy="675" rx="22" ry="30" fill="#7ec25d"/>
      <ellipse cx="12" cy="665" rx="16" ry="22" fill="#9ee051"/>
      <ellipse cx="118" cy="643" rx="20" ry="27" fill="#7ec25d"/>

      {/* Top left - small plant  */}
      <ellipse cx="60" cy="624" rx="28" ry="40" fill="#226217"/>
      <ellipse cx="46" cy="616" rx="22" ry="32" fill="#49b337"/>
      <ellipse cx="58" cy="606" rx="25" ry="36" fill="#7ec25d"/>
      <ellipse cx="44" cy="598" rx="18" ry="26" fill="#9ee051" opacity="0.9"/>

      {/* Bottom-right small plant */}
      <path d="M510 748 C512 720 516 694 518 668" stroke="#226217" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M518 710 C534 694 550 687 568 684" stroke="#226217" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M516 676 C498 660 480 654 462 652" stroke="#49b337" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <ellipse cx="572" cy="681" rx="20" ry="27" fill="#7ec25d"/>
      <ellipse cx="582" cy="672" rx="14" ry="20" fill="#9ee051"/>
      <ellipse cx="458" cy="650" rx="19" ry="26" fill="#226217"/>

      {/* Top right small cluster */}
      <ellipse cx="526" cy="648" rx="26" ry="38" fill="#226217"/>
      <ellipse cx="540" cy="640" rx="20" ry="30" fill="#7ec25d"/>
      <ellipse cx="532" cy="630" rx="23" ry="34" fill="#49b337"/>
      <circle cx="540" cy="628" r="7" fill="#9ee051"/>
      <circle cx="540" cy="628" r="3.5" fill="#fffdf7" opacity="0.7"/>

      {/* Ground grass across bottom */}
      {[20,40,60,80,105,128,152,178,202,228,255,280,305,332,358,384,410,435,460,486,510,535,558,576].map((x,i)=>(
        <path key={i} d={`M${x} 748 Q${x+(i%3-1)*5} ${724+i%4*5} ${x+(i%3-1)*3} ${710+i%5*5}`}
          stroke={['#9ee051','#7ec25d','#226217','#49b337'][i%4]}
          strokeWidth="2" strokeLinecap="round" fill="none"/>
      ))}

      {/* Scattered small flowers */}
      {[[104,590],[148,635],[440,615],[484,660],[200,710],[382,720]].map(([cx,cy],i)=>(
        <g key={i}>
          <circle cx={cx} cy={cy} r="6" fill="#9ee051"/>
          <circle cx={cx} cy={cy} r="3" fill="#fffdf7" opacity="0.8"/>
        </g>
      ))}
    </svg>
  )
}
