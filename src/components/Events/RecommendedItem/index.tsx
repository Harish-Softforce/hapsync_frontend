import * as React from 'react'
import { View, Pressable, StyleSheet, ViewStyle, Text, Platform, Image } from 'react-native'

import AppText from '../../UI/AppText'
import * as SvgIcons from '../../../assets/svg-icons'
import { moderateScale } from '../../../utils/scalingUnits'
import { useNavigation } from '@react-navigation/core'
import moment from 'moment'
import { useSelector } from 'react-redux'

type Styles = {
    container: ViewStyle,
    guestcount: ViewStyle
}

type Props = {
    containerStyle: ViewStyle
}

const RecommendedItem = (props: Props) => {

    const navigation = useNavigation()

    const { userData } = useSelector(state => state.user)
    //const task = props.data.activities.find(i => i.vendors.find(vendor => vendor.userId == userData.id))

    const { data } = props

    const { containerStyle } = props

    return <Pressable
        onPress={() =>
            navigation.navigate("EventDetailsView", {
                data,
                recommended: true
            })
        }
        style={[styles.container, containerStyle]}>
        <Text style={{
            color: '#355D9B',
            fontFamily: 'Mulish-Bold',
            fontSize: moderateScale(13)
        }}>{data?.name}</Text>

        <View>
            <Text
                numberOfLines={1}
                style={{
                    fontSize:moderateScale(10) ,
                    color: '#87899C',
                    fontFamily: "Mulish-Bold",
                    marginTop: 5,
                }}
            >
                {data?.locations[0].name}
            </Text>
        </View>

        <View style={{ flexDirection: "row", marginVertical: 7, }}>
            <View style={{ width: "60%", }}>
                <Text style={styles.guestcount} >No of Guests</Text>
            </View>
            <View>
                <Text style={styles.guestcount} >{data.invitees.length}</Text>
            </View>
        </View>

        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: "center",
            }}
        >
            {data.timings.length > 0 && <Text
                style={{ fontSize: moderateScale(10), fontFamily: "Mulish-Bold", color: '#355D9B', flex: 1 }}
            > {moment(data.timings[0].slot).format("DD MMM[,] YYYY") + (data.timings[0].startTime == null ? "" : moment(data.timings[0].startTime, "hh:mm").format(" - LT"))}
            </Text>}
            <View
                style={{ transform: [{ scale: moderateScale(0.8) }], }}
            >
               

                <Image style={{ height: 22, width: 22 }} source={require("../../../assets/images/open-eye.png")} />


            </View>
        </View>

    </Pressable >
}

const styles = StyleSheet.create<Styles>({
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
        paddingHorizontal: moderateScale(15),
        paddingVertical: moderateScale(15),
    },
    guestcount: {
        color: "#474752",
        fontFamily: "Mulish",
        fontSize: 11
    }
})

export default RecommendedItem