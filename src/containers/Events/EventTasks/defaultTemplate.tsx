import { View, Text, StyleSheet, Pressable, Platform } from 'react-native'
import React, { useState } from 'react'
import { moderateScale, verticalScale } from '../../../utils/scalingUnits';
import * as SvgIcons from '../../../assets/svg-icons'

export default function DefaultTemplate(props) {
    const { data } = props;

    const [checked, setChecked] = useState(false)
    return (
        <Pressable
            onPress={() => {
                setChecked(!checked)
                props.handleChecked(data.id)
            }}
            style={styles.container}
        >
            <View

                style={{
                    flexDirection: 'row'
                }}
            >

                {/* <View style={{
                flex: 0.2,
                justifyContent: 'center',
            }}>
                <View style={{
                    backgroundColor: '#00ADEF',
                    height: verticalScale(45),
                    width: verticalScale(45),
                    borderRadius: verticalScale(47),
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {data?.icon}
                </View>
            </View> */}
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                }}
                >
                    <Text style={{
                        color: '#355D9B',
                        fontFamily: 'Mulish-Bold',
                        fontSize: moderateScale(15)
                    }}>
                        {data?.activityTypeName}
                    </Text>
                    {/* <Text style={{
                    fontSize: verticalScale(10),
                    color: '#9F9FB9'
                }}>Browse vendors</Text> */}
                </View>
                <View
                    /* onPress={() => {
                        setChecked(!checked)
                        props.handleChecked(data.id)
                    }} */
                    style={{
                        // flex: 1,
                        // justifyContent: 'center',
                        // alignItems: 'flex-end'
                    }}>
                    {checked ?
                        <SvgIcons.CheckedIcon
                            style={{ transform: [{ scale: moderateScale(0.9) }] }}
                        /> :

                        <SvgIcons.UncheckedIcon
                            style={{ transform: [{ scale: moderateScale(0.9) }] }}
                        />
                    }
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: verticalScale(20),
        backgroundColor: '#fff',
        minHeight: verticalScale(70),
        borderRadius: verticalScale(10),
        marginBottom: verticalScale(10),
        borderWidth: 0.5,
        borderColor: 'grey',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1
            },
            android: {
                elevation: 1
            }
        }),
    }
})
