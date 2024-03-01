import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
  <Svg
    width={21}
    height={19}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M18 0H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h9v-2H2V4l8 5 8-5v5h2V2c0-1.1-.9-2-2-2Zm-8 7L2 2h16l-8 5Zm7 4 4 4-4 4v-3h-4v-2h4v-3Z"
      fill="#00ADEF"
    />
  </Svg>
)

export default SvgComponent
