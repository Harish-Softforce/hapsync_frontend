import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={16}
      height={30}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M.907 15.978h3.288v13.538c0 .267.217.484.484.484h5.576a.484.484 0 00.484-.484V16.042h3.78a.484.484 0 00.48-.429l.575-4.984a.484.484 0 00-.48-.54h-4.355V6.967c0-.942.507-1.42 1.507-1.42h2.847a.484.484 0 00.484-.484V.487a.484.484 0 00-.484-.483H11.17A3.856 3.856 0 0010.99 0c-.68 0-3.047.134-4.917 1.853C4.003 3.76 4.29 6.041 4.36 6.436v3.654H.907a.484.484 0 00-.484.484v4.92c0 .267.216.484.484.484z"
        fill="#5797DE"
      />
    </Svg>
  )
}

export default SvgComponent
