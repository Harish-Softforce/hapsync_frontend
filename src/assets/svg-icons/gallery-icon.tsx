import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={22}
      height={21}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M19.706 2.444v-.15H2.294V18.706H19.706V2.444zM3.973 15.961l3.364-4.328 2.496 3.021.12.145.114-.148 3.547-4.575 4.42 5.885H3.973zM2.444.15h17.112a2.302 2.302 0 012.294 2.294v16.112a2.302 2.302 0 01-2.294 2.294H2.444A2.302 2.302 0 01.15 18.556V2.444A2.302 2.302 0 012.444.15z"
        fill={props.fill}
        stroke="#FFFBFB"
        strokeWidth={0.3}
      />
    </Svg>
  )
}

export default SvgComponent
