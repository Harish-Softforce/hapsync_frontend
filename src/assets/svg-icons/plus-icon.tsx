import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={25}
      height={25}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M1.813 13.319A.818.818 0 011 12.494c0-.453.36-.813.813-.813h9.862V1.825c0-.452.372-.824.825-.824.453 0 .813.372.813.824v9.857h9.862c.453 0 .825.36.825.813a.828.828 0 01-.825.825h-9.862v9.857c0 .452-.36.824-.813.824a.828.828 0 01-.824-.824v-9.857H1.813z"
        fill="#355D9B"
        stroke="#355D9B"
        strokeWidth={1.5}
      />
    </Svg>
  )
}

export default SvgComponent
