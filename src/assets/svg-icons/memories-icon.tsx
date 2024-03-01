import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      height={24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
      width={33}

    >
      <Path
        d="M16.5 23c-3.609 0-5.505-3.602-5.505-7.595 0-5.067 1.995-8.974 4.68-13.143a.981.981 0 011.65 0c2.686 4.169 4.68 8.076 4.68 13.143 0 3.993-1.897 7.595-5.505 7.595zm0 0c-4.09 0-6.488-.402-9.308-2.488-3.33-2.462-4.465-6.14-5.827-10.902-.183-.639.298-1.277.962-1.255 4.857.164 9.1 1.27 11.382 3.994C16.459 15.63 16.5 18.068 16.5 23zm0 0c4.09 0 6.488-.402 9.31-2.488 3.328-2.462 4.463-6.14 5.825-10.902.183-.639-.298-1.277-.963-1.255-4.856.164-9.097 1.27-11.38 3.994C16.541 15.63 16.5 18.068 16.5 23z"
        stroke={props.fill}
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </Svg>
  )
}

export default SvgComponent
