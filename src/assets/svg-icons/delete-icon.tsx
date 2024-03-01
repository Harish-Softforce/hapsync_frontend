import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={14}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M1 3.8h1.333m0 0H13m-10.667 0v9.8c0 .371.14.727.39.99.25.262.59.41.944.41h6.666c.354 0 .693-.148.943-.41.25-.263.39-.619.39-.99V3.8H2.334zm2 0V2.4c0-.371.14-.727.39-.99.25-.262.59-.41.944-.41h2.666c.354 0 .693.147.943.41s.39.619.39.99v1.4m-4 3.5v4.2m2.667-4.2v4.2"
        stroke={props.stroke ? props.stroke : "#E14F50"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default SvgComponent
