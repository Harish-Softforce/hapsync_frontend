import * as React from "react"
import Svg, {
  SvgProps,
  Rect,
  Path,
  Defs,
  RadialGradient,
  Stop,
  LinearGradient,
} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
  <Svg
    width={28}
    height={28}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={28} height={28} rx={14} fill="url(#a)" />
    <Rect
      x={0.5}
      y={0.5}
      width={27}
      height={27}
      rx={13.5}
      fill="url(#b)"
      stroke="url(#c)"
    />
    <Path
      d="M11.951 19.313h-.002l-4.242-4.242a1 1 0 0 1 1.414-1.415l2.829 2.826v.003l7.778-7.778a1 1 0 0 1 1.414 1.414L13.364 17.9l-1.413 1.413Z"
      fill="#fff"
      stroke="#fff"
    />
    <Defs>
      <RadialGradient
        id="a"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(0 35 -35 0 23.917 0)"
      >
        <Stop stopColor="#85D3FF" />
        <Stop offset={1} stopColor="#2596D7" />
      </RadialGradient>
      <RadialGradient
        id="b"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(0 35 -35 0 23.917 0)"
      >
        <Stop stopColor="#85D3FF" />
        <Stop offset={1} stopColor="#2596D7" />
      </RadialGradient>
      <LinearGradient
        id="c"
        x1={0}
        y1={0}
        x2={28}
        y2={28}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#fff" />
        <Stop offset={1} stopColor="#fff" stopOpacity={0} />
      </LinearGradient>
    </Defs>
  </Svg>
)

export default SvgComponent
