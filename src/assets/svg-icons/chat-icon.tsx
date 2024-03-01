import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={21}
      height={21}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M2 2.1V2H19V14.8H3.37L2.17 16l-.17.17V2.1zm2.13 14.63l.029-.03H18.9c1.1 0 2-.9 2-2V2.1c0-1.1-.9-2-2-2H2.1c-1.1 0-2 .9-2 2v18.659l4.03-4.03zM16.7 12.5v-1.9H4.3v1.9h12.4zm0-3.15v-1.9H4.3v1.9h12.4zm0-3.15V4.3H4.3v1.9h12.4z"
        fill={props.fill}
        stroke="#fff"
        strokeWidth={0.2}
      />
    </Svg>
  )
}

export default SvgComponent
