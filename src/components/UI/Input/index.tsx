import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TextStyle,
    TextInputProps,
    ViewStyle,

} from 'react-native';
import { moderateScale } from '../../../utils/scalingUnits';

import Text from '../AppText'

export interface Props extends TextInputProps {
    label: string,
    errorMessage: string | string[] | undefined,
    containerStyle: ViewStyle,
    labelStyle: TextStyle
}


const AppInput = (props: Props) => {
    const { label, errorMessage
    } = props

    let error = undefined;
    // if there is error
    if (errorMessage) {
        error = <Text style={styles.error}>{errorMessage}</Text>
        // if its error message for password(multiple errors)
        if (Array.isArray(errorMessage)) {
            error = errorMessage.map(each => (
                <Text
                    key={each}
                    style={styles.error}>{each}</Text>
            ))
        }
    }

    let inputStyles: TextStyle = {
        borderRadius: moderateScale(6),
        borderColor: 'rgba(53, 93, 155, 1)',
        color: 'rgba(53, 93, 155, 1)',
        padding: 6,
        minHeight: moderateScale(40),
        borderWidth: 0.5,
        fontFamily: 'Mulish-Regular',
    }

    if (props.editable === false) {
        inputStyles = {
            ...inputStyles,
            color: '#6d6d6d',
            backgroundColor: '#e8e8e8'
        }
    }


    return (
        <View style={[styles.wrapper, props.containerStyle]}>
            {label && <Text style={[styles.label, props.labelStyle]}>{label}</Text>}
            <TextInput
                placeholderTextColor="rgba(53, 93, 155, 1)"
                {...props}
                style={[inputStyles, props.style]}
            />
            {error}
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    wrapper: {
        // marginHorizontal: 15,
        //marginTop: moderateScale(10),
        //marginBottom: moderateScale(7),
        //minHeight: moderateScale(53),
    },
    error: {
        color: 'red',
        paddingLeft: 7,
        paddingVertical: 7,
        fontSize: moderateScale(13)
    }
})

export default AppInput;