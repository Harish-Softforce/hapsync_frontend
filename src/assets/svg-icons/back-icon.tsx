import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={31}
      height={10}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M3.83 4l2.58-2.59L5 0 0 5l5 5 1.41-1.41L3.83 6H31V4H3.83z"
        fill="#355D9B"
      />
    </Svg>
  )
}

export default SvgComponent
