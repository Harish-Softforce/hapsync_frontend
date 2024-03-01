import * as React from 'react'
import { Text, TextProps, TextStyle } from 'react-native'
import { moderateScale } from '../../../utils/scalingUnits'

interface Props extends TextProps {
    style: TextStyle
}

const AppText = (props: Props) => {
    // if styles prop is an array of objects , then reduce to one object
    let styles: TextStyle = Array.isArray(props.style) ?
        props.style?.reduce(function (result, current) {
            return Object.assign(result, current);
        }, {})
        : {
            ...props.style,
            // default all fontWeight to normal, or else correct font will not be rendered
            fontWeight: 'normal'
        }


    if (props?.style?.fontWeight == "bold") {
        styles = {
            ...styles,
            fontFamily: 'Mulish-ExtraBold'
        }
    }

    if (props?.style?.fontWeight == "500") {
        styles = {
            ...styles,
            fontFamily: 'Mulish-Bold'
        }
    }

    return <Text
        style={[
            {
                fontFamily: 'Mulish-Regular',
                fontSize: moderateScale(14)
            }, styles]}
    >{props.children}</Text >
}

export default AppText