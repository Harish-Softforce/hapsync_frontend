import { View, Text, ImageBackground, ScrollView, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import TopBar from '../../components/TopBar'
import { moderateScale, verticalScale } from '../../utils/scalingUnits'
import { useDispatch, useSelector } from 'react-redux'
import { logoutSuccess } from '../../store/userSlice'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import ChatContext from '../../chatContext'
import LinearGradient from 'react-native-linear-gradient'

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { clearAllEvents } from '../../store/eventsSlice'
import { clearAllDrafts } from '../../store/draftsSlice'
import instance from '../../axios'
import DeleteAccountConfirmModal from '../../components/DeleteAccountConfirmModal'
import Toast from 'react-native-toast-message'
import { store } from '../../store'
import { hideLoadingModal, showLoadingModal } from '../../store/utilsSlice'
import Config from 'react-native-config'

export default function Profile(props) {

    const data = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const {
        chatClient,
        clientReady,
        disconnectClient,
        setupChatClient,
        clientSetupLoading,
        setChannel,
    } = React.useContext(ChatContext);

    const [showModal, setshowModal] = useState(false)

    const list = [
        {
            label: 'Account',
            imgIcon: <MaterialCommunityIcons name="account" size={28} color="#00ADEF" />,
            onPress: () => {
                props.navigation.navigate("Account")
            }
        },
        {
            label: 'Notifications',
            imgIcon: <Ionicons name="notifications" size={28} color="#00ADEF" />,
            onPress: () => {
                props.navigation.navigate("NotificationSetting")
            }
        },
        {
            label: 'Send Feedback',
            imgIcon: <MaterialIcons name="feedback" size={28} color="#00ADEF" />,
            onPress: () => {
                props.navigation.navigate("SendFeedback")
            }
        },
        /* {
            label: 'Change Password',
            imgIcon: <MaterialCommunityIcons name="lock-question" size={28} color="#00ADEF" />,
            onPress: () => {
                props.navigation.navigate("ChangePassword")
            }
        }, */
        {
            label: 'Delete Account',
            imgIcon: <MaterialCommunityIcons name="delete" size={28} color="#00ADEF" />,
            onPress: () => {
                setshowModal(true)
            }
        },
        {
            label: 'Logout',
            imgIcon: <Entypo name="log-out" size={28} color="#00ADEF" />,
            onPress: () => {
                console.log("logout")
                instance.post('/user/' + data.userData.id + '/logout').then(r => {
                    clearAll()
                }).catch(e => console.log(e))
            }
        },
    ]
    const clearAll = async () => {
        dispatch(clearAllEvents())
        dispatch(clearAllDrafts())
        dispatch(logoutSuccess(null))
        await disconnectClient()
    }

    const renderPersonalDetails = () => {
        console.log(Config.APP_VERSION)
        return <View style={{ marginTop: -30 }}>
            <View style={{
                alignItems: 'center', justifyContent: "center", marginTop: 35,
                zIndex: 1
            }}>
                <Image
                    source={
                        data.userData.imageUrl
                            ? { uri: data.userData.imageUrl }
                            : require("../../assets/images/splashscreen.png")
                    }
                    style={{
                        height: verticalScale(126),
                        width: verticalScale(126),
                        borderRadius: verticalScale(80),
                        //zIndex: 1,
                        borderWidth: 0.5,
                    }}
                />
            </View>
            <View style={{
                position: 'relative',
                marginTop: -70,
                backgroundColor: '#fff',
                minHeight: verticalScale(250),
                width: "100%",
                borderRadius: verticalScale(10),
                padding: moderateScale(5),
                justifyContent: 'space-around',

            }}>
                <View style={{
                    alignSelf: 'center',
                    alignItems: 'center',
                    marginVertical: 70,
                    marginBottom: 10
                }}>
                    <Text style={{
                        color: '#355D9B',
                        fontWeight: 'bold',
                        fontSize: verticalScale(16)
                    }}>{data.userData.name}</Text>

                    {data.userData.role == "ORGANIZATION" &&
                        <Text style={{
                            fontSize: verticalScale(13), color: "rgba(53, 93, 155, 0.4)"
                        }}>{"#" + data.userData.orgId}</Text>}

                    {data.userData.role != "USER" && <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        colors={['#00ADEF', '#355D9B']}
                        style={{
                            height: verticalScale(35),
                            minWidth: moderateScale(140),
                            marginTop: verticalScale(15),
                            borderRadius: verticalScale(5),
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                        {/* <SimpleLineIcons name="globe" size={25} color="#fff" /> */}
                        <Text style={{
                            color: '#fff',
                            marginLeft: moderateScale(6),
                            fontFamily: "Mulish"
                        }}>
                            {String(data.userData.website).toLowerCase()}
                        </Text>
                    </LinearGradient>
                    }
                </View>
                <View style={{ minHeight: 310 }}>
                    {
                        list.map((l, i) => (
                            <View key={i}>
                                <Pressable
                                    onPress={l.onPress}
                                    style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                                    <View>
                                        {l.imgIcon}
                                    </View>
                                    <View style={{ marginLeft: 15 }}>
                                        <Text
                                            style={{
                                                fontFamily: 'Mulish',
                                                color: "#355D9B",
                                                fontSize: 17
                                            }}
                                        >{l.label}</Text>
                                    </View>
                                </Pressable>
                                <View
                                    style={{
                                        borderBottomColor: "#00ADEF", opacity: 0.5, borderBottomWidth: 1, marginVertical: 4
                                    }}
                                ></View>
                            </View>
                        ))
                    }
                </View>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    {Config.APP_VERSION!='live' && <Text>{Config.APP_VERSION}</Text>}
                </View>
            </View>
        </View>
    }

    return (
        <ImageBackground
            source={require("../../assets/images/blurBG.png")}
            resizeMode="cover"
            imageStyle={{
                width: "100%",
                height: "100%"
            }}
            style={{
                flex: 1
            }}
        >

            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                keyboardShouldPersistTaps='handled'
            >
                <TopBar
                    style={{ backgroundColor: 'transparent' }}
                    title="Profile"
                //rightComponent={<><Text>v0.1.34</Text></>}
                />
                <View style={{
                    flex: 1,
                    marginHorizontal: moderateScale(20),
                    paddingBottom: verticalScale(40)
                }}>
                    {renderPersonalDetails()}
                </View>
            </ScrollView>
            <DeleteAccountConfirmModal
                showCountModal={showModal}
                hideModal={() => setshowModal(false)}
                onConfirm={(text) => {
                    store.dispatch(showLoadingModal())
                    instance.delete(`/user/deleteUser/${data.userData.id}`)
                        .then(r => {
                            store.dispatch(hideLoadingModal())
                            if (r) {
                                clearAll()
                            }
                            Toast.show({
                                type: 'success',
                                text1: 'Successfully deleted.'
                            })
                        }).catch(e => {
                            store.dispatch(hideLoadingModal())
                            Toast.show({
                                type: 'error',
                                text1: 'Failed to delete.'
                            })
                        })
                }}
            />
        </ImageBackground>
    )
}