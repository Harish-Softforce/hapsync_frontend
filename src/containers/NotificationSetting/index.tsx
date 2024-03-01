import { View, Text, ImageBackground, ScrollView, Switch, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import TopBar from '../../components/TopBar'
import { moderateScale, verticalScale } from '../../utils/scalingUnits'
import { useSelector } from 'react-redux'
import { updateUser } from '../../store/actionCreators'
import ChatContext from '../../chatContext'

export default function NotificationSetting() {

    const data = useSelector((state) => state.user)
    let chatClient= React.useContext(ChatContext)

    const [event, setEvent] = useState({
        label: 'Event',
        Notification: data.userData.eventNotification,
        Sound: data.userData.eventSound,
    })

    const [task, setTask] = useState({
        label: 'Task',
        Notification: data.userData.taskNotification,
        Sound: data.userData.taskSound,
    })

    useEffect(() => {

        setEvent({
            label: 'Event',
            Notification: data.userData.eventNotification,
            Sound: data.userData.eventSound,
        })
        setTask({
            label: 'Task',
            Notification: data.userData.taskNotification,
            Sound: data.userData.taskSound,
        })

    }, [data])

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
            <ScrollView contentContainerStyle={{
                flexGrow: 1,
            }}>
                <TopBar
                    style={{ backgroundColor: 'transparent' }}
                    title="Notifications"
                />
                <View style={{
                    flex: 1,
                    margin: moderateScale(20),
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        minHeight: verticalScale(250),
                        borderRadius: verticalScale(15),
                        padding: moderateScale(25),
                        justifyContent: 'space-around'
                    }}>
                        {[event,task].map((i, j) =>
                            <View key={j}>
                                <View style={{ paddingVertical: 10 }}>
                                    <Text style={{
                                        color: '#355D9B',
                                        fontFamily: 'Mulish-Bold',
                                        flex: 1,
                                        fontSize: 18
                                    }}>
                                        {i.label}
                                    </Text>
                                </View>
                                <View style={styles.line}></View>

                                <View style={styles.subView} >
                                    <Text style={styles.subText}> Show Notifications </Text>
                                    <Switch
                                        value={i.Notification}
                                        onValueChange={(val) => {
                                            if(i.label=="Event"){
                                                let obj={...data.userData,
                                                    userName:data.userData.name,
                                                    eventNotification:val
                                                }
                                                updateUser(obj,{},false,chatClient)
                                            }else{
                                                let obj={...data.userData,
                                                    userName:data.userData.name,
                                                    taskNotification:val
                                                }
                                                updateUser(obj,{},false,chatClient)
                                            }
                                        }}
                                    />
                                </View>
                                <View style={styles.line}></View>

                                <View style={styles.subView} >
                                    <Text style={styles.subText}> Sound </Text>
                                    <Switch
                                        value={i.Sound}
                                        onValueChange={(val) => {
                                            if(i.label=="Event"){
                                                let obj={...data.userData,
                                                    userName:data.userData.name,
                                                    eventSound:val
                                                }
                                                updateUser(obj,{},false,chatClient)
                                            }else{
                                                let obj={...data.userData,
                                                    userName:data.userData.name,
                                                    taskSound:val
                                                }
                                                updateUser(obj,{},false,chatClient)
                                            }
                                        }}
                                    />
                                </View>
                                <View style={styles.line}></View>

                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 20,
        margin: 10,
    },
    subView: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 7,
        marginLeft: moderateScale(20)
    },
    subText: {
        color: '#355D9B',
        fontFamily: 'Mulish',
        flex: 1,
        fontSize: 15
    },
    line:{
        borderBottomColor: "#00ADEF", 
        opacity: 0.5, 
        borderBottomWidth: 1, 
        marginVertical: 4
    }
})