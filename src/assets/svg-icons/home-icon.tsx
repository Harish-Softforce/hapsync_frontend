import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={21}
      height={22}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.378 19.799C8.378 21.02 7.373 22 6.144 22H3.351C1.452 22 0 20.525 0 18.698V9.4c0-.924.447-1.816 1.117-2.432L7.82.87C9.049-.252 10.948-.296 12.288.782l6.59 5.58a3.235 3.235 0 011.23 2.52v9.816c0 1.827-1.452 3.302-3.352 3.302h-2.792c-1.229 0-2.234-.99-2.234-2.201v-5.47H8.378v5.47zm2.458-17.344c-.447-.363-1.118-.341-1.453.033L2.569 8.585c-.223.209-.335.506-.335.814v9.3c0 .605.447 1.1 1.117 1.1h2.793v-6.57c0-.605.447-1.1 1.117-1.1h5.586c.67 0 1.117.495 1.117 1.1v6.57h2.793c.67 0 1.117-.495 1.117-1.1V8.881c0-.32-.112-.627-.448-.836l-6.59-5.59z"
        fill={props.fill}
      />
    </Svg>
  )
}

export default SvgComponent
