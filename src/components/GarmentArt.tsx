/**
 * Original, hand-built fashion illustrations of ladies' wear.
 * Each garment is drawn with SVG shapes and tinted with the product colours,
 * so every product has a good-looking image even before real photos are added.
 */

type Props = {
  category: string;
  /** [main colour, darker shade] */
  colors: [string, string];
  className?: string;
};

const SKIN = "#EDBFA3";
const SKIN_SHADE = "#DDA98B";
const HAIR = "#2B1A1E";
const ZARI = "#F7DC9A";

function Figure({ hair = "long" }: { hair?: "long" | "bun" }) {
  return (
    <g>
      {/* hair back */}
      {hair === "long" ? (
        <path d="M126 50c-6-26 12-40 24-40s30 14 24 40c-2 24 6 52 8 70-14-6-22-6-32-6s-18 0-32 6c2-18 10-46 8-70Z" fill={HAIR} />
      ) : (
        <>
          <circle cx="150" cy="16" r="13" fill={HAIR} />
          <path d="M127 50c-3-22 9-34 23-34s26 12 23 34c-2 6-6 10-23 10s-21-4-23-10Z" fill={HAIR} />
        </>
      )}
      {/* neck */}
      <path d="M143 66h14v24h-14Z" fill={SKIN_SHADE} />
      {/* face */}
      <ellipse cx="150" cy="50" rx="19" ry="23" fill={SKIN} />
      {/* parting + soft fringe */}
      <path d="M131 46c8-14 26-16 38-2-10-4-22-4-38 2Z" fill={HAIR} />
      {/* subtle lips + brows for a finished look */}
      <path d="M144 62q6 4 12 0" stroke="#C45A6E" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M139 46q4-3 8 0M153 46q4-3 8 0" stroke="#4A2B2F" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </g>
  );
}

function Shoes({ y = 372, color = "#2B1A1E" }: { y?: number; color?: string }) {
  return (
    <g fill={color}>
      <path d={`M122 ${y}h24l-3 10h-21Z`} />
      <path d={`M154 ${y}h24l3 10h-21Z`} />
    </g>
  );
}

function Saree({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <g>
      <Figure hair="bun" />
      {/* arms */}
      <path d="M118 96c-12 30-14 70-8 104h10c-4-34-2-70 8-98Z" fill={SKIN} />
      <path d="M182 96c12 30 14 70 8 104h-10c4-34 2-70-8-98Z" fill={SKIN} />
      {/* midriff */}
      <rect x="126" y="150" width="48" height="40" fill={SKIN} />
      {/* blouse */}
      <path d="M118 92h64l-6 60h-52Z" fill={c2} />
      <path d="M138 92q12 18 24 0" fill={SKIN} />
      <path d="M118 92c-6 10-10 22-12 34l16 4Zm64 0c6 10 10 22 12 34l-16 4Z" fill={c2} />
      {/* saree skirt */}
      <path d="M118 184c-4 70-14 130-22 188h108c-8-58-18-118-22-188Z" fill={c1} />
      {/* pleats */}
      <g stroke="#ffffff" strokeOpacity=".28" strokeWidth="1.5">
        <path d="M134 200l-10 172M146 200l-4 172M158 200l4 172M170 200l10 172" />
      </g>
      {/* hem border */}
      <path d="M96 352h108l2 20H94Z" fill={c2} />
      <path d="M96 358h108M95 366h110" stroke={ZARI} strokeWidth="1.6" />
      {/* pallu across body */}
      <path d="M118 94c20 14 46 52 76 100l-24 8c-26-44-46-72-70-84Z" fill={c1} />
      <path d="M118 94c20 14 46 52 76 100" stroke={ZARI} strokeWidth="2.4" fill="none" />
      <path d="M188 190c8 40 12 90 14 150l-16 2c0-52-2-100-6-146Z" fill={c1} />
      <path d="M188 190c8 40 12 90 14 150" stroke={ZARI} strokeWidth="2" fill="none" />
      <Shoes />
    </g>
  );
}

