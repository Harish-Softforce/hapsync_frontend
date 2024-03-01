import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={24}
      height={18}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M7.353 9.19c-.198 0-.356-.13-.356-.288 0-.16.158-.286.356-.286h4.31v-3.46c0-.158.163-.289.361-.289.198 0 .356.13.356.29v3.46h4.31c.198 0 .36.126.36.285 0 .158-.162.289-.36.289h-4.31v3.46c0 .158-.158.289-.356.289-.198 0-.36-.13-.36-.29V9.19H7.353z"
        fill={props.fill}
        stroke={props.fill}
        strokeWidth={1.1}
      />
      <Path
        d="M20.318 15.713h.15V2.094H3.58V15.714h16.738zM3.73.174h16.588c1.47 0 2.615.96 2.615 2.07v13.32c0 1.108-1.145 2.07-2.615 2.07H3.73c-1.47 0-2.615-.962-2.615-2.07V2.243c0-1.11 1.145-2.07 2.615-2.07z"
        fill={props.fill}
        stroke="#fff"
        strokeWidth={0.3}
      />
    </Svg>
  )
}

export default SvgComponent
