import { View, Text, StyleSheet, ViewStyle, TextStyle, Image, Pressable, Platform, Linking, Alert, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { moderateScale, verticalScale } from '../../../utils/scalingUnits'
import { ButtonGroup } from 'react-native-elements'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as SvgIcons from '../../../assets/svg-icons'
import { addInviteeChat, deleteInvitee, updateEvent } from '../../../store/actionCreators'
import { store } from '../../../store'
import { useSelector } from 'react-redux'

export default function GuestsList({ data, userEditAccess }) {

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [list, setList] = useState([])

    const [all, setAll] = useState([])
    const [tentative, setTentative] = useState([])
    const [accepted, setAccepted] = useState([])
    const [declined, setDeclined] = useState([])

    const navigation = useNavigation()
    const userData = useSelector(state => state.user.userData)
    const event = useSelector(state => state.events.currentEvent)
    let ref1 = useRef(null)

    useEffect(() => {

        const guestsData = data.invitees ? data.invitees : []
        const all = guestsData
        let tentative = []
        let accepted = []
        let declined = []

        guestsData.forEach(element => {
            if (element.response == 'PENDING') {
                tentative.push(element)
            } else if (element.response == 'ACCEPTED') {
                accepted.push(element)
            } else if (element.response == 'DECLINED') {
                declined.push(element)
            }
        });
        setAll(all)
        setTentative(tentative)
        setAccepted(accepted)
        setDeclined(declined)
        let value = selectedIndex
        if (value == 0) {
            setList(all)
        } else if (value == 1) {
            setList(accepted)
        } else if (value == 2) {
            setList(declined)
        } else if (value == 3) {
            setList(tentative)
        }
    }, [data])


    return <View style={{
        backgroundColor: '#fff',
        borderRadius: moderateScale(10),
        marginBottom: moderateScale(10),
        padding: moderateScale(10),
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
    }}>
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: moderateScale(5),
            backgroundColor: 'rgba(238, 215, 255, 0.27)'
        }}>
            <Text style={[styles.heading, { marginHorizontal: 5 }]}>Guests</Text>
            {userEditAccess && <Pressable
                onPress={() => {
                    navigation.navigate("InviteFriend", {
                        editingEvent: true,
                        eventData: data
                    })
                }
                }
            >
                <MaterialCommunityIcons
                    name="plus"
                    style={{
                        color: '#00ADEF',
                        fontSize: moderateScale(23)
                    }}
                />
            </Pressable>
            }
        </View>
        <View style={{ height: moderateScale(7) }}></View>
        <ScrollView style={{}}
            horizontal={true}
            ref={ref1}
            showsHorizontalScrollIndicator={false}>
            <ButtonGroup
                buttons={['All( ' + all.length + ' )',
                'Accepted( ' + accepted.length + ' )',
                'Declined( ' + declined.length + ' )',
                'Tentative( ' + tentative.length + ' )']
                }
                selectedIndex={selectedIndex}
                onPress={(value) => {
                    setSelectedIndex(value);
                    if (value == 0) {
                        setList(all)
                        ref1.current?.scrollTo({ x: -10 })
                    } else if (value == 1) {
                        setList(accepted)
                    } else if (value == 2) {
                        setList(declined)
                    } else if (value == 3) {
                        setList(tentative)
                        ref1.current?.scrollToEnd()
                    }
                }}
                buttonStyle={{
                    alignContent: 'center', borderRadius: 4, backgroundColor: 'white',
                    borderColor: '#355D9B', borderWidth: 0.5,
                }}
                textStyle={{
                    textAlign: 'center', color: 'black', fontFamily: 'Mulish-Bold',
                    fontSize: moderateScale(11), paddingHorizontal: moderateScale(8)
                }}

                innerBorderStyle={{ color: 'white', width: 5 }}
                containerStyle={{ marginHorizontal: moderateScale(-1), height: 40, borderColor: 'white', }}

                selectedButtonStyle={{ backgroundColor: "#355D9B", borderColor: 'black', }}
                selectedTextStyle={{ fontFamily: 'Mulish-Bold', fontSize: moderateScale(10) }}
            />
        </ScrollView>
        <View style={{ paddingVertical: 0 }}>
            {list.map((each, index) => {
                return <View
                    key={each.id}
                    style={{
                        flexDirection: 'row',
                        padding: moderateScale(10),
                        alignItems: 'center',
                        borderBottomWidth: list.length == index + 1 ? 0 : 0.5,
                        borderColor: '#cccccc'
                    }}>

                    <Image
                        style={{
                            width: moderateScale(50),
                            height: moderateScale(50),
                            borderRadius: moderateScale(27),
                            borderWidth: 0.5,
                            borderColor: "black"
                        }}

                        source={
                            each.imageUrl
                                ? {
                                    uri: each.imageUrl
                                }
                                : require("../../../assets/images/event.png")
                        }
                    />
                    <View
                        style={{
                            flex: 1,
                            paddingLeft: moderateScale(10),
                            flexDirection: "row",
                            alignItems: 'center'
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: "MUlish-Regular", fontSize: moderateScale(14), color: '#355D9B' }}>
                                {each?.name}</Text>
                            <Text style={{
                                fontFamily: "MUlish-Regular",
                                fontSize: moderateScale(12),
                                color: '#88879C'
                            }}>
                                {each?.phone}
                            </Text>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={{ fontFamily: "MUlish-Regular", fontSize: moderateScale(12), color: '#88879C' }}>Guests({each?.guestCount})</Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={() => {
                                if (each?.phone) {
                                    Linking.openURL(`tel:${each?.phone}`).catch(e => {
                                        console.log(e)
                                    })
                                }
                            }}
                            style={[styles.blueBox, { flexDirection: 'row', },]}
                        >
                            <MaterialIcons name="call" size={20} color="#00ADEF" />
                        </Pressable>
                        {each?.response == "ACCEPTED" && each?.userId != userData.id &&
                            <Pressable
                                style={[styles.blueBox, { flexDirection: 'row', marginLeft: 7 }]}
                                onPress={() => {
                                    let channel_id = "event-" + event.id
                                    if (each.userId > userData.id) {
                                        channel_id = channel_id + "-onetoone-" + userData.id + "-" + each.userId
                                    } else {
                                        channel_id = channel_id + "-onetoone-" + each.userId + "-" + userData.id
                                    }

                                    let obj = {
                                        channelId: channel_id,
                                        eventId: event.id,
                                        user1_id: userData.id,
                                        user2_id: each.userId
                                    }
                                    if (each?.chatInfo?.find(i => i.channelId == channel_id)) {
                                        navigation.navigate("Chat")
                                    } else {
                                        addInviteeChat(event.id, obj, navigation)
                                    }
                                    //changeChatUser(obj)
                                    /* navigation.navigate("EventTabs", {
                                        screen: "Chat",
                                        data:data,
                                        refresh:true
                                    }) */
                                }}
                            >
                                <SvgIcons.CommentIcon />
                            </Pressable>
                        }

                        {userEditAccess && <Pressable
                            style={[styles.blueBox, { flexDirection: 'row', borderColor: '#E14F50', marginLeft: 7 }]}
                            onPress={() => {
                                let obj = { ...data }
                                obj.eventId = obj.id
                                obj.invitees = obj.invitees.map(i => {
                                    if (i.id == each.id) {
                                        return { ...i, status: "DELETE" }
                                    } else {
                                        return i
                                    }
                                })
                                Alert.alert('Alert!', 'Are you sure you want to remove?', [
                                    {
                                        text: 'Cancel',
                                        onPress: () => { },
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Yes',
                                        onPress: () => {
                                            console.log(obj)
                                            //updateEvent(obj)
                                            deleteInvitee(each.id, data.id)
                                        },
                                        style: 'destructive'
                                    },
                                ]);
                            }}
                        >
                            <Ionicons name='ios-person-remove' size={moderateScale(16)} color="#E14F50" />
                        </Pressable>
                        }
                    </View>
                    {/* <MaterialCommunityIcons
                   name="minus"
                   style={{
                       color: '#E14F50',
                       fontSize: moderateScale(23),
                       marginLeft: 'auto'
                   }}
               /> */}

                </View>
            })
            }
        </View>
    </View >
}
type Styles = {
    container: ViewStyle,
    heading: TextStyle
}


const styles = StyleSheet.create<Styles>({
    heading: {
        fontFamily: 'Mulish-ExtraBold',
        color: '#355D9B',
        fontSize: moderateScale(15.5)
    },
    blueBox: {
        width: moderateScale(30),
        height: moderateScale(30),
        borderRadius: moderateScale(4),
        //backgroundColor: "rgba(0, 173, 239, 1)",
        //marginTop: 5.6,
        borderColor: 'rgba(0, 173, 239, 1)',
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    }
});