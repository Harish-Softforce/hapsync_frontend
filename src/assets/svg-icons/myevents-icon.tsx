import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
  <Svg
    width={18}
    height={18}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M16 2v2h-4V2h4ZM6 2v6H2V2h4Zm10 8v6h-4v-6h4ZM6 14v2H2v-2h4ZM18 0h-8v6h8V0ZM8 0H0v10h8V0Zm10 8h-8v10h8V8ZM8 12H0v6h8v-6Z"
      fill="#00ADEF"
    />
  </Svg>
)

export default SvgComponent
