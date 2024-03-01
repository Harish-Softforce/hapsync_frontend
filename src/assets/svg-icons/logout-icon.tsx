import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
  <Svg
    width={12}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M0 8a.75.75 0 0 0 .75.75h5.692l-1.724 1.717a.75.75 0 0 0 0 1.066.75.75 0 0 0 1.064 0l3-3a.75.75 0 0 0 .158-.248.75.75 0 0 0 0-.57.75.75 0 0 0-.157-.247l-3-3a.753.753 0 1 0-1.066 1.064L6.444 7.25H.75A.75.75 0 0 0 0 8ZM9.75.5h-7.5A2.25 2.25 0 0 0 0 2.75V5a.75.75 0 0 0 1.5 0V2.75A.75.75 0 0 1 2.25 2h7.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V11A.75.75 0 1 0 0 11v2.25a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 12 13.25V2.75A2.25 2.25 0 0 0 9.75.5Z"
      fill="#00ADEF"
    />
  </Svg>
)

export default SvgComponent