function Kurti({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <g>
      <Figure />
      {/* trousers */}
      <path d="M120 250h30l-2 122h-22Z" fill={c2} />
      <path d="M150 250h30l-6 122h-22Z" fill={c2} />
      <path d="M150 250l0 122" stroke="#fff" strokeOpacity=".15" />
      {/* forearms from 3/4 sleeves */}
      <path d="M100 156l-6 40h11l8-34Z" fill={SKIN} />
      <path d="M200 156l6 40h-11l-8-34Z" fill={SKIN} />
      {/* 3/4 sleeves */}
      <path d="M118 92c-12 6-22 36-24 70l16 4c2-26 10-44 16-52Z" fill={c1} />
      <path d="M182 92c12 6 22 36 24 70l-16 4c-2-26-10-44-16-52Z" fill={c1} />
      {/* tunic body */}
      <path d="M118 92h64l12 156H106Z" fill={c1} />
      {/* neckline */}
      <path d="M136 92h28l-14 28Z" fill={SKIN} />
      <path d="M136 92l14 28 14-28" stroke={ZARI} strokeWidth="2" fill="none" />
      {/* placket embroidery */}
      <path d="M150 120v70" stroke={c2} strokeWidth="2" />
      {[130, 142, 154, 166, 178].map((y) => (
        <circle key={y} cx="150" cy={y} r="2.4" fill={ZARI} />
      ))}
      {/* hem band */}
      <path d="M107 232h86l1 16h-88Z" fill={c2} opacity=".8" />
      <path d="M107 240h86" stroke={ZARI} strokeWidth="1.6" strokeDasharray="3 4" />
      {/* side slits shadow */}
      <path d="M106 248l6-30M194 248l-6-30" stroke="#fff" strokeOpacity=".25" />
      <Shoes />
    </g>
  );
}

function Anarkali({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <g>
      <Figure />
      {/* arms */}
      <path d="M118 96c-10 26-14 60-10 92h10c-2-30 0-60 8-86Z" fill={SKIN} />
      <path d="M182 96c10 26 14 60 10 92h-10c2-30 0-60-8-86Z" fill={SKIN} />
      {/* flared skirt */}
      <path d="M124 150c-24 90-52 150-64 222h180c-12-72-40-132-64-222Z" fill={c1} />
      <g stroke="#fff" strokeOpacity=".22" strokeWidth="1.5">
        <path d="M138 170l-34 202M150 170v202M162 170l34 202M128 200l-62 172M172 200l62 172" />
      </g>
      {/* hem border */}
      <path d="M62 348h176l4 24H58Z" fill={c2} />
      <path d="M60 356h180M58 364h184" stroke={ZARI} strokeWidth="1.6" />
      {/* bodice + yoke */}
      <path d="M120 92h60l-4 66h-52Z" fill={c1} />
      <path d="M136 92q14 20 28 0" fill={SKIN} />
      <path d="M126 158h48" stroke={ZARI} strokeWidth="3" />
      {[134, 142, 150, 158, 166].map((x) => (
        <circle key={x} cx={x} cy="132" r="2" fill={ZARI} />
      ))}
      {/* short sleeves */}
      <path d="M120 92c-10 4-16 18-16 34l14 4Zm60 0c10 4 16 18 16 34l-14 4Z" fill={c1} />
      {/* dupatta */}
      <path d="M116 94c-26 70-30 150-18 262l18-2c-8-110-4-190 22-252Z" fill={c2} opacity=".92" />
      <path d="M116 94c-26 70-30 150-18 262" stroke={ZARI} strokeWidth="2" fill="none" />
      <Shoes y={372} />
    </g>
  );
}

