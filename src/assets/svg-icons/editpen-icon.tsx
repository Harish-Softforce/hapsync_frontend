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
    width={27}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={26.029} height={24} rx={8} fill="url(#a)" />
    <Rect
      x={0.5}
      y={0.5}
      width={25.029}
      height={23}
      rx={7.5}
      fill="url(#b)"
      stroke="url(#c)"
    />
    <Path
      d="m14.601 9.682.715.716-7.045 7.046h-.716v-.715l7.046-7.047ZM17.401 5a.778.778 0 0 0-.545.226l-1.423 1.423 2.916 2.917 1.424-1.424a.775.775 0 0 0 0-1.096l-1.82-1.82A.764.764 0 0 0 17.4 5Zm-2.8 2.481L6 16.083V19h2.916l8.601-8.602-2.916-2.917Z"
      fill="#fff"
    />
    <Defs>
      <RadialGradient
        id="a"
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
        id="b"
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
        id="c"
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

export default SvgComponent
