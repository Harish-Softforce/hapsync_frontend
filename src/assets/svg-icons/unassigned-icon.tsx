import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={20}
      height={21}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M14.243 7.314L12.828 5.9 10 8.728 7.172 5.9 5.757 7.314l2.829 2.828-2.829 2.829 1.415 1.414L10 11.556l2.828 2.829 1.415-1.414-2.829-2.829 2.829-2.828zM17.07 3.07C13.168-.832 6.832-.832 2.93 3.071c-3.903 3.903-3.903 10.239 0 14.142 3.903 3.903 10.239 3.903 14.142 0 3.903-3.903 3.903-10.239 0-14.142zM4.343 15.8c-3.118-3.118-3.118-8.195 0-11.314 3.118-3.118 8.196-3.118 11.314 0 3.118 3.119 3.118 8.196 0 11.314-3.118 3.118-8.196 3.118-11.314 0z"
        fill={props.fill ? props.fill : "#00ADEF"}
      />
    </Svg>
  )
}

export default SvgComponent
