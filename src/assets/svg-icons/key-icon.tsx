import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={16}
      height={9}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M8.473 3c-.597-1.748-2.211-3-4.11-3C1.957 0 0 2.018 0 4.5S1.956 9 4.364 9c1.898 0 3.512-1.253 4.109-3h3.163v3h2.91V6H16V3H8.473zm-4.11 3c-.8 0-1.454-.675-1.454-1.5S3.564 3 4.364 3s1.454.675 1.454 1.5S5.164 6 4.364 6z"
        fill="#00ADEF"
      />
    </Svg>
  )
}

export default SvgComponent
