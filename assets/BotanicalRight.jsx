export default function BotanicalRight({ style, className }) {
  return (
    <svg viewBox="0 0 389 743" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block', ...style }} className={className}>

      {/* Ground shadows */}
      <ellipse cx="90" cy="740" rx="40" ry="5" fill="#226217" opacity="0.12"/>
      <ellipse cx="200" cy="740" rx="45" ry="5" fill="#226217" opacity="0.12"/>
      <ellipse cx="308" cy="740" rx="38" ry="5" fill="#226217" opacity="0.12"/>

      {/* Ground grass */}
      {[40,55,70,85,100,125,148,165,182,198,215,232,252,270,288,305,322,340,358,375].map((x,i)=>(
        <path key={i}
          d={`M${x} 742 Q${x+(i%3-1)*4} ${718+i%4*5} ${x+(i%3-1)*2} ${704+i%5*6}`}
          stroke={['#9ee051','#7ec25d','#226217','#49b337'][i%4]}
          strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      ))}

      {/* ===================== LEFT PLANT (fern-like) ===================== */}
      <path d="M95 742 C94 700 91 648 90 595 C89 545 90 500 91 455 C92 415 93 375 92 330 C92 295 93 265 92 235"
        stroke="#2d6b1e" strokeWidth="7" strokeLinecap="round" fill="none"/>

      {/* Fern fronds - left side */}
      <path d="M91 570 C76 552 56 543 34 540" stroke="#226217" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M91 520 C74 501 53 492 29 489" stroke="#49b337" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M91 468 C73 448 52 440 28 437" stroke="#226217" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M91 416 C74 397 55 389 33 387" stroke="#49b337" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M91 364 C75 346 57 339 36 337" stroke="#226217" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M92 308 C76 291 58 284 38 282" stroke="#49b337" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

      {/* Fern fronds - right side */}
      <path d="M91 575 C107 557 126 548 146 546" stroke="#226217" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M91 525 C108 506 128 497 148 495" stroke="#49b337" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M91 474 C109 454 130 446 151 444" stroke="#226217" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M91 422 C110 403 131 395 152 393" stroke="#49b337" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M92 370 C110 352 131 344 151 342" stroke="#226217" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M92 314 C110 296 130 289 150 287" stroke="#49b337" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

      {/* Left-side frond tips */}
      {[[27,537,17,22,-18],[22,486,15,20,-24],[22,433,14,18,-16],[27,383,12,17,-20],[29,333,12,16,-24],[31,279,11,15,-20]].map(([cx,cy,rx,ry,r],i)=>(
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${r} ${cx} ${cy})`}
          fill={['#7ec25d','#9ee051','#226217','#7ec25d','#9ee051','#49b337'][i]}/>
      ))}
      {/* Right-side frond tips */}
      {[[149,543,16,21,16],[151,492,14,19,22],[154,441,13,18,15],[155,390,12,16,19],[153,339,11,15,22],[152,284,10,14,18]].map(([cx,cy,rx,ry,r],i)=>(
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${r} ${cx} ${cy})`}
          fill={['#7ec25d','#9ee051','#226217','#7ec25d','#9ee051','#49b337'][i]}/>
      ))}

      {/* Left plant top canopy */}
      <ellipse cx="84" cy="212" rx="30" ry="46" fill="#1a5010"/>
      <ellipse cx="100" cy="206" rx="26" ry="42" fill="#226217"/>
      <ellipse cx="92" cy="190" rx="34" ry="52" fill="#2d6b1e"/>
      <ellipse cx="80" cy="182" rx="24" ry="36" fill="#7ec25d"/>
      <ellipse cx="104" cy="186" rx="22" ry="34" fill="#9ee051" opacity="0.85"/>
      <circle cx="82" cy="180" r="5" fill="#fffdf7" opacity="0.7"/>

      {/* ===================== CENTER PLANT (flowering) ===================== */}
      <path d="M200 742 C199 698 197 648 196 598 C195 550 196 505 198 460 C200 420 201 382 200 342 C200 310 201 280 200 255"
        stroke="#2d6b1e" strokeWidth="7.5" strokeLinecap="round" fill="none"/>

      {/* Center branches */}
      <path d="M198 560 C180 542 160 534 140 532" stroke="#226217" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      <path d="M199 590 C220 572 242 564 262 562" stroke="#226217" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      <path d="M199 488 C178 468 155 460 132 458" stroke="#49b337" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M200 516 C224 498 248 490 270 488" stroke="#49b337" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M199 416 C176 396 152 388 128 386" stroke="#226217" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M200 446 C226 428 252 420 275 418" stroke="#226217" strokeWidth="3.5" strokeLinecap="round" fill="none"/>

      {/* Center branch leaf clusters */}
      <ellipse cx="134" cy="529" rx="22" ry="30" transform="rotate(-15 134 529)" fill="#7ec25d"/>
      <ellipse cx="122" cy="520" rx="16" ry="22" transform="rotate(-25 122 520)" fill="#9ee051"/>
      <ellipse cx="265" cy="559" rx="20" ry="28" transform="rotate(16 265 559)" fill="#7ec25d"/>
      <ellipse cx="275" cy="550" rx="14" ry="20" transform="rotate(26 275 550)" fill="#226217"/>

      <ellipse cx="127" cy="454" rx="20" ry="28" transform="rotate(-18 127 454)" fill="#226217"/>
      <ellipse cx="114" cy="445" rx="14" ry="20" transform="rotate(-28 114 445)" fill="#7ec25d"/>
      <ellipse cx="273" cy="485" rx="18" ry="26" transform="rotate(18 273 485)" fill="#49b337"/>

      <ellipse cx="123" cy="383" rx="18" ry="25" transform="rotate(-16 123 383)" fill="#226217"/>
      <ellipse cx="278" cy="415" rx="17" ry="24" transform="rotate(18 278 415)" fill="#7ec25d"/>

      {/* Center flowering top */}
      <ellipse cx="188" cy="230" rx="36" ry="54" fill="#1a5010"/>
      <ellipse cx="212" cy="224" rx="32" ry="50" fill="#226217"/>
      <ellipse cx="200" cy="208" rx="40" ry="58" fill="#2d6b1e"/>
      <ellipse cx="186" cy="198" rx="28" ry="42" fill="#7ec25d"/>
      <ellipse cx="214" cy="202" rx="26" ry="40" fill="#49b337"/>
      <ellipse cx="200" cy="188" rx="34" ry="52" fill="#226217"/>
      {/* Flower */}
      <circle cx="200" cy="186" r="14" fill="#9ee051"/>
      <circle cx="200" cy="186" r="8" fill="#7ec25d"/>
      <circle cx="200" cy="186" r="4" fill="#fffdf7" opacity="0.8"/>

      {/* ===================== RIGHT PLANT (bushy) ===================== */}
      <path d="M308 742 C307 698 305 648 304 598 C303 555 304 515 306 476 C308 444 309 412 308 380 C308 354 308 330 308 308"
        stroke="#2d6b1e" strokeWidth="6.5" strokeLinecap="round" fill="none"/>

      {/* Right branches */}
      <path d="M307 568 C290 550 268 542 246 540" stroke="#226217" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M308 596 C328 578 350 570 370 568" stroke="#226217" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M307 498 C287 478 264 470 242 468" stroke="#49b337" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M308 526 C332 508 356 500 378 498" stroke="#49b337" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M307 428 C285 408 262 400 238 398" stroke="#226217" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M308 456 C334 438 358 430 380 428" stroke="#226217" strokeWidth="3.5" strokeLinecap="round" fill="none"/>

      {/* Right branch leaf clusters */}
      <ellipse cx="242" cy="537" rx="21" ry="29" transform="rotate(-14 242 537)" fill="#7ec25d"/>
      <ellipse cx="230" cy="528" rx="15" ry="21" transform="rotate(-24 230 528)" fill="#9ee051"/>
      <ellipse cx="373" cy="565" rx="20" ry="27" transform="rotate(15 373 565)" fill="#7ec25d"/>
      <ellipse cx="383" cy="556" rx="14" ry="19" transform="rotate(25 383 556)" fill="#226217"/>

      <ellipse cx="237" cy="465" rx="19" ry="27" transform="rotate(-16 237 465)" fill="#226217"/>
      <ellipse cx="224" cy="456" rx="14" ry="19" transform="rotate(-26 224 456)" fill="#7ec25d"/>
      <ellipse cx="382" cy="495" rx="18" ry="25" transform="rotate(17 382 495)" fill="#49b337"/>

      <ellipse cx="233" cy="395" rx="17" ry="24" transform="rotate(-15 233 395)" fill="#9ee051"/>
      <ellipse cx="383" cy="425" rx="16" ry="22" transform="rotate(17 383 425)" fill="#7ec25d"/>

      {/* Right plant top canopy */}
      <ellipse cx="297" cy="285" rx="32" ry="48" fill="#1a5010"/>
      <ellipse cx="318" cy="278" rx="28" ry="44" fill="#226217"/>
      <ellipse cx="308" cy="264" rx="36" ry="54" fill="#2d6b1e"/>
      <ellipse cx="295" cy="254" rx="26" ry="38" fill="#7ec25d"/>
      <ellipse cx="320" cy="258" rx="23" ry="36" fill="#9ee051" opacity="0.85"/>
      <circle cx="296" cy="252" r="5" fill="#fffdf7" opacity="0.65"/>
    </svg>
  )
}
