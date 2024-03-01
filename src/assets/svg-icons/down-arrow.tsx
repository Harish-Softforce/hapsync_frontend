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

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={27}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        width={26.029}
        height={24}
        rx={8}
        fill="url(#prefix__paint0_radial)"
      />
      <Rect
        x={0.5}
        y={0.5}
        width={25.029}
        height={23}
        rx={7.5}
        fill="url(#prefix__paint1_radial)"
        stroke="url(#prefix__paint2_linear)"
      />
      <Path d="M13 16l5-5H8l5 5z" fill="#fff" />
      <Defs>
        <RadialGradient
          id="prefix__paint0_radial"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0 30 -32.5364 0 22.233 0)"
        >
          <Stop stopColor="#85D3FF" />
          <Stop offset={1} stopColor="#2596D7" />
        </RadialGradient>
        <RadialGradient
          id="prefix__paint1_radial"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0 30 -32.5364 0 22.233 0)"
        >
          <Stop stopColor="#85D3FF" />
          <Stop offset={1} stopColor="#2596D7" />
        </RadialGradient>
        <LinearGradient
          id="prefix__paint2_linear"
          x1={0}
          y1={0}
          x2={23.921}
          y2={25.944}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#fff" />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export default SvgComponent
