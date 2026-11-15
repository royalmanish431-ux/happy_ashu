import type { CakeFlavor } from '../types/wish';

interface CakeIllustrationProps {
  flavor: CakeFlavor;
  candleLit?: boolean;
  blownOut?: boolean;
  sliced?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PALETTES: Record<
  CakeFlavor,
  {
    spongeTop: string;
    spongeBottom: string;
    filling: string;
    icing: string;
    plate: string;
    candle: string;
    candleStripe: string;
    accent: string;
  }
> = {
  chocolate: {
    spongeTop: '#56342D',
    spongeBottom: '#3D221D',
    filling: '#70453B',
    icing: '#F6E7D7',
    plate: '#EFE2D3',
    candle: '#FFF3E4',
    candleStripe: '#E07A5F',
    accent: '#F6C177',
  },
  strawberry: {
    spongeTop: '#F9B4C4',
    spongeBottom: '#EB8FA5',
    filling: '#FFDCE5',
    icing: '#FFF6F8',
    plate: '#F5E5EA',
    candle: '#FFFFFF',
    candleStripe: '#D94F70',
    accent: '#D94F70',
  },
  vanilla: {
    spongeTop: '#F7E1A0',
    spongeBottom: '#E8CA78',
    filling: '#FFF7DF',
    icing: '#FFFDF7',
    plate: '#F0EAD8',
    candle: '#FFF9EC',
    candleStripe: '#D99B26',
    accent: '#D94F70',
  },
};

export function CakeIllustration({
  flavor,
  candleLit = true,
  blownOut = false,
  sliced = false,
  size = 'lg',
}: CakeIllustrationProps) {
  const c = PALETTES[flavor];
  const dims =
    size === 'sm' ? 'w-14 h-14' : size === 'md' ? 'w-32 h-32' : 'w-56 h-56 sm:w-64 sm:h-64';

  return (
    <svg
      viewBox="0 0 220 210"
      className={`${dims} select-none overflow-visible`}
      role="img"
      aria-label={`${flavor} birthday cake`}
    >
      <defs>
        <radialGradient id={`flame-glow-${flavor}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD166" stopOpacity="0.65" />
          <stop offset="60%" stopColor="#F4A261" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#F4A261" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Plate */}
      <rect x="24" y="176" width="172" height="8" rx="4" fill={c.plate} />
      <ellipse cx="110" cy="184" rx="70" ry="5" fill="rgba(0,0,0,0.16)" />

      {/* Cake base layers */}
      <g transform={sliced ? 'translate(-6, 0)' : undefined}>
        <rect x="44" y="106" width="132" height="70" rx="8" fill={c.spongeBottom} />
        <rect x="44" y="106" width="132" height="46" rx="8" fill={c.spongeTop} />

        {/* Cream filling stripes */}
        <rect x="44" y="128" width="132" height="6" fill={c.filling} />
        <rect x="44" y="152" width="132" height="6" fill={c.filling} />

        {/* Icing drips */}
        <path
          d="M44 106 C44 100 50 98 56 98 L164 98 C170 98 176 100 176 106 L176 119 C171 124 166 124 163 116 C160 110 155 112 153 125 C151 136 144 136 142 122 C139 112 134 112 131 128 C128 142 121 140 119 124 C117 112 110 112 107 120 C104 129 97 128 95 118 C92 109 86 110 83 124 C80 138 72 138 70 122 C68 111 61 112 58 122 C55 130 48 128 44 119 Z"
          fill={c.icing}
        />

        {/* Flavor accents */}
        {flavor === 'strawberry' && (
          <g>
            <circle cx="72" cy="95" r="7" fill={c.accent} />
            <circle cx="148" cy="95" r="7" fill={c.accent} />
            <path d="M70 88 L74 84" stroke="#4D8B55" strokeWidth="2" strokeLinecap="round" />
            <path d="M146 88 L150 84" stroke="#4D8B55" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
        {flavor === 'vanilla' && (
          <g>
            <circle cx="144" cy="93" r="6" fill={c.accent} />
            <path d="M144 87 Q148 79 154 78" stroke="#6B3E26" strokeWidth="2" fill="none" />
            <rect x="64" y="102" width="8" height="3" rx="1.5" fill="#EB6F92" transform="rotate(-18 64 102)" />
            <rect x="86" y="104" width="8" height="3" rx="1.5" fill="#9CCFD8" transform="rotate(24 86 104)" />
            <rect x="128" y="103" width="8" height="3" rx="1.5" fill="#F6C177" transform="rotate(-14 128 103)" />
          </g>
        )}
        {flavor === 'chocolate' && (
          <g>
            <circle cx="68" cy="103" r="2.5" fill={c.accent} />
            <circle cx="152" cy="103" r="2.5" fill={c.accent} />
            <circle cx="92" cy="101" r="2" fill={c.accent} />
          </g>
        )}
      </g>

      {/* Sliced piece offset */}
      {sliced && (
        <g transform="translate(26, 8)">
          <path d="M146 102 L176 116 L176 170 L146 156 Z" fill={c.spongeTop} />
          <path d="M146 124 L176 138 L176 144 L146 130 Z" fill={c.filling} />
          <path d="M146 102 L176 116 L160 120 L134 106 Z" fill={c.icing} />
        </g>
      )}

      {/* Candle */}
      <g>
        <rect x="105" y="54" width="10" height="45" rx="3" fill={c.candle} />
        <path d="M105 66 L115 62 L115 67 L105 71 Z" fill={c.candleStripe} opacity="0.85" />
        <path d="M105 80 L115 76 L115 81 L105 85 Z" fill={c.candleStripe} opacity="0.85" />
        <line x1="110" y1="54" x2="110" y2="46" stroke="#3B2B30" strokeWidth="2" strokeLinecap="round" />

        {candleLit && !blownOut && (
          <g>
            <circle cx="110" cy="36" r="26" fill={`url(#flame-glow-${flavor})`} />
            <path
              d="M110 20 C116 29 118 38 110 46 C102 38 104 29 110 20 Z"
              fill="#FF9F1C"
            />
            <path
              d="M110 26 C113 32 114 39 110 44 C106 39 107 32 110 26 Z"
              fill="#FFF3B0"
            />
          </g>
        )}

        {blownOut && (
          <g opacity="0.55">
            <path
              d="M110 44 Q104 35 112 27 Q118 20 109 12"
              fill="none"
              stroke="#D8C7D3"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}
      </g>
    </svg>
  );
}
