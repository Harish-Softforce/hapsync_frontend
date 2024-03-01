import * as React from 'react'
import { View, Pressable, StyleSheet, ViewStyle, Platform, Image, Text } from 'react-native'

import AppText from '../../UI/AppText'
import * as SvgIcons from '../../../assets/svg-icons'
import { moderateScale } from '../../../utils/scalingUnits'
import { useNavigation } from '@react-navigation/core'
import moment from 'moment'

/* type Styles = {
    container: ViewStyle
} */

type Props = {
    containerStyle: ViewStyle
}

const YourEventItem = (props: Props) => {
    const navigation = useNavigation()

    const { data } = props

    const { containerStyle } = props

    const renderStatus = () => {
        // search for owner == invitee match
        let inviteeObj = data.invitees.filter((each) => {
            if (each.id == parseInt(data.owner)) {
                return true
            }
            return false
        })

        return <AppText style={{
            backgroundColor: 'rgba(26, 165, 77, 0.15)',
            color: 'rgba(26, 165, 77, 1)',
            paddingVertical: 4,
            paddingHorizontal: 6,
            borderRadius: 4,
            marginRight: 8,
            fontSize: 10
        }}>Accepted</AppText>
    }

    return <Pressable
        onPress={() => navigation.navigate("EventTabs", {
            data
        })}
        style={[styles.container, containerStyle]}>
        <Text 
        numberOfLines={1}
        ellipsizeMode='tail'
        style={{
            color: '#355D9B',
            fontFamily: 'Mulish-Bold',
            fontSize: moderateScale(13)
        }}>{data?.name}</Text>
        <View style={{height:moderateScale(5)}}></View>
        <AppText
            style={{ fontSize: moderateScale(10), color: '#88879C', flex: 1 }}
        >{moment(data.timings[0].slot).format("DD MMM[,] YYYY") + (data.timings[0].startTime == null ? "" : moment(data.timings[0].startTime, "hh:mm").format(" - LT"))}
        </AppText>

        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: moderateScale(10)
            }}
        >
            {//data.invitationStatus && renderStatus()
            }
            {/* <View
                style={{ transform: [{ scale: moderateScale(0.8) }] }}
            >
                <SvgIcons.GoButton
                />
            </View> */}
            <View style={{}}>
                <Image style={{ height: 22, width: 22 }} source={require("../../../assets/images/open-eye.png")} />
                </View>
        </View>

    </Pressable >
}

const styles = StyleSheet.create({
    container: {
        minHeight: moderateScale(100),
        backgroundColor: '#fff',
        borderRadius: 10,
        flex: 1,
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
        //paddingHorizontal: moderateScale(23),
        padding: moderateScale(10)
    },
    blueBox: {
        width: moderateScale(30),
        height: moderateScale(30),
        borderRadius: moderateScale(4),
        //backgroundColor: "rgba(0, 173, 239, 1)",
        //marginTop: 5.6,
        borderColor: 'rgba(0, 173, 239, 1)',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default YourEventItem