function Lehenga({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <g>
      <Figure hair="bun" />
      {/* arms */}
      <path d="M118 96c-12 24-16 56-12 88h10c-2-28 0-56 10-80Z" fill={SKIN} />
      <path d="M182 96c12 24 16 56 12 88h-10c2-28 0-56-10-80Z" fill={SKIN} />
      {/* midriff */}
      <rect x="128" y="138" width="44" height="46" fill={SKIN} />
      {/* crop blouse */}
      <path d="M120 92h60l-6 48h-48Z" fill={c2} />
      <path d="M136 92q14 22 28 0" fill={SKIN} />
      <path d="M126 134h48" stroke={ZARI} strokeWidth="2.4" />
      {/* voluminous skirt */}
      <path d="M126 182c-48 44-84 120-92 190h232c-8-70-44-146-92-190Z" fill={c1} />
      {/* embroidered bands */}
      <path d="M62 300q88 26 176 0v18q-88 26-176 0Z" fill={c2} opacity=".85" />
      <path d="M52 340q98 28 196 0v32H44Z" fill={c2} opacity=".9" />
      <path d="M62 309q88 26 176 0M50 349q100 28 200 0" stroke={ZARI} strokeWidth="1.8" fill="none" />
      {[84, 112, 140, 168, 196, 224].map((x, i) => (
        <circle key={x} cx={x} cy={i % 2 ? 252 : 262} r="3.2" fill={ZARI} opacity=".85" />
      ))}
      {[104, 150, 196].map((x) => (
        <path key={x} d={`M${x} 214l3 6-3 6-3-6Z`} fill={ZARI} opacity=".85" />
      ))}
      {/* sheer dupatta over shoulder */}
      <path d="M120 92c-24 40-34 120-26 208l20-4c-6-90 0-150 20-196Z" fill={c2} opacity=".5" />
      <path d="M120 92c-24 40-34 120-26 208" stroke={ZARI} strokeWidth="2" fill="none" />
    </g>
  );
}

function Dress({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <g>
      <Figure />
      {/* legs */}
      <path d="M128 318h18l-2 54h-12Z" fill={SKIN} />
      <path d="M154 318h18l-4 54h-12Z" fill={SKIN} />
      {/* arms */}
      <path d="M122 96c-8 26-12 60-8 92h9c-2-30 0-58 8-82Z" fill={SKIN} />
      <path d="M178 96c8 26 12 60 8 92h-9c2-30 0-58-8-82Z" fill={SKIN} />
      {/* A-line skirt */}
      <path d="M128 176c-30 40-48 90-46 142h136c2-52-16-102-46-142Z" fill={c1} />
      <g stroke="#fff" strokeOpacity=".22" strokeWidth="1.5">
        <path d="M140 190l-24 128M152 190l-2 128M164 190l22 128" />
      </g>
      {/* bodice */}
      <path d="M128 92h44l4 84h-52Z" fill={c1} />
      <path d="M136 92q14 20 28 0" fill={SKIN} />
      {/* straps + waist belt */}
      <path d="M134 92l2-6M166 92l-2-6" stroke={c2} strokeWidth="3" />
      <path d="M124 170h52v10h-52Z" fill={c2} />
      <circle cx="150" cy="175" r="3" fill={ZARI} />
      {/* hem trim */}
      <path d="M82 306h136l0 12H82Z" fill={c2} opacity=".7" />
      <Shoes y={372} color={c2} />
    </g>
  );
}

export default function GarmentArt({ category, colors, className = "" }: Props) {
  const [c1, c2] = colors;
  let art: React.ReactNode;
  switch (category) {
    case "Kurtis":
      art = <Kurti c1={c1} c2={c2} />;
      break;
    case "Suits":
    case "Co-ord Sets":
    case "Formal Sets":
    case "Suit Sets":
      art = <Anarkali c1={c1} c2={c2} />;
      break;
    case "Lehengas":
      art = <Lehenga c1={c1} c2={c2} />;
      break;
    case "Dresses":
      art = <Dress c1={c1} c2={c2} />;
      break;
    default:
      art = <Saree c1={c1} c2={c2} />;
  }

  return (
    <svg
      viewBox="0 0 300 400"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      role="img"
      aria-label={`${category} illustration`}
    >
      <rect width="300" height="400" fill="#FFF1F6" />
      <circle cx="150" cy="210" r="150" fill="#FFFFFF" opacity=".55" />
      <circle cx="40" cy="60" r="30" fill="#FFD6E6" opacity=".7" />
      <circle cx="262" cy="330" r="42" fill="#FFD6E6" opacity=".6" />
      {/* floor shadow */}
      <ellipse cx="150" cy="384" rx="86" ry="7" fill="#D81B60" opacity=".12" />
      {art}
    </svg>
  );
}
