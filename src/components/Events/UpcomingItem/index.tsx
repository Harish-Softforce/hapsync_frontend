import * as React from 'react'
import { View, Pressable, Text, StyleSheet, ViewStyle, Image, Linking, Platform } from 'react-native'

import * as SvgIcons from '../../../assets/svg-icons'
import { moderateScale } from '../../../utils/scalingUnits'

import DashedLine from 'react-native-dashed-line';
import { useNavigation } from '@react-navigation/core';

import moment from 'moment'
import { showLocation } from 'react-native-map-link';
import Config from 'react-native-config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import ChatContext from '../../../chatContext';
import Share from 'react-native-share';
import CryptoJS from 'crypto-js';

/* 
type Styles = {
    container: ViewStyle
} */

const UpcomingItem = (props) => {
    const navigation = useNavigation()
    const { data } = props

    let totalChatCount = 0

    const {
        chatClient,
        setupChatClient,
        clientReady,
        disconnectClient,
        setChannel
    } = React.useContext(ChatContext)

    const [unreadCount, setUnreadCount] = React.useState(0)

    var channelListener = undefined
    let channelWithState = undefined

    React.useEffect(() => {

        const startup = async () => {
            if (!clientReady) {
                return
                //await setupChatClient()
            }
            //let invitees = data.invitees?.filter(each => each.response == "ACCEPTED")
           /*  const groupName = `event-groupchat-${data?.id}`;
            try {
                let queryRes = await chatClient.queryChannels(
                    {
                        type: 'messaging',
                        id: { $eq: groupName }
                    }, {}, {
                    watch: true, // this is the default
                    state: true,
                })
                console.log(queryRes)
                if (queryRes?.length > 0) {
                    channelWithState = queryRes[0]
                    setUnreadCount(channelWithState.countUnread())
                    channelListener = channelWithState.on(event => {
                        if (event.unread_count) {
                            //console.log("unread "+channelWithState.countUnread())
                            setUnreadCount(channelWithState.countUnread())
                        }
                    })
                }
            } catch (e) {
                console.log(e)
            } */
            /*  let guestIds = []
             if (invitees) {
                 let owner = props?.route?.params?.data?.owner;
                 guestIds = invitees?.map((invitee) => `${invitee?.userId}_user`);
                 // add owner to group
                 guestIds.push(`${data?.owner}_user`)
             }
 
             const channel = chatClient.channel("messaging", groupName,
                 {
                     members: [
                         ...guestIds
                     ], name: groupName
                 });
             await channel.create();
 
             // use CID to get channel data with full state
             const filter = {
                 type: 'messaging',
                 members: { $in: [...guestIds] },
                 id: { $eq: groupName }
             };
             let members = await channel.queryMembers({})
 
             if (members.members.length < invitees.length) {
                 let difference = invitees.filter(x => !members.members.includes(y => y.user_id == x.userId));
                 difference = difference.map((invitee) => `${invitee?.userId}_user`);
 
                 if (difference.length > 0) {
                     await channel.addMembers(difference);
                 }
             } 
 
             let queryRes;
             if (guestIds?.length > 0) {
                 queryRes = await chatClient.queryChannels(filter, {}, {
                    watch: true, // this is the default
                    state: true,
                 });
     
                 const channelWithState = queryRes[0]
                 //console.log(channelWithState)
     
                 if (!channelWithState) {
                    return;
                 }
                 setUnreadCount(channelWithState.countUnread())
                 channelListener = channel.on(event => {
                    if (event.unread_count) {
                       setUnreadCount(channelWithState.countUnread())
                    }
                 })
     
              } */
        }
        startup()

        return async () => {
            await channelListener?.unsubscribe();
            await channelWithState?.stopWatching()
        }
    }, [])


    const renderProgress = () => {

        const { invitees } = data;

        let accepted = 0, tentative = 0, declined = 0
        if (Array.isArray(invitees)) {
            accepted = invitees.filter((each) => each.response == "ACCEPTED").length
            declined = invitees.filter((each) => each.response == "DECLINED").length
            tentative = invitees.filter((each) => each.response == "PENDING").length
        }

        const progressData = [
            {
                title: 'Accepted',
                value: accepted
            },
            {
                title: 'Tentative',
                value: tentative
            },
            {
                title: 'Declined',
                value: declined
            }
        ]

        return <View style={{ width: '40%', marginTop: 15 }}>
            {progressData.map((each, index) => {
                return <View
                    key={each?.title}
                    style={{ flexDirection: 'row' }}>
                    <Text style={{
                        color: '#88879C',
                        fontSize: 11,
                    }}>{each?.title}</Text>
                    {greyLine()}
                    <Text style={{
                        color: '#88879C',
                        fontSize: 11,
                        marginLeft: 'auto'
                    }}>{each?.value}</Text>
                </View>
            })}
        </View>
    }

    const renderStatus = () => {

        return <Text style={{
            backgroundColor: 'rgba(26, 165, 77, 0.15)',
            color: 'rgba(26, 165, 77, 1)',
            paddingVertical: 4,
            paddingHorizontal: 6,
            borderRadius: 4,
            fontSize: 11,
        }}>Accepted</Text>
    }

    const renderGuestsProgress = () => {

        const { invitees } = data;

        let accepted = 0, tentative = 0, declined = 0
        if (Array.isArray(invitees)) {
            accepted = invitees.filter((each) => each.response == "ACCEPTED").length
            declined = invitees.filter((each) => each.response == "DECLINED").length
            tentative = invitees.filter((each) => each.response == "PENDING").length
        }

        return <View style={{}}>
            <View style={{ flexDirection: "row", flexWrap: 'wrap', flex: 1, }}>
                <Text style={styles.italicText}>Accepted </Text>
                <Text style={styles.greyText}>{"(" + accepted + ")"} </Text>
                <Text style={styles.italicText}>Tentative </Text>
                <Text style={styles.greyText}>{"(" + tentative + ")"} </Text>
                <Text>
                    <Text style={styles.italicText}>Declined </Text>
                    <Text style={styles.greyText}>{"(" + declined + ")"}</Text>
                </Text>
            </View>

        </View>
    }

    const greyLine = () => {
        return <View style={{
            minWidth: moderateScale(46), flex: 1, justifyContent: 'center',
            marginHorizontal: 3
        }}><DashedLine
                dashColor="grey"
                dashGap={2}
                dashThickness={0.9}
                dashLength={5} /></View>
    }

    const renderBottomSection = () => {
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            //marginTop: 10
        }}>
            <View style={{
                alignItems: 'flex-start',
                flex: 1,
                alignSelf: 'center'
            }}>
                {data.invitationStatus && renderStatus()}
            </View>
            {/* <View style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                {data.invitationStatus && renderStatus()}
                <Text style={{
                    color: 'rgba(53, 93, 155, 1)',
                    fontSize: 10,
                    fontFamily: "Mulish-Bold"
                }}>{moment(data.timings[0].slot).format("DD MMM YYYY")}</Text>
                {data.timings[0].startTime &&
                    <Text style={{
                        color: 'rgba(53, 93, 155, 1)',
                        fontSize: 10,
                        fontFamily: "Mulish-Bold"
                    }}>{" , " + moment(data.timings[0].startTime, "hh:mm").format("LT")}</Text>
                }
            </View> */}
            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
                {!props?.hideShare && <Pressable
                    onPress={() => {
                        if (data?.id) {
                            try {
                                var eventId = String(data.id)
                                var key = CryptoJS.enc.Latin1.parse('1234567812345678');
                                var iv = CryptoJS.enc.Latin1.parse('1234567812345678');
                                var encrypted = CryptoJS.AES.encrypt(
                                    eventId,
                                    key,
                                    {
                                        iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding
                                    }
                                )
                                console.log(String(encodeURIComponent(encrypted)))

                                Share.open({
                                    message: Config.RSVP_BASE_URL + encodeURIComponent(encrypted)
                                }).then((res) => {
                                    console.log(res);
                                }).catch((err) => {
                                    console.log(err);
                                })
                            } catch (e) {
                                console.log(e)
                            }
                        }
                    }}
                    style={styles.blueBox}
                >
                    <Fontisto
                        name='share'
                        style={{
                            color: 'rgba(0, 173, 239, 1)',
                            fontSize: moderateScale(16),
                        }}
                    />
                </Pressable>}
                <Pressable
                    onPress={() => {
                        showLocation({
                            latitude: data?.locations[0].latitude,
                            longitude: data?.locations[0].longitude,
                            //googlePlaceId: data.placeId,
                            title: data?.locations[0].name
                        }).catch(e => {
                            console.log(e)
                        })
                    }}
                    style={styles.blueBox}
                >
                    <MaterialCommunityIcons
                        name="directions"
                        style={{
                            fontSize: moderateScale(19),
                            color: 'rgba(0, 173, 239, 1)'
                        }}
                    />
                </Pressable>
                {props.role == "ORGANIZATION"
                    ? <></>
                    : <Pressable
                        style={[styles.blueBox, { flexDirection: 'row', padding: 5 }]}
                        onPress={() => {
                            navigation.navigate("EventTabs", {
                                screen: "Chat",
                                data,
                            })
                        }}
                    >
                        <SvgIcons.CommentIcon />
                        {/* <Text style={{
                            color: '#00ADEF',
                            fontSize: 10,
                            marginLeft: 2
                        }}>{unreadCount}</Text> */}
                    </Pressable>
                }
                {//data.invitationStatus && 
                    <Pressable
                        onPress={() => {
                            if (data.hostPhone) {
                                Linking.openURL(`tel:${data.hostPhone}`).catch(e => {
                                    console.log(e)
                                })
                            }
                        }}
                        style={styles.blueBox}
                    >
                        <MaterialIcons name="call" size={moderateScale(19)} color="#00ADEF" />
                    </Pressable>
                }
                {/* <View
                    style={{ transform: [{ scale: moderateScale(0.8) }] }}
                >
                    <SvgIcons.GoButton
                    />
                </View> */}
                <View style={styles.blueBox}>
                    <Image style={{ height: 22, width: 22 }} source={require("../../../assets/images/open-eye.png")} />
                </View>
            </View>
        </View>
    }



    return <Pressable
        onPress={() => {
            if (props.role == "ORGANIZATION") {
                navigation.navigate("EventDetailsView", {
                    data, orgview: true
                })
            } else {
                navigation.navigate("EventTabs", {
                    data
                })
            }
        }}
        style={styles.container}>

        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>

            <Text
                numberOfLines={1}
                ellipsizeMode='tail'
                style={{
                    fontSize: moderateScale(14),
                    fontFamily: 'Mulish-ExtraBold',
                    color: 'rgba(53, 93, 155, 1)',
                    width: "50%"
                }}>{data?.name}
            </Text>

            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap', flex: 1,
                justifyContent: 'flex-end'
            }}>
                {/*    {data.invitationStatus && renderStatus()} */}
                <Text style={{
                    color: 'rgba(53, 93, 155, 1)',
                    fontSize: moderateScale(13),
                    fontFamily: "Mulish-Bold",
                }}>{moment(data.timings[0].slot).format("DD MMM YYYY")}</Text>
                {data.timings[0].startTime && <Text style={{
                    color: 'rgba(53, 93, 155, 1)',
                    fontSize: moderateScale(13),
                    fontFamily: "Mulish-Bold",
                }}>{","}</Text>}
                {data.timings[0].startTime &&
                    <Text style={{
                        color: 'rgba(53, 93, 155, 1)',
                        fontSize: moderateScale(13),
                        fontFamily: "Mulish-Bold",
                        flexShrink: 1
                    }}>{" " + moment(data.timings[0].startTime, "hh:mm").format("LT")}</Text>
                }
            </View>
        </View>
        <View style={{ paddingTop: moderateScale(5) }}>
            <Text style={{
                fontSize: moderateScale(13),
                color: 'rgba(0, 173, 239, 1)',
                fontFamily: "Mulish",
                fontWeight: '600',
                lineHeight: moderateScale(20)
            }}>Hosted By - {data?.hostName}</Text>
        </View>
        <View style={{ paddingBottom: moderateScale(5) }}>
            <Text style={{
                fontSize: moderateScale(13),
                color: '#87899C',
                fontFamily: "Mulish",
                fontWeight: '600',
                lineHeight: moderateScale(20)
            }}>{data?.locations[0]?.name}</Text>
        </View>
        {//renderProgress()
        }
        {renderGuestsProgress()}
        <View style={{ height: 15 }}></View>

        {renderBottomSection()}
    </Pressable>
}

const styles = StyleSheet.create<Styles>({
    container: {
        //minHeight: 170,
        backgroundColor: '#fff',
        borderRadius: 10,
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
        //justifyContent: 'space-around',
    },
    iconStyle: {
        flex: 1,
        padding: 10,
    },
    greenBg: {
        backgroundColor: 'rgba(26, 165, 77, 0.15)',
        color: 'rgba(26, 165, 77, 1)',
        paddingVertical: 4,
        paddingHorizontal: 6,
        borderRadius: 4,
        marginRight: 8,
        fontSize: 10
    },
    italicText: {
        fontFamily: "Mulish-BoldItalic",
        color: "rgba(53, 93, 155, 1)"
    },
    greyText: {
        color: "#88879C",
        fontFamily: "Mulish-BoldItalic",
    },
    blueBox: {
        width: moderateScale(30),
        height: moderateScale(30),
        borderRadius: moderateScale(4),
        //backgroundColor: "rgba(0, 173, 239, 1)",
        marginLeft: moderateScale(10),
        borderColor: 'rgba(0, 173, 239, 1)',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default UpcomingItem