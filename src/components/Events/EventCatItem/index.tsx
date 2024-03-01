import * as React from 'react'
import { View, StyleSheet, ViewStyle, ImageBackground, Pressable, Platform, Text } from 'react-native'
import { moderateScale } from '../../../utils/scalingUnits'

import AppText from '../../../components/UI/AppText'

import LinearGradient from 'react-native-linear-gradient';

type Styles = {
    container: ViewStyle
}

const eventCategoryItem = (props) => {
    const { navigation, data } = props

    return <Pressable
        onPress={() => navigation.navigate("CreateEventScreen", {
            category: data,
        })}
        style={styles.container}>
        <ImageBackground
            source={
                data?.imagePath
                    ? {
                        uri: data.imagePath
                    }
                    : require("../../../assets/images/splashscreen.png")
            }
            imageStyle={{ borderRadius: moderateScale(6) }}
            style={{
                margin: moderateScale(11.5),
                flex: 1,
                borderRadius: moderateScale(6),
            }}
        ><LinearGradient colors={['transparent', 'rgba(0,0,0,0.06)', 'rgba(0,0,0,0.44)', 'rgba(0,0,0,0.7)']} style={{
            justifyContent: 'flex-end',
            flex: 1,
            borderRadius: moderateScale(6),
            padding: moderateScale(10)
        }}>
                <View>
                    <Text style={{
                        color: 'rgba(0, 173, 239, 1)',
                        fontFamily: 'Mulish-Bold',
                        fontSize: moderateScale(16)
                    }}>{data?.description}</Text>
                    {/* <Text style={{
                        fontSize: moderateScale(10),
                        color: '#fff'
                    }}>{data?.description}</Text> */}
                </View>
            </LinearGradient>
        </ImageBackground>
    </Pressable>
}

const styles = StyleSheet.create<Styles>({
    container: {
        backgroundColor: '#fff',
        height: moderateScale(175),
        borderRadius: moderateScale(6),
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
        marginBottom: moderateScale(6)
    }
})

export default eventCategoryItem