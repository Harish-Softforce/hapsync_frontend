import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
  <Svg
    width={18}
    height={18}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M8.1 14.4h1.8v-1.8H8.1v1.8ZM9 0C4.032 0 0 4.032 0 9s4.032 9 9 9 9-4.032 9-9-4.032-9-9-9Zm0 16.2c-3.969 0-7.2-3.231-7.2-7.2 0-3.969 3.231-7.2 7.2-7.2 3.969 0 7.2 3.231 7.2 7.2 0 3.969-3.231 7.2-7.2 7.2ZM9 3.6a3.599 3.599 0 0 0-3.6 3.6h1.8c0-.99.81-1.8 1.8-1.8s1.8.81 1.8 1.8c0 1.8-2.7 1.575-2.7 4.5h1.8c0-2.025 2.7-2.25 2.7-4.5 0-1.989-1.611-3.6-3.6-3.6Z"
      fill="#00ADEF"
    />
  </Svg>
)

export default SvgComponent
