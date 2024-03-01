import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={19}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M10 18H3a1 1 0 01-1-1V3a1 1 0 011-1h5v3a3 3 0 003 3h3v2a1 1 0 002 0V7v-.06a1.307 1.307 0 00-.06-.27v-.09a1.07 1.07 0 00-.19-.28l-6-6a1.07 1.07 0 00-.28-.19.32.32 0 00-.09 0A.88.88 0 009.05 0H3a3 3 0 00-3 3v14a3 3 0 003 3h7a1 1 0 000-2zm0-14.59L12.59 6H11a1 1 0 01-1-1V3.41zM5 6a1 1 0 000 2h1a1 1 0 000-2H5zm6 4H5a1 1 0 000 2h6a1 1 0 000-2zm6.71 5.29l-2-2a1 1 0 00-.33-.21 1 1 0 00-.76 0 1 1 0 00-.33.21l-2 2a1.004 1.004 0 101.42 1.42l.29-.3V19a1 1 0 002 0v-2.59l.29.3a1.002 1.002 0 001.639-.325 1 1 0 00-.219-1.095zM9 16a1 1 0 000-2H5a1 1 0 000 2h4z"
        fill="#fff"
      />
    </Svg>
  )
}

export default SvgComponent
