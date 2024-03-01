import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={26}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M23.4 21.533h.2V2.467H2.4v19.066h21zM14.833 10.62l1.69 1.746.143.148.143-.148 3.978-4.08 1.567 1.607-5.687 5.82-3.388-3.5 1.553-1.593zM2.6.2h20.8c1.315 0 2.4 1.106 2.4 2.467v18.666c0 1.361-1.085 2.467-2.4 2.467H2.6c-1.315 0-2.4-1.106-2.4-2.467V2.667C.2 1.306 1.285.2 2.6.2zm1.5 7.6V5.533h6.1V7.8H4.1zm0 5.333v-2.266h6.1v2.266H4.1zm0 5.334V16.2h6.1v2.267H4.1z"
        fill="#fff"
        stroke="#00ADEF"
        strokeWidth={0.4}
      />
    </Svg>
  )
}

export default SvgComponent
