import * as React from 'react'
import { View, Pressable, Text, StyleSheet, ViewStyle, Image, Platform } from 'react-native'

import { useNavigation } from '@react-navigation/core';
import { moderateScale } from '../../../utils/scalingUnits';
import { inviteeEventConfirmation } from '../../../store/actionCreators';
import moment from 'moment';
import GuestCountModal from '../../GuestCountModal';


type Styles = {
    container: ViewStyle
}
const InvitationItem = (props) => {
    const navigation = useNavigation()
    const { data, userId } = props
    const [showCountModal, setShowCountModal] = React.useState(false)

    return <View
        style={styles.container}
    >
        <Pressable
            onPress={() =>
                navigation.navigate("InviteeEventDetails", {
                    data
                })
            }
            style={{ paddingBottom: moderateScale(10) }}
        >
            <View style={{
                flexDirection: 'row',
                backgroundColor: "rgba(0, 173, 239, 0.1)",
                justifyContent: "flex-end",
                padding: moderateScale(3),
            }}>
                {/*    {data.invitationStatus && renderStatus()} */}
                <Text style={{
                    color: 'rgba(53, 93, 155, 1)',
                    fontSize: moderateScale(12),
                    fontFamily: "Mulish-Bold",
                }}>{moment(data.timings[0].slot).format("DD MMM YYYY")}</Text>
                {data.timings[0].startTime &&
                    <Text style={{
                        color: 'rgba(53, 93, 155, 1)',
                        fontSize: moderateScale(12),
                        fontFamily: "Mulish-Bold",
                    }}>{" , " + moment(data.timings[0].startTime, "hh:mm").format("LT")}</Text>
                }<Text> </Text>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    minHeight: moderateScale(60),
                    alignItems: 'center',
                    borderColor: '#355D9B'
                }}>

                <Image
                    style={{
                        width: moderateScale(52),
                        height: moderateScale(52),
                        borderRadius: moderateScale(30),
                        margin: moderateScale(5),
                        borderWidth: 0.5
                    }}

                    source={
                        data?.imagePath
                            ? { uri: data?.imagePath }
                            : require("../../../assets/images/event.png")
                    }
                />
                <View
                    style={{
                        flex: 1,
                        paddingLeft: moderateScale(10),
                        //position: 'relative'
                    }}
                >
                    <Text style={{
                        fontSize: moderateScale(14),
                        color: '#88879C',
                        fontFamily: 'Mulish',
                        fontWeight: '600',
                        lineHeight: moderateScale(18),
                        letterSpacing: moderateScale(0.4)
                    }}>
                        {data.hostName} has invited you to join the event {data.name}.</Text>
                </View>
            </View>
            {data?.description && <View style={{
                paddingTop: moderateScale(4),
                borderWidth: 0.5,
                borderColor: "#fff",
            }}
            >
                <Text style={{ fontFamily: "Mulish-Regular", fontSize: moderateScale(12), color: "rgba(53, 93, 155, 1)" }}>
                    Event Description</Text>
                <View style={{ marginTop: moderateScale(2) }}></View>
                <Text
                    numberOfLines={2}
                    ellipsizeMode='tail'
                    style={{ fontFamily: "Mulish-Regular", fontSize: moderateScale(12), color: '#87899C' }}>
                    {data?.description}</Text>
            </View>
            }
        </Pressable>
        <View style={{
            flexDirection: 'row',
            alignItems: 'center'
            //minHeight: moderateScale(38),
        }}>
            <Pressable onPress={() => {
                let obj = {
                    "eventId": data.id,
                    "responseStatus": 'DECLINED',
                    "userId": userId,
                    "guestCount": 0
                }
                inviteeEventConfirmation(obj, navigation)
            }}
                style={{
                    //backgroundColor: '#C8C5C5',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: "#00ADEF",
                    paddingVertical: moderateScale(10)
                }} >
                <Text style={{
                    fontFamily: 'Mulish',
                    color: '#00ADEF',
                    fontSize: moderateScale(15),
                    fontWeight: "600",
                }}>Decline</Text>
            </Pressable>
            <View style={{ width: 10 }}></View>
            <Pressable onPress={() => {
                setShowCountModal(true)
                /* let obj = {
                    "eventId": data.id,
                    "responseStatus": 'ACCEPTED',
                    "userId": userId,
                    "guestCount": 0
                }
                inviteeEventConfirmation(obj, navigation) */
            }}
                style={{
                    flex: 1,
                    backgroundColor: '#00ADEF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    paddingVertical: moderateScale(10),
                }}>
                <Text style={{
                    fontFamily: 'Mulish',
                    fontSize: moderateScale(15),
                    fontWeight: "600",
                    color: "white"
                }}>Accept</Text>
            </Pressable>
        </View>
        <GuestCountModal
            showCountModal={showCountModal}
            hideModal={() => setShowCountModal(false)}
            onConfirm={(count) => {
                console.log(count)
                let obj = {
                    "eventId": data.id,
                    "responseStatus": 'ACCEPTED',
                    "userId": userId,
                    "guestCount": count
                }
                inviteeEventConfirmation(obj, navigation);

            }}
        />
    </View>
}

const styles = StyleSheet.create<Styles>({
    container: {
        minHeight: 75,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: moderateScale(10),
        marginBottom: moderateScale(10),
        justifyContent: 'space-around',
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

export default InvitationItem