import * as React from 'react'
import {
    View,
    ImageBackground,
    ScrollView, StyleSheet,
    Dimensions,
    Pressable,
    Switch,
    TextInput,
    Platform,
    ActivityIndicator,
    SafeAreaView
} from 'react-native'

import Text from '../../components/UI/AppText'
import TopBar from '../../components/TopBar'
import { moderateScale, verticalScale } from '../../utils/scalingUnits'
import CustomInput from '../../components/Chat/CustomInput'

import * as SvgIcons from '../../assets/svg-icons'

import Feather from 'react-native-vector-icons/Feather'

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Chat, Channel, KeyboardCompatibleView, MessageList, MessageInput, useChatContext, ChannelList, Message,
    messageActions as defaultMessageActions
} from 'stream-chat-react-native';

import ChatContext from '../../chatContext'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import instance from '../../axios'
import Toast from 'react-native-toast-message'
import { store } from '../../store'

class ChatScreenChild extends React.Component {
    state = {

    }

    renderHeaderRightComp = () => {
        return <Pressable
            style={{
                marginRight: -moderateScale(4)
            }}
        >
            <Feather
                name="plus"
                style={{
                    color: '#355D9B',
                    fontSize: verticalScale(28)
                }}
            />
        </Pressable>
    }

    renderInput = () => {
        return <View style={{
            height: verticalScale(50),
            borderRadius: verticalScale(44),
            borderWidth: verticalScale(1.5),
            borderColor: '#355D9B',
            marginBottom: verticalScale(20),
            paddingHorizontal: verticalScale(12),
            alignItems: 'center',
            flexDirection: 'row'
        }}>
            <TextInput
                placeholder="Type a message..."
                style={{
                    fontFamily: 'Mulish-Regular',
                    fontSize: verticalScale(15),
                    flex: 1
                }}
            />
            <View style={{
                transform: [{ scale: moderateScale(1) }]
            }}>
                <SvgIcons.SendIcon
                    fill="grey"
                />
            </View>
        </View>
    }

    renderMain = () => {
        const { chatClient,
            clientReady
        } = this.props

        const channel = this.props.channel

        if (!channel || !clientReady) {
            return <View style={{ flex: 1 }}>
                <View
                    style={{ flex: 1 }}
                >
                    <ActivityIndicator />
                </View>
                {this.renderInput()}
            </View>
        }

        return <Chat client={chatClient} >
            <Channel channel={channel}
                //KeyboardCompatibleView={CustomKeyboardCompatibleView}
                messageActions={param => {
                    const { deleteMessage, editMessage, copyMessage, dismissOverlay,
                        quotedReply, messageReactions, isMyMessage, message } = param;
                    //const actions = defaultMessageActions({ ...param });
                    let myactions = [
                        quotedReply,
                        editMessage,
                        copyMessage,
                        deleteMessage,
                        messageReactions
                    ]
                    let othersactions = [
                        quotedReply,
                        copyMessage,
                        messageReactions,
                    ]
                    othersactions.push({
                        action: async () => {
                            dismissOverlay();
                            console.log(message)
                            if (message.user?.id) {
                                let obj = {
                                    "album_id": null,
                                    "chat_msg_id": message.id,
                                    "content": message.text,
                                    "event_id": null,
                                    "reporter_id": store.getState().user.userData.id,
                                    "user_id": null,
                                    "attachments": message.attachments
                                }
                                instance.post("/sms/sendReportMail", obj)
                                    .then(r => {
                                        //console.log(r.data)
                                        Toast.show({
                                            type: 'success',
                                            text1: r.data
                                        })
                                    }).catch(e => {
                                        console.log("Report api error " + e)
                                        Toast.show({
                                            type: 'success',
                                            text1: "Failed to report"
                                        })
                                    })
                            }
                        },
                        actionType: 'reportUser',
                        icon: <MaterialIcons name="report" style={{ fontSize: verticalScale(22), color: 'grey' }} />,
                        title: "Report",
                    })
                    let finalactions = isMyMessage ? myactions : othersactions

                    return finalactions
                }}
            >
                <View style={{ flex: 1 }}>
                    <MessageList
                    />
                    <MessageInput
                        Input={CustomInput}
                    />
                </View>
            </Channel>
        </Chat>
    }

    render() {

        let name = "chat"

        if (this.props?.route?.params?.name) {
            name = this.props?.route?.params?.name
        }

        //console.log(name)

        return <SafeAreaView
            style={{
                flex: 1
            }}
        >
            <ImageBackground
                source={require("../../assets/images/blurBG.png")}
                resizeMode="cover"
                imageStyle={{
                    width: "100%",
                    height: "100%"
                }}
                style={{
                    flex: 1,
                }}
            >
                <TopBar
                    style={{ backgroundColor: 'transparent' }}
                    title={name}//"Let's Chat"
                //rightComponent={this.renderHeaderRightComp()}
                />
                <View style={{
                    marginHorizontal: moderateScale(11),
                    flex: 1
                }}>
                    {this.renderMain()}
                </View>
            </ImageBackground >
        </SafeAreaView>
    }
}

const CustomKeyboardCompatibleView = ({ children }) => {
    const insets = useSafeAreaInsets();

    if (Platform.OS === 'android') {
        return children;
    }

    const iosVerticalOffset = insets.bottom > 0 ? verticalScale(135) : 0;

    return (
        <KeyboardCompatibleView
            keyboardVerticalOffset={iosVerticalOffset}>
            {children}
        </KeyboardCompatibleView>
    );
};

const ChatScreen = props => {
    const { chatClient, channel, clientReady } = React.useContext(ChatContext);
    React.useEffect(() => {
        channel?.watch()
    }, [])

    return <ChatScreenChild
        chatClient={chatClient}
        channel={channel}
        clientReady={clientReady}
        {...props} />
}



const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
    heading: {
        fontSize: moderateScale(22),
        marginVertical: verticalScale(20),
        marginHorizontal: moderateScale(11),
        color: '#355D9B',
        fontFamily: 'Mulish-ExtraBold'
    }
})


export default ChatScreen