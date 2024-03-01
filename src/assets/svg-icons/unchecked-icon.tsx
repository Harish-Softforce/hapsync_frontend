import * as React from "react"
import Svg, {
  SvgProps,
  Rect,
  Defs,
  RadialGradient,
  Stop,
} from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
  <Svg
    width={28}
    height={28}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect
      x={1}
      y={1}
      width={26}
      height={26}
      rx={13}
      stroke="url(#a)"
      strokeWidth={2}
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
    </Defs>
  </Svg>
)

export default SvgComponent
