import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={13}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M1.916 6.076l.002.008a3.94 3.94 0 002.224 2.774L6.5 9.929V8.667h1.333a3.333 3.333 0 003.334-3.334v-.666a3.333 3.333 0 00-3.334-3.334H5.167a3.333 3.333 0 00-3.334 3.334v.666c0 .254.028.5.081.734l.002.009zM7.833 12L3.59 10.071A5.273 5.273 0 01.613 6.36 4.683 4.683 0 01.5 5.333v-.666A4.667 4.667 0 015.167 0h2.666A4.667 4.667 0 0112.5 4.667v.666A4.667 4.667 0 017.833 10v2z"
        fill="#00ADEF"
      />
    </Svg>
  )
}

export default SvgComponent
