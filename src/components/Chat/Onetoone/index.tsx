import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import {
    View,
    Pressable,
    Image,
    StyleSheet,
    Platform
} from 'react-native'

import { useSelector } from 'react-redux';
import { moderateScale, verticalScale } from '../../../utils/scalingUnits';

import Text from '../../UI/AppText'

import moment from 'moment'

import ChatContext from '../../../chatContext';

const Onetoone = props => {
    const {
        item,
        channelId
    } = props;

    const {
        chatClient,
        setupChatClient,
        clientReady,
        disconnectClient,
        setChannel
    } = React.useContext(ChatContext)

    const navigation = useNavigation();
    const userData = useSelector(state => state.user.userData);

    const channel_id = React.useRef(undefined)
    const [channelInEntry, setChannelInEntry] = React.useState(undefined);
    const channelMessages = channelInEntry?.state?.messages || [];
    //console.log(channelInEntry?.state?.messages.length)


    const [isTyping, setIsTyping] = React.useState(false);
    const [typingUser, setTypingUser] = React.useState("");

    const [unmounted, setUnmounted] = React.useState(false)
    const [UnreadCount, setUnreadCount] = React.useState(0)

    let channelListener = null

    React.useEffect(() => {
        setUnmounted(false);
        const startup = async () => {
            if (!clientReady) {
                await setupChatClient()
            }

            let membersArray = [`${item.user1Id}_user`, item?.user2Id + "_user"]

            const channel = chatClient.channel("messaging", channelId,
                {
                    typename: "event",
                    members: [...membersArray],
                });
            await channel.watch();
            setChannelInEntry(channel)
            channelListener = channel.on(channelEventHandler);
        };
        startup();

        return () => {
            channelListener?.unsubscribe();
            setUnmounted(true)
        }
    }, []);


    const channelEventHandler = event => {
        if (unmounted) {
            return
        }
        if (event.type == 'typing.start' && !isTyping) {
            setIsTyping(true)
            setTypingUser(event?.user?.name)
        }
        if (event.type == 'typing.stop') {
            setIsTyping(false)
            setTypingUser('')
        }
        if (event.type == "message.new" || event.type == "message.read") {
            setUnreadCount(event.total_unread_count)
        }
        //console.log(event.type)
    }

    const handleChatStart = () => {
        if (!channelInEntry) {
            return;
        }

        setChannel(channelInEntry);

        navigation.navigate("ChatScreen", {
            name: item.guestName
        })
    }

    const dateIsToday = (date) => {
        return moment.unix(date).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")
    }

    const getUnreadNumber = (_channel) => {
        if (!_channel) {
            return -1
        }
        const unread = _channel.countUnread();
        return unread
    }

    const renderUnreadNo = () => {
        const unread = getUnreadNumber(channelInEntry);

        return unread > 0 ? <View style={{
            height: verticalScale(16),
            width: verticalScale(16),
            backgroundColor: 'rgba(0, 173, 239, 1)',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: verticalScale(7),
            borderRadius: verticalScale(10),
            marginLeft: 7
        }}>
            <Text
                style={{
                    color: '#fff',
                    fontSize: verticalScale(11)
                }}
            >
                {unread}
            </Text>
        </View>
            : undefined

    }

    const renderImage = () => {
        return <><View style={{
            backgroundColor: '#dfe5e7',
            alignItems: "center", justifyContent: 'center',
            width: moderateScale(60), height: moderateScale(60), borderRadius: moderateScale(100), borderWidth: 0.4
        }}>
            <Image
                style={{
                    width: moderateScale(60), height: moderateScale(60), borderRadius: moderateScale(100),
                    borderWidth: 0.4
                }}

                source={item.guestImage
                    ? { uri: item.guestImage }
                    : require("../../../assets/images/logo.jpg")}
            />
            <View style={{ position: 'absolute', top: -4, right: -4 }}>
                {renderUnreadNo()}
            </View>

        </View>

        </>

    }

    const renderLastMessage = () => {
        let message = channelMessages?.length > 0 && channelMessages[channelMessages.length - 1]?.text;
        if (message?.length > 40) {
            message = message?.substring(0, 40) + '...'
        }

        if (isTyping) {
            return <Text style={{
                color: '#818E9B',
                fontSize: verticalScale(13),
                marginTop: verticalScale(5),
                fontStyle: 'italic'
            }}>
                {typingUser} is typing...
            </Text>
        }

        return <Text style={{
            color: '#818E9B',
            fontSize: verticalScale(13),
            marginTop: verticalScale(5),
        }}>
            {message}
        </Text>
    }


    const getLastMessageTime = () => {
        const lastMessage = channelMessages?.length > 0 ? channelMessages[channelMessages.length - 1] : undefined;

        if (lastMessage) {
            let lastMessageTime = lastMessage?.created_at && dateIsToday(lastMessage?.created_at) ?
                moment(lastMessage?.created_at).format("HH:mm") :
                moment(lastMessage?.created_at).format("HH:mm")

            return lastMessageTime
        }
    }

    return <Pressable
        onPress={handleChatStart}
        style={{
            flexDirection: 'row',
            //height: moderateScale(65),
            alignItems: 'center',
            //borderBottomWidth: 0.5,
            backgroundColor: 'white',
            marginTop: moderateScale(5),
            borderColor: '#355D9B',
            padding: 15,
            borderRadius: 6,
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

        {renderImage()}
        <View
            style={{
                flex: 1,
                paddingLeft: moderateScale(10),
                flexDirection: 'row',
                alignItems: 'center'
            }}
        >
            <View>
                <Text
                    style={[{
                        color: '#355D9B',
                        fontSize: verticalScale(13),
                        fontWeight: '500',
                    }]}
                >
                    {item.guestName} {/* #{eventData?.id} */}
                </Text>
                {renderLastMessage()}
            </View>
        </View>
        <Text style={{
            color: '#818E9B',
            fontWeight: getUnreadNumber() > 0 ? '500' : '400',
            fontSize: verticalScale(10),
            alignSelf: 'flex-start'
        }}>
            {getLastMessageTime()
            }
        </Text>
        {//renderLabel()
        }
    </Pressable>
}


export default Onetoone