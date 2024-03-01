import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={22}
      height={28}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M20.14 20.506a15.253 15.253 0 01-4.48-1.625 1.303 1.303 0 00-1.383.06l-2.553 2.181C8.36 18.64 5.535 14.632 4.43 10.44l2.972-1.68a1.36 1.36 0 00.572-1.275 14.87 14.87 0 01.16-4.762 1.332 1.332 0 00-1.046-1.547L2.558.301C1.85.164.939.314.75 1.296-1.598 13.458 6.57 25.52 18.72 27.864c.929.18 1.455-.575 1.594-1.295l.872-4.516a1.332 1.332 0 00-1.046-1.547z"
        fill="#19A450"
      />
    </Svg>
  )
}

export default SvgComponent
