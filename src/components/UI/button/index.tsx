import React from 'react';
import {
    StyleSheet,
    Pressable,
    ViewStyle,
    TextStyle
} from 'react-native';
import { moderateScale, verticalScale } from '../../../utils/scalingUnits';

import Text from '../AppText'

type Props = {
    style: ViewStyle,
    labelStyle: TextStyle,
    disabled: boolean,
    title: string
}

type Styles = {
    buttonText: TextStyle
}

const AppButton = (props: Props) => {

    const {
        title,
        style,
        clicked,
        type,
        disabled,
        labelStyle,
        underlayColor
    } = props;

    let containerStyles: ViewStyle = {
        height: 50,
        padding: 4,
        borderRadius: moderateScale(6),
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 2,
        backgroundColor: '#355D9B'
    };

    if (type == 'danger') {
        containerStyles = {
            ...containerStyles,
            backgroundColor: '#e03c3c'
        }
    }


    return (
        <Pressable
            style={[
                containerStyles,
                style,
                disabled && { backgroundColor: 'gray' }
            ]}
            onPress={disabled ? undefined : clicked}
        >
            <Text style={[styles.buttonText, labelStyle]}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create<Styles>({
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: moderateScale(15.5)
    }
})

export default AppButton;