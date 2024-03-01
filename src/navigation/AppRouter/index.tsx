import * as React from 'react'
import {
    Platform,
    View
} from 'react-native'

import { NavigationContainer } from '@react-navigation/native';
import { Message, OverlayProvider } from 'stream-chat-react-native';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';
import Loader from '../../components/Loader';
import RootNav from '../../navigation/rootStack';
import Text from '../../components/UI/AppText'
import ChatContext from '../../chatContext';
import { chatTheme } from '../../theme/chatTheme';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { moderateScale, verticalScale } from '../../utils/scalingUnits';
import { StreamChat } from 'stream-chat';
import axios from 'axios'
import { useSelector } from 'react-redux';
import Config from "react-native-config";
import messaging from '@react-native-firebase/messaging';
import { navigate, navigationRef } from '../navigationRef';
import instance from '../../axios';
import notifee, { AndroidImportance, AndroidVisibility, EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const chatClient = new StreamChat(Config.GETSTREAMS_API_KEY);

const appRouter = props => {

    // chat states
    const [channel, setThisChannel] = React.useState(undefined);
    const [clientSetupLoading, setClientsetupLoading] = React.useState(false)
    const [clientReady, setClientReady] = React.useState(false)

    const userReducer = useSelector(state => state.user)

    const { loggedIn, userData } = userReducer;

    React.useEffect(() => {
        let unsubscribeGetInitialNotification
        messaging().getToken().then(t => console.log("token " + t))
        //console.log("event sound " + userData?.eventSound)
        console.log("IS clientReady " + clientReady)
        if (!loggedIn || !userData.id || !clientReady) {
            return
        }

        //notifee.requestPermission().then(s=>{console.log(s)})
        messaging().requestPermission().then(s => { console.log(s) })

        //For Android
        notifee.createChannel({
            id: 'default', name: 'default', sound: "default",
            importance: AndroidImportance.HIGH,
        })

        notifee.createChannel({
            id: 'nosound', name: 'nosound', sound: "nosound",
            importance: AndroidImportance.HIGH,
        })

        notifee.createChannel({
            id: 'hide', name: 'hide', sound: "nosound",
            importance: AndroidImportance.NONE,
        })

        const unsubscribeOnMessage = messaging().onMessage(async (message) => {
            console.log("recived fcm Msg")
            console.log(message)
            if (message.data?.id) {
                if (message.notification?.android?.sound == "hide" || message.notification?.sound == "hide") {
                    return
                }
                let cId = await AsyncStorage.getItem("current_channel_id")
                if (navigationRef.getCurrentRoute()?.name == "ChatScreen" && cId == message.data.channel_id) {
                    return
                }
                const msg = await chatClient.getMessage(message.data.id);
                //console.log("Message")
                //console.log(msg)

                let csound = message.notification?.sound == "default" || message.notification?.android?.sound == "default"
                //checkSound(message)
                console.log("sound " + csound)
                // create the android channel to send the notification to
                const channelId = await notifee.createChannel(csound ? {
                    id: 'default', name: 'default', sound: "default",
                    importance: AndroidImportance.HIGH,
                } : {
                    id: 'nosound', name: 'nosound', sound: "nosound",
                    importance: AndroidImportance.HIGH,
                });

                // display the notification
                const { stream, ...rest } = message.data ?? {};
                const data = {
                    ...rest,
                    ...((stream as unknown as Record<string, string> | undefined) ?? {}), // extract and merge stream object if present
                };
                await notifee.displayNotification(csound ? {
                    title: 'New message from ' + msg.message.user.name,
                    body: msg.message.text,
                    data,
                    android: {
                        channelId,
                        importance: AndroidImportance.HIGH,
                        // visibility: AndroidVisibility.PUBLIC,
                        sound: "default",
                        showTimestamp: true,
                        timestamp: message.sentTime,
                    },
                    ios: {
                        sound: "default"
                    }
                } : {
                    title: 'New message from ' + msg.message.user.name,
                    body: msg.message.text,
                    data,
                    android: {
                        channelId,
                        importance: AndroidImportance.HIGH,
                        //visibility: AndroidVisibility.PUBLIC,
                        sound: "nosound",
                        showTimestamp: true,
                        timestamp: message.sentTime
                    },
                    ios: {
                        sound: "nosound.wav",
                    },

                });
                return
            }

            let sound = message.notification?.sound == "default" || message.notification?.android?.sound == "default"
            //checkSound(message)
            console.log("sound " + sound)

            if (sound) {
                const channelId = await notifee.createChannel({
                    id: 'default',
                    name: 'default',
                    importance: AndroidImportance.HIGH,
                    //visibility: AndroidVisibility.PUBLIC,
                    sound: "default"
                });
                await notifee.displayNotification({
                    title: message.notification?.title,
                    body: message.notification?.body,
                    data: message.data,
                    android: {
                        channelId,
                        importance: AndroidImportance.HIGH,
                        // visibility: AndroidVisibility.PUBLIC,
                        sound: "default",
                        showTimestamp: true,
                        timestamp: message.sentTime
                    },
                    ios: {
                        sound: "default"
                    }
                });

            } else {
                const channelId = await notifee.createChannel({
                    id: 'nosound',
                    name: 'nosound',
                    importance: AndroidImportance.HIGH,
                    //visibility: AndroidVisibility.PUBLIC,
                    sound: "nosound"
                });
                await notifee.displayNotification({
                    title: message.notification?.title,
                    body: message.notification?.body,
                    data: message.data,
                    android: {
                        channelId,
                        importance: AndroidImportance.HIGH,
                        //visibility: AndroidVisibility.PUBLIC,
                        sound: "nosound",
                        showTimestamp: true,
                        timestamp: message.sentTime
                    },
                    ios: {
                        sound: "nosound.wav",
                    }
                });
            }
        })

        const unsubscribeOnNotificationOpenedApp = messaging().onNotificationOpenedApp(message => {
            console.log("onNotificationOpenedApp")
            onPress(message)
        })
        unsubscribeGetInitialNotification = messaging().getInitialNotification()
            .then(message => {
                console.log("getInitialNotification IOS")
                onPress(message)
            })

        const unsubscribeOnForegroundEvent = notifee.onForegroundEvent(({ type, detail }) => {
            switch (type) {
                case EventType.DISMISSED:
                    console.log('User dismissed notification');
                    break;
                case EventType.PRESS:
                    onPress(detail.notification)
                    console.log('User pressed notification', detail.notification);
                    break;
            }
        });


        /* notifee.getInitialNotification().then(initialNotification => {
            if (initialNotification?.notification?.data?.id) {
                console.log("getInitialNotification Android")
                // Notification caused app to open from quit state on Android
                const channelId = initialNotification.notification.data?.channel_id;
                if (channelId) {
                    const newChannel = chatClient.channel('messaging', channelId);
                    setChannel(newChannel)
                }
            }
        });

        notifee.onBackgroundEvent(async ({ detail, type }) => {
            console.log("onBackgroundEvent")
            console.log(type + " " + EventType.ACTION_PRESS)
            if (type === EventType.ACTION_PRESS) {
                console.log("hd")
                onPress(detail.notification)
                await Promise.resolve();
            }
        }); */

        return async () => {
            unsubscribeOnMessage()
            unsubscribeOnNotificationOpenedApp()
            unsubscribeOnForegroundEvent()
            unsubscribeGetInitialNotification = undefined
        };
    }, [clientReady])


    React.useEffect(() => {
        //console.log("LoggedIn " + loggedIn)
        let unsubscribeTokenRefreshListener;
        if (!loggedIn) {
            return;
        }

        let USER_ID = userData.id + "_user"

        // Register FCM token with stream chat server.
        const registerPushToken = async () => {
            const token = await messaging().getToken();
            AsyncStorage.setItem("@user_id", USER_ID)

            //console.log(token)
            let push_provider = "firebase"

            /* console.log("addDevice")
            await chatClient.addDevice(token, 'firebase', USER_ID).then(r=>{
                console.log(r)
            }).catch(e=>console.log(e)) */

            unsubscribeTokenRefreshListener = messaging().onTokenRefresh(async newToken => {
                console.log("New Token " + newToken)
                //await chatClient.addDevice(newToken, 'firebase');
                await Promise.all([
                    removeOldToken(),
                    chatClient.addDevice(newToken, push_provider, USER_ID),
                    AsyncStorage.setItem('@current_push_token', newToken),
                ]);
            });
        };

        const init = async () => {
            const token = await messaging().getToken();
            await AsyncStorage.setItem('@current_push_token', token);
            const push_provider = 'firebase';

            try {
                chatClient.setLocalDevice({
                    id: token,
                    push_provider,
                })
            } catch (e) {
                console.log(e)
            }
            await setupChatClient();
            //if (clientReady) {
            await requestPermission();
            await registerPushToken();
            //}
        };

        init();

        return async () => {
            unsubscribeTokenRefreshListener?.();
        };
    }, [loggedIn]);

    const removeOldToken = async () => {
        const oldToken = await AsyncStorage.getItem('@current_push_token');
        let d = await chatClient.getDevices(`${userData?.id}_user`)
        d.devices?.map(async i => {
            if (i.id != oldToken) {
                await chatClient.removeDevice(i.id).then(r => console.log(r)).catch(e => console.log(e))
            }
        })
        if (oldToken !== null) {
            await chatClient.removeDevice(oldToken);
        }
    };

    // Request Push Notification permission from device.
    const requestPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    };

    const onPress = (remoteMessage) => {
        //console.log("clicked")
        //console.log(remoteMessage)
        navigationRef.navigate("Main")

        if (remoteMessage?.data?.id) {
            const channelId = remoteMessage?.data?.channel_id;
            console.log(channelId)
            if (clientReady) {
                (async () => {
                    const newChannel = chatClient.channel('messaging', channelId)
                    await newChannel?.watch()
                    let getChMembers = await newChannel.queryMembers({})
                    console.log("channel")
                    //console.log(a.members[0].user)
                    setChannel(newChannel);
                    let str = String(channelId).split(/-|_/)
                    console.log(str)
                    if (str[0] == "event") {
                        if (str[1] == "groupchat") {
                            navigationRef.navigate("EventTabs",
                                {
                                    screen: 'Chat',
                                    data: {
                                        id: str[2],
                                    }
                                }
                            )
                            navigationRef.navigate("ChatScreen", { name: "Event Group Chat" })
                        } else if (str[2] == "onetoone") {
                            navigationRef.navigate("EventTabs",
                                {
                                    screen: 'Chat',
                                    data: {
                                        id: str[1],
                                    }
                                }
                            )
                            let title = remoteMessage.title.split(" ")
                            if (title.length > 0) {
                                navigationRef.navigate("ChatScreen", { name: title[title.length - 1] })
                            }
                        }

                    } else if (str[0] == "task") {

                        instance.get('/activity/getEventId/' + str[2]).then(r => {
                            if (userData?.role == "USER") {

                                let name = ""
                                if (str.length > 3) {
                                    let vendor = getChMembers.members.find(i => i.user_id == String(str[4] + "_user"))
                                    name = "Group Chat " + vendor?.user?.name
                                } else {
                                    name = "Task Group Chat"
                                }

                                navigationRef.navigate("EventTabs",
                                    {
                                        screen: 'TasksParent',
                                        data: {
                                            id: r.data,
                                            notificationNav: true,
                                            notificationTaskId: str[2],
                                            channelName: name
                                        },
                                    }
                                )
                            } else {
                                instance.get('/event/' + r.data + '/getEventDetails')
                                    .then(res => {
                                        let obj = res.data.activities.find(t => t.id == str[2])
                                        obj.event = res.data
                                        obj.event.activities = undefined
                                        navigationRef.navigate("EventTabsForVendor",
                                            {
                                                screen: 'Chat',
                                                data: obj
                                            }
                                        )
                                        navigationRef.navigate("ChatScreen", {
                                            name: "Group Chat " + obj.name
                                        })
                                    }).catch(e => console.log(e))
                            }
                        }).catch(e => console.log(e))
                    }

                })()
            }
            return
        }

        if (remoteMessage?.data?.type == "eventInvitation") {
            console.log("eventInvitation")
            instance.get('/event/' + remoteMessage.data?.eventId + '/getEventDetails')
                .then(res => {
                    navigationRef.navigate("InviteeEventDetails",
                        { data: res.data }
                    )
                }).catch(e => console.log(e))
        } else if (remoteMessage?.data?.type == "taskAssignment") {
            console.log("taskAssignment")
            navigationRef.navigate("EventTabs",
                {
                    screen: 'TasksParent',
                    data: {
                        id: remoteMessage?.data.eventId,
                    }
                }
            )
        } else if (remoteMessage?.data?.type == "eventDateRemainder") {
            console.log("eventDateRemainder")
            navigationRef.navigate("EventTabs",
                {
                    data: {
                        id: remoteMessage?.data.eventId,
                    }
                }
            )
        } else if (remoteMessage?.data?.type == "eventCancel") {
            console.log("Event Cancelled")
        } else if (remoteMessage?.data?.type == "invitationResponse") {
            console.log("invitationResponse")
            navigationRef.navigate("EventTabs",
                {
                    data: {
                        id: remoteMessage?.data.eventId,
                    }
                }
            )
        } else if (remoteMessage?.data?.type == "pollingEnded") {
            console.log("pollingEnded")
            navigationRef.navigate("EventTabs",
                {
                    data: {
                        id: remoteMessage?.data.eventId,
                    }
                }
            )
        } else if (remoteMessage?.data?.type == "pollingRemainder") {
            console.log("pollingRemainder")
            navigationRef.navigate("EventTabs",
                {
                    data: {
                        id: remoteMessage?.data.eventId,
                    }
                }
            )
        } else if (remoteMessage?.data?.type == "vendorAssignment") {
            console.log("vendorAssignment")
            instance.get('/event/' + remoteMessage?.data?.eventId + '/getEventDetails')
                .then(res => {
                    let obj = res.data.activities.find(t => t.id == remoteMessage.data.activityId)
                    obj.event = res.data
                    obj.event.activities = undefined
                    navigationRef.navigate("EventTabsForVendor",
                        { data: obj }
                    )
                }).catch(e => console.log(e))
        }
    }

    const setupChatClient = async () => {
        console.log("setupChatClient")
        let chatBaseUrl = Config.CHAT_SERVER_URL || 'http://localhost:5000';
        let url = `${chatBaseUrl}/stream-chat/user-token`

        if (!userData || !loggedIn) {
            return
        }

        try {

            setClientsetupLoading(true)

            const axiosData = { userId: `${userData?.id}_user` }

            let userToken = await axios.post(url, axiosData, {}).then((res) => res?.data).catch((err) => console.log('error ', err))

            if (userToken && userToken?.token) {
                const user = {
                    id: `${userData?.id}_user`,
                    name: userData?.name,
                    phone: userData?.phone,
                    role: String(userData?.role).toLowerCase(),
                    event_notification: String(userData?.eventNotification),
                    event_sound: String(userData?.eventSound),
                    task_notification: String(userData?.taskNotification),
                    task_sound: String(userData?.taskSound),
                };

                console.log("connectUser")
                console.log(userToken)
                AsyncStorage.setItem('@stream_push_token', userToken?.token)
                await chatClient.connectUser(user, userToken?.token)
                    .then(r => {
                        console.log(r)
                    }).catch(e => {
                        console.log(e)
                    })

                setClientsetupLoading(false)
                setClientReady(true)
            } else {
                setClientsetupLoading(false)
                if (!loggedIn) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error connecting chat chatClient'
                    })
                }
            }
        }
        catch (error) {
            console.log('error in chat chatClient connect ', error)
            console.log('process.env.GETSTREAMS_API_KEY ', Config.GETSTREAMS_API_KEY)
            setClientsetupLoading(false)
            Toast.show({
                type: 'error',
                text1: 'Error connecting chat chatClient;' + error?.message
            })
        }
    }

    const disconnectClient = async () => {
        // console.log('chatClient disconnected ')
        setClientReady(false)
        await removeOldToken()
        chatClient?.disconnectUser()
    }

    const toastConfig = {
        success: ({ text1, text2, props }) => (
            <View
                style={{
                    borderLeftColor: '#42ba96',
                    borderLeftWidth: moderateScale(6),
                    borderRadius: verticalScale(7),
                    marginTop: verticalScale(20),
                    minHeight: verticalScale(60),
                    paddingHorizontal: verticalScale(15),
                    minWidth: '90%',
                    backgroundColor: '#fff',
                }}
            >
                <View
                    style={{
                        flex: 1,
                        borderRadius: verticalScale(7),
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            fontSize: moderateScale(14),
                        }}
                    >{text1}</Text>
                </View>
            </View>
        ),
        error: ({ text1, text2, props }) => (
            <View
                style={{
                    borderLeftColor: '#FF3333',
                    borderLeftWidth: moderateScale(6),
                    borderRadius: verticalScale(7),
                    marginTop: verticalScale(20),
                    minHeight: verticalScale(60),
                    paddingHorizontal: verticalScale(15),
                    width: '90%',
                    backgroundColor: '#fff',
                }}
            >
                <View
                    style={{
                        flex: 1,
                        borderRadius: verticalScale(7),
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            fontSize: moderateScale(14),
                        }}
                    >{text1}</Text>
                </View>
            </View>
        ),
    };

    const setChannel = (c) => {
        AsyncStorage.setItem("current_channel_id", c.id)
        console.log(c.id)
        setThisChannel(c)
    }


    return <NavigationContainer
        ref={navigationRef}
    >
        <ChatContext.Provider
            value={{
                chatClient,
                setupChatClient,
                disconnectClient,
                clientSetupLoading,
                clientReady,
                setChannel,
                channel
            }}
        >
            <OverlayProvider
                value={{ style: chatTheme }}
            >
                <RootNav />
                <Loader />
                <SuccessModal />
                <ErrorModal />
                <Toast
                    config={toastConfig}
                />
            </OverlayProvider>
        </ChatContext.Provider>
    </NavigationContainer>
}

export default appRouter
