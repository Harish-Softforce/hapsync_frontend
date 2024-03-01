import * as React from 'react';

import {
    FlatList,
    View,
    ImageBackground,
    Dimensions,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';


import TopBar from '../../../components/TopBar'
import Text from '../../../components/UI/AppText'

import ChatContext from '../../../chatContext'

import Toast from 'react-native-toast-message'
import { Chat } from 'stream-chat-react-native';
import { connect } from 'react-redux'

import { moderateScale, verticalScale } from '../../../utils/scalingUnits';
import GroupChatItem from '../../../components/Chat/GroupListItem';
import TaskGroupAssigneesItem from '../../../components/Chat/TaskGroupAssigneesItem';
import TaskChatVendorItem from '../../../components/Chat/TaskChatVendorItem';

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class Event_vendorChatList extends React.Component {
    state = {
        users: undefined,
        refreshing: false,
        loading: false
    }

    /* async componentDidMount() {
        const { chatClient, clientReady } = this.props

        this.initializeChats();

        if (clientReady) {
            this.clientListener = chatClient.on(event => {

                if (
                    event.type == "message.read" ||
                    event.type == "user.watching.start" ||
                    event.type == "user.watching.stop"
                ) {
                    this.updateChannelPerEvent()
                }
            });
        }
    } */

    /* componentWillUnmount() {
        this.clientListener?.unsubscribe();
    } */

    /* initializeChats = async () => {
        const { chatClient,
            setupChatClient,
            clientReady,
            disconnectClient,
            userData
        } = this.props

        //console.log(this.props.currentTask)

        try {
            this.setState({ loading: true });

            let vendors = this.props?.currentTask.vendors;
            console.log(vendors)
            let owner = this.props?.route?.params?.data?.owner;

            //
            let allowedChatIds = []
            if (vendors.length > 0) {
                allowedChatIds = vendors?.map((_vendor) => `${_vendor?.userId}_user`)
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'No Vendors to chat'
                })
                return
            }


            let userFilter = { id: {} }
            if (allowedChatIds?.length > 0) {
                userFilter = { id: { $in: allowedChatIds } }
            }

            const users = await chatClient.queryUsers(userFilter);

            console.log(users)

            this.setState({
                users: users?.users, loading: false
            })
        }
        catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error while loading chats'
            })
            console.log('chat load err ', error)
            this.setState({ loading: false })

            // for every chat error , logout user and relogin
            await disconnectClient()
            await setupChatClient()
        }
    } */

    /* updateChannelPerEvent = async () => {
        const { chatClient,
            userData
        } = this.props

        // users
        let allowedChatIds = [];
        let vendors = this.props?.currentTask.vendors;

        if (vendors) {
            allowedChatIds = vendors?.map((_vendor) => `${_vendor?.userId}_user`)
        }

        let userFilter = { id: {} }
        if (allowedChatIds?.length > 0) {
            userFilter = { id: { $in: allowedChatIds } }
        }

        const users = await chatClient.queryUsers(userFilter);

        this.setState({ users: users?.users })
    } */

    refreshScreen = () => {
        this.setState({ refreshing: true }, () => {
            setTimeout(() => {
                this.setState({ refreshing: false })
            }, 600)
        })
        //this.initializeChats();
    }

    formatUserList = (_users) => {
        let owner = this.props?.route?.params?.data?.owner;

        const {
            userData
        } = this.props

        let users = _users || [];
        users = _users?.map((user) => {
            if (user?.id == `${owner}_user`) {
                return {
                    ...user,
                    label: 'OWNER'
                }
            }
            else {
                return user
            }
        })

        return users
    }

    renderGroupChatHeading = () => {
        const taskData = this.props?.currentTask;

        return <View>
            <TaskGroupAssigneesItem
                taskData={taskData}
            />
        </View>
    }

    renderVendorList = () => {
        const {
            refreshing
        } = this.state;

        const { chatClient,
            setupChatClient,
            clientReady,
            disconnectClient,
            setChannel
        } = this.props
        const taskData = this.props?.currentTask;
        let vendors = taskData?.vendors.filter(t => (t.status == "EVALUATING" || t.status == "HIRED") && (t.userId))

        let users = this.state.users || [];
        //users = this.formatUserList(users)

        const channelPrefix = 'task' + this.props.currentTask?.id

        return <FlatList
            data={vendors}
            ListHeaderComponent={this.renderGroupChatHeading}
            renderItem={({ item }) => {
                //if (this.props.currentEvent.owner == this.props.userData.id) {
                    return <>
                    <View style={{height:10}}></View>
                    <TaskChatVendorItem
                        taskData={taskData}
                        vendor={item}
                        chatName={item?.name}
                    />
                    </>
               /*  } else {
                    return <></>
                } */
            }}
            keyExtractor={(item, index) => {
                return item?.id
            }}
            contentContainerStyle={{
                paddingHorizontal: moderateScale(20),
                flexGrow: 1
            }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={this.refreshScreen}
                />
            }
        />

    }

    render() {
        const { clientSetupLoading } = this.props
        return <ImageBackground
            source={require("../../../assets/images/blurBG.png")}
            resizeMode="cover"
            imageStyle={{
                width: deviceWidth,
                height: deviceHeight
            }}
            style={{
                flex: 1
            }}
        >
            <TopBar
                style={{ backgroundColor: 'transparent' }}
                title="Vendors chat"
            />
            {clientSetupLoading && <ActivityIndicator
                size="small"
            />}
            <View style={{height:10}}></View>
            {this.renderVendorList()}
        </ImageBackground>
    }
}

const TasksVendorChatlist = props => {

    const {
        chatClient,
        clientReady,
        disconnectClient,
        setupChatClient,
        clientSetupLoading,
        setChannel,
    } = React.useContext(ChatContext);

    return <Event_vendorChatList
        chatClient={chatClient}
        clientReady={clientReady}
        setupChatClient={setupChatClient}
        disconnectClient={disconnectClient}
        clientSetupLoading={clientSetupLoading}
        setChannel={setChannel}
        {...props}
    />
}

const mapStateToProps = state => {
    const { userData } = state.user
    const { currentTask, currentEvent } = state.events
    return {
        userData,
        currentTask,
        currentEvent
    }
}

export default connect(mapStateToProps)(TasksVendorChatlist);