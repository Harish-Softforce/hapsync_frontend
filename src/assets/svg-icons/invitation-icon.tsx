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
        d="M20.99 7.737c0-.796-.389-1.492-.987-1.88L10.5 0 .998 5.858A2.228 2.228 0 000 7.737v11.052C0 20.006.945 21 2.1 21h16.8c1.155 0 2.1-.995 2.1-2.21l-.01-11.053zm-2.1 0v.01l-8.39 5.516-8.4-5.526 8.4-5.173 8.39 5.173zM2.1 18.789v-8.466l8.4 5.549 8.39-5.516.01 8.434H2.1z"
        fill={props.fill}
      />
    </Svg>
  )
}

export default SvgComponent
