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
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect width={24} height={24} rx={8} fill="url(#prefix__paint0_radial)" />
      <Rect
        x={0.5}
        y={0.5}
        width={23}
        height={23}
        rx={7.5}
        fill="url(#prefix__paint1_radial)"
        stroke="url(#prefix__paint2_linear)"
      />
      <Path
        d="M7.333 12h9.334M12 7.333L16.667 12 12 16.667"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Defs>
        <RadialGradient
          id="prefix__paint0_radial"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0 30 -30 0 20.5 0)"
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
          gradientTransform="matrix(0 30 -30 0 20.5 0)"
        >
          <Stop stopColor="#85D3FF" />
          <Stop offset={1} stopColor="#2596D7" />
        </RadialGradient>
        <LinearGradient
          id="prefix__paint2_linear"
          x1={0}
          y1={0}
          x2={24}
          y2={24}
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
