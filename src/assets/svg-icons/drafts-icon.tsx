import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={23}
      height={18}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M21.829 2.296l.001.001c.339.319.534.737.534 1.18V15.81c0 1.01-1.04 1.873-2.358 1.873H2.803c-1.318 0-2.357-.862-2.357-1.873V3.477c0-.443.195-.861.534-1.18h0l.001-.001L2.677.638C3 .323 3.478.124 4.032.124h14.745c.555 0 1.032.199 1.342.513h0l.002.001 1.708 1.658zM4.327 1.897h-.04l-.03.029-.983.957-.176.171h16.628l-.179-.172-.995-.957-.03-.028H4.328zM2.703 15.81v.1H20.106V4.857H2.703V15.81zm6.92-5.82h.1V7.03h3.363v2.96h2.95l-4.631 3.718L6.774 9.99h2.85z"
        fill={props.fill}
        stroke="#fff"
        strokeWidth={0.2}
      />
    </Svg>
  )
}

export default SvgComponent
