import * as React from 'react'
import { View, Text, StyleSheet, ViewStyle, Pressable, Platform, Image } from 'react-native'
import { moderateScale } from '../../../utils/scalingUnits'

import * as SvgIcons from '../../../assets/svg-icons'
import { useNavigation } from '@react-navigation/native'

type Styles = {
    container: ViewStyle,
    heading: ViewStyle
}

const memoryItem = ({ length }) => {
    const navigation = useNavigation()

    return <Pressable
        onPress={() => navigation.navigate("Memories")}

    >
        <View style={{ marginBottom: 11 }}>
            <Text style={{
                fontSize: moderateScale(18),
                fontFamily: 'Mulish-ExtraBold',
                color: 'rgba(53, 93, 155, 1)'
            }}>{"Memories"}</Text>
        </View>

        <View style={styles.container}>


            <View style={{flex:1}}>
                <Text style={{
                    fontSize: moderateScale(18),
                    fontFamily: 'Mulish-ExtraBold',
                    color: 'rgba(53, 93, 155, 1)'
                }}
                >{length}</Text>

                <Text style={{
                    color: 'rgba(136, 135, 156, 1)',
                    fontSize: moderateScale(12),
                    marginTop: 5
                }}>Have a look at your cherishable moments</Text>
            </View>
            {/* <View
            style={{ transform: [{ scale: moderateScale(0.8) }] }}
              >
            <SvgIcons.GoButton
            />
           </View> */}

            <Image style={{ height: 22, width: 22 }} source={require("../../../assets/images/open-eye.png")} />

        </View>
    </Pressable>
}

const styles = StyleSheet.create<Styles>({
    container: {
        backgroundColor: '#fff',
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
        borderRadius: 10,
        padding: moderateScale(10),
        paddingVertical: moderateScale(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    heading: {
        fontSize: moderateScale(14),
        fontFamily: 'Mulish-ExtraBold',
        color: '#355D9B',
    }
})

export default memoryItem
