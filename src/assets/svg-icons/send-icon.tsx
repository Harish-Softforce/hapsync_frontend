import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={20}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M19.456 7.728L1.402.325l-.693.692 2.963 6.71-2.97 6.704.693.693 18.06-7.396z"
        fill={props?.fill ? props.fill : "#355D9B"}
      />
    </Svg>
  )
}

export default SvgComponent
