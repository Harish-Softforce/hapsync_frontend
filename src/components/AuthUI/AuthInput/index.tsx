import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TextStyle
} from 'react-native';

import Text from '../../UI/AppText'

import Feather from 'react-native-vector-icons/Feather'
import { moderateScale } from '../../../utils/scalingUnits';


export interface Props extends TextInputProps {
    label: string,
    errorMessage: string | string[] | undefined
}


const AuthInput = (props: Props) => {
    const { label, errorMessage
    } = props

    let error = undefined;
    let valueCorrect = false;

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


    // if no error message and value is not empty
    if (!errorMessage) {
        if (
            props.value !== "" && props.value
        ) {
            valueCorrect = true
        }
    } else {
        // else for password errormessage which is an Array
        if ((Array.isArray(errorMessage))) {
            if (errorMessage.length == 0) {
                if (
                    props.value !== "" && props.value
                ) {
                    valueCorrect = true
                }
            }
        }
    }

    let inputStyles: TextStyle = {

        color: 'black',
        padding: 6,
        // minHeight: 46,
        fontSize: 14,
        backgroundColor: '#fff',
        //fontFamily: 'Mulish-VariableFont_wght',
        fontFamily: 'Mulish',
        flex: 1
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
            <Text style={styles.label}>{label}</Text>
            <View
                style={{
                    borderBottomWidth: 0.4,
                    borderColor: 'rgba(0, 173, 239, 1)',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                {props.icon && <View style={{ marginRight: 16 }}>{props.icon}</View>}
                {props.countryCode && props.countryCode}
                <TextInput
                    {...props}
                    placeholderTextColor="rgba(53, 93, 155, 0.6)"
                    style={[inputStyles, props.style]}
                />
                <View>
                    {/* {valueCorrect && <Feather
                        name="check"
                        style={{
                            fontSize: moderateScale(20),
                            color: '#1AA54D'
                        }}
                    />} */}
                </View>
            </View>
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
        marginTop: 7,
        marginBottom: 7,
        minHeight: 53,
    },
    error: {
        color: 'red',
        paddingLeft: 7,
        paddingVertical: 7,
        fontSize: 13
    }
})

export default AuthInput;