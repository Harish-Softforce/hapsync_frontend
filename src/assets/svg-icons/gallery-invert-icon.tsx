import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
  <Svg
    width={31}
    height={30}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M30.25 26.667V3.333C30.25 1.5 28.75 0 26.917 0H3.583A3.343 3.343 0 0 0 .25 3.333v23.334C.25 28.5 1.75 30 3.583 30h23.334c1.833 0 3.333-1.5 3.333-3.333ZM9.417 17.5l4.166 5.017L19.417 15l7.5 10H3.583l5.834-7.5Z"
      fill="#fff"
    />
  </Svg>
)

export default SvgComponent
