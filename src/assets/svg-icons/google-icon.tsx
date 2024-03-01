import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={25}
      height={25}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.398 14.67l-.848 3.256-3.099.067A12.75 12.75 0 010 12.058c0-2.077.491-4.036 1.362-5.76l2.76.52 1.208 2.82a7.637 7.637 0 00-.391 2.42c0 .92.162 1.8.459 2.613z"
        fill="#FBBB00"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.524 9.896a11.827 11.827 0 01-.055 4.786c-.604 2.774-2.184 5.196-4.372 6.91l-3.544-.177-.502-3.05a7.262 7.262 0 003.185-3.682h-6.64V9.896h11.927z"
        fill="#518EF8"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.792 21.537a12.028 12.028 0 01-7.662 2.754c-4.661 0-8.713-2.662-10.78-6.58l3.966-3.316c1.033 2.818 3.694 4.824 6.814 4.824a7.12 7.12 0 003.675-1.017l3.987 3.335z"
        fill="#28B446"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.242 2.824l-4.01 3.253a7.365 7.365 0 00-3.89-1.103 7.357 7.357 0 00-6.96 4.922L1.35 6.625A12.388 12.388 0 0112.341 0c3.003 0 5.757 1.06 7.9 2.824z"
        fill="#F14336"
      />
    </Svg>
  )
}

export default SvgComponent
