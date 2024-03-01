import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={16}
      height={13}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M12.96 6.933c-.147 0-.3-.037-.447-.064a7.517 7.517 0 01-.873-.208c-.31-.09-.65-.085-.954.013a1.262 1.262 0 00-.7.52l-.146.24a8.23 8.23 0 01-1.773-1.066 6.86 6.86 0 01-1.334-1.419l.28-.149c.296-.116.528-.315.65-.56a.87.87 0 00.017-.763 4.716 4.716 0 01-.26-.698 3.246 3.246 0 01-.08-.363c-.08-.376-.327-.716-.694-.96a2.329 2.329 0 00-1.306-.368h-2a2.434 2.434 0 00-.834.139 2.036 2.036 0 00-.686.404c-.19.173-.331.376-.414.596-.083.22-.105.452-.066.68.355 2.234 1.63 4.31 3.625 5.9 1.995 1.59 4.594 2.602 7.388 2.878h.254c.491 0 .966-.143 1.333-.405.211-.15.38-.336.494-.543.115-.207.174-.43.173-.657v-1.6c-.008-.37-.177-.727-.477-1.01a2.156 2.156 0 00-1.17-.537zm.333 3.2c0 .076-.02.15-.06.22a.56.56 0 01-.166.18.763.763 0 01-.256.114.87.87 0 01-.29.02c-2.498-.256-4.817-1.17-6.592-2.598-1.776-1.427-2.907-3.286-3.216-5.285a.471.471 0 01.028-.232.558.558 0 01.14-.205.678.678 0 01.225-.134.81.81 0 01.274-.048h2a.78.78 0 01.428.115.533.533 0 01.239.307 5.076 5.076 0 00.407 1.259l-.934.346a.682.682 0 00-.211.122.53.53 0 00-.136.178.438.438 0 00.02.41c.96 1.643 2.612 2.965 4.667 3.733a.822.822 0 00.507 0 .714.714 0 00.224-.108.559.559 0 00.156-.17l.413-.746c.345.098.697.18 1.053.245.178.032.358.059.54.08a.706.706 0 01.384.19.469.469 0 01.143.343l.013 1.664z"
        fill="#00ADEF"
      />
    </Svg>
  )
}

export default SvgComponent
