import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 01-8-8 7.92 7.92 0 011.69-4.9L14.9 16.31A7.92 7.92 0 0110 18zm6.31-3.1L5.1 3.69A7.92 7.92 0 0110 2a8 8 0 018 8 7.92 7.92 0 01-1.69 4.9z"
        fill="#355D9B"
      />
    </Svg>
  )
}

export default SvgComponent
