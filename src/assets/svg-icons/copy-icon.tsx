import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={18}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M13 18H5a3 3 0 01-3-3V5a1 1 0 00-2 0v10a5 5 0 005 5h8a1 1 0 000-2zm5-11.06a1.307 1.307 0 00-.06-.27v-.09a1.07 1.07 0 00-.19-.28l-6-6a1.07 1.07 0 00-.28-.19h-.09L11.06 0H7a3 3 0 00-3 3v10a3 3 0 003 3h8a3 3 0 003-3V7v-.06zm-6-3.53L14.59 6H13a1 1 0 01-1-1V3.41zM16 13a1 1 0 01-1 1H7a1 1 0 01-1-1V3a1 1 0 011-1h3v3a3 3 0 003 3h3v5z"
        fill="#355D9B"
      />
    </Svg>
  )
}

export default SvgComponent
