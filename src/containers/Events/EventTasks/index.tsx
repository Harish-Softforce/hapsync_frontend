import * as React from 'react'
import {
    View,
    ImageBackground,
    ScrollView, StyleSheet,
    Dimensions,
    Pressable,
    Switch,
    Modal
} from 'react-native'

import Text from '../../../components/UI/AppText'
import TopBar from '../../../components/TopBar'
import AppButton from '../../../components/UI/button'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'


import { moderateScale, verticalScale } from '../../../utils/scalingUnits'

import * as SvgIcons from '../../../assets/svg-icons'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import TaskEntry from '../../../components/Task/TaskEntry'

import {
    TabView,
    TabBar,
    TabBarItem,
    SceneMap
} from 'react-native-tab-view';
import { Button, Tooltip } from 'react-native-elements'
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger, renderers } from 'react-native-popup-menu'
import { connect } from 'react-redux'
import { activityStatusUpdate, addTemplateActivity, getAllActivityTypes } from '../../../store/actionCreators'
import axios from '../../../axios'
import DefaultTemplate from './defaultTemplate'

const { Popover } = renderers

let filters = [
    {
        title: 'Pending',
        value: 'PENDING'
    }, {
        title: 'InProgress',
        value: 'INPROGRESS'
    }, {
        title: 'Completed',
        value: 'COMPLETED'
    },
]

let dummyTasks = [{
    "byDefault": true, "cost": 10,
    status: 'pending',
    "description": "Send Invitations", "id": 1, "name": "Dummy JSON task 1", "timeline": 14, "vendorRequired": false
},
{
    "byDefault": true, "cost": 10,
    status: 'pending',
    "description": "Send Invitations", "id": 2, "name": "Dummy pending task 1", "timeline": 14, "vendorRequired": false
},
{
    "byDefault": true, "cost": 10,
    status: 'progress',
    "description": "Send Invitations", "id": 2, "name": "Dummy task in progress", "timeline": 14, "vendorRequired": false
},
{
    "byDefault": false, "cost": 10,
    status: 'completed',
    "description": "Purchase Items", "id": 3, "name": "Dummy JSON task 2", "timeline": 14, "vendorRequired": true
}]

class EventTasks extends React.Component {
    state = {
        currentFilter: 'all',
        currentTempFilter: undefined,
        filterVisible: false,
        //
        showTemplates: false,
        selectedTemplates: [],
        routes: [
            // { key: 'all', title: 'All' },
            { key: 'pending', title: 'Pending' },
            { key: 'inProgress', title: 'InProgress' },
            { key: 'completed', title: 'Completed' },
        ],
        tabIndex: 0,
        currentTaskId: null,
        defaultTasks: [],
    }

    componentDidMount() {
        this.initializeTaskTabrouteCounts()
        getAllActivityTypes().then(() => {
            let eventTypeId = this.props.currentEvent.eventTypeId
            //console.log(eventTypeId)
            if (eventTypeId && this.props.currentEvent.eventTypeName != "CUSTOM") {
                axios.get('/suggestions/events/' + eventTypeId + '/activities').then(res => {
                    console.log(res.data)
                    this.setState({
                        defaultTasks: res.data
                    })
                }).catch(e => console.log(e))
            }
        }).catch(e => {
            console.log(e)
        })
        if (this.props.route.params.data?.notificationNav) {
            this.props.navigation.navigate("TaskTabs", {
                screen: 'TasksVendorChatlist',
                data: {
                    id: this.props.route.params.data?.notificationTaskId
                },
            })
            this.props.navigation.navigate("ChatScreen", { name: this.props.route.params.data?.channelName })
        }

    }

    initializeTaskTabrouteCounts = () => {
        //const data = this.props.route?.params?.data
        const { currentEvent } = this.props
        let tasks = currentEvent?.activities ? currentEvent?.activities : [];

        if (currentEvent.owner != this.props.userData.id) {
            tasks = currentEvent.activities.filter(t => t.assignees.find(i => i.userId == this.props.userData.id))
        }
        //tasks = [...tasks, ...dummyTasks]

        let pendingCount = 0;
        let inProgressCount = 0;
        let completedCount = 0;
        let allCount = 0;

        allCount = tasks?.length
        pendingCount = tasks?.filter((task) => task?.status == "PENDING").length
        inProgressCount = tasks?.filter((task) => task?.status == "INPROGRESS").length
        completedCount = tasks?.filter((task) => task?.status == "COMPLETED").length

        let newTabRoutes = [...this.state.routes]
        newTabRoutes =

            newTabRoutes.map((route) => {


                if (route.key == "pending") {
                    return {
                        ...route,
                        title: `Pending (${pendingCount})`,

                    }
                }
                if (route.key == "inProgress") {
                    return {
                        ...route,
                        title: `InProgress (${inProgressCount})`
                    }
                }
                if (route.key == "completed") {
                    return {
                        ...route,
                        title: `Completed (${completedCount})`
                    }
                }
                return { ...route }


            })

        this.setState({ routes: newTabRoutes })

    }






    componentDidUpdate(prevProps) {
        if (this.props.currentEvent != prevProps.currentEvent) {
            this.initializeTaskTabrouteCounts()
        }
    }

    renderRightHeaderComp = () => {
        return <Menu renderer={Popover} rendererProps={{ placement: 'bottom' }}>
            <MenuTrigger>
                <SvgIcons.PlusIcon
                    style={{
                        transform: [{ scale: moderateScale(0.8) }]
                    }}
                />
            </MenuTrigger>
            <MenuOptions>
                <MenuOption
                    style={{ alignItems: 'center', padding: 20, paddingBottom: 15 }}
                    onSelect={() => {
                        this.props.navigation.navigate("AddTask")
                    }}>
                    <Text style={{ fontFamily: 'Mulish-Bold', color: '#355D9B', fontWeight: '800' }} >Create task</Text>
                </MenuOption>
                {this.props.currentEvent.eventTypeName != "CUSTOM" && <MenuOption
                    style={{ alignItems: 'center', padding: 20, paddingTop: 15 }}
                    onSelect={() => {
                        this.setState({ showTemplates: true })
                    }} >
                    <Text style={{ fontFamily: 'Mulish-Bold', color: '#355D9B', fontWeight: '800' }}>Choose from template</Text>
                </MenuOption>}
            </MenuOptions>
        </Menu>
    }

    renderTabBar = props => {
        return <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: '#355D9B',
                height: verticalScale(2),
                marginVertical: 0,
                //marginTop:25
                //width: 110
            }}

            style={{ backgroundColor: 'transparent', }}
            labelStyle={{
                color: '#355D9B',
                //width: '100%',
                fontSize: moderateScale(13),
                fontFamily: "Mulish-Bold",
                // fontWeight:"400",
                //flex: 1,
                justifyContent:"center",
                textAlign:'center',
                textTransform: 'none'
            }}

           /*  //tabStyle={{ elevation: 0, width: moderateScale(120) }}
            contentContainerStyle={{
                justifyContent: "center",
                alignContent:'center',
                //backgroundColor:'red',
                height:moderateScale(50)
            }} */


        />
    }

    filterTaskData = (data: Array, _filter) => {
        let filteredData = data
        let currentFilter = _filter

        if (currentFilter == 'pending') {
            return data.filter((each) => each?.status == "PENDING")
        }
        if (currentFilter == 'completed') {
            return data.filter((each) => each?.status == "COMPLETED")
        }
        if (currentFilter == 'inProgress') {
            return data.filter((each) => each?.status == "INPROGRESS")
        }

        return filteredData
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    handleStatus = (status, id) => {
        if (this.props.currentEvent.taskAccess) {
            this.setState({ filterVisible: true, currentTempFilter: status, currentTaskId: id })
        }
    }

    renderTabScene = ({ route, jumpTo }) => {
        const { currentEvent } = this.props
        let tasks = currentEvent?.activities ? currentEvent?.activities : [];

        if (currentEvent.owner != this.props.userData.id) {
            tasks = currentEvent.activities.filter(t => t.assignees.find(i => i.userId == this.props.userData.id))
        }

        let filteredTasks = this.filterTaskData(tasks, route.key)

        return <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Text style={[{
                fontFamily: 'Mulish-Bold',
                fontSize: moderateScale(16),
                color: '#355D9B',
                marginVertical: verticalScale(10)
            }]}>
                {this.capitalizeFirstLetter(route.title)}
            </Text>
            {filteredTasks?.map((each, index) => {
                return <TaskEntry
                    key={index}
                    data={each}
                    eventId={this.props.currentEvent.id}
                    handleStatus={this.handleStatus}
                    editAccess={currentEvent.eventEditAccess}

                />
            })}
            <View style={{ flex: 1, height: 90 }}></View>
        </ScrollView>
    }

    /** old code , not used  */
    renderFilterModal = () => {
        return <Modal visible={this.state.filterVisible} animationType="slide"
            transparent={true}
        >
            <Pressable
                onPress={() => this.setState({ filterVisible: false, currentTempFilter: undefined })}
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    justifyContent: 'flex-end',
                }}>
                <Pressable style={{
                    marginHorizontal: moderateScale(11),
                    backgroundColor: '#fff',
                    minHeight: verticalScale(100),
                    paddingVertical: verticalScale(11),
                    borderRadius: verticalScale(10)
                }}>
                    {filters.map((each) => {
                        let match = this.state.currentFilter == each.value;
                        if (this.state.currentTempFilter) {
                            match = this.state.currentTempFilter == each.value
                        }

                        return <Pressable
                            onPress={() => this.setState({ currentTempFilter: each.value })}
                            key={each.value}
                            style={{
                                height: verticalScale(40),
                                justifyContent: 'center',
                                backgroundColor: match ? '#F8F7FA' : '#fff',
                                elevation: match ? 1 : 0,
                                paddingHorizontal: moderateScale(13)
                            }}>
                            <Text
                                style={[{
                                    fontSize: verticalScale(18),
                                    color: match ? '#355D9B' : '#88879C',
                                    fontFamily: match ? 'Mulish-Bold' : 'Mulish-Regular'
                                }]}
                            >
                                {each.title}
                            </Text>
                        </Pressable>
                    })}
                    <View style={{
                        flexDirection: 'row',
                        marginTop: moderateScale(12),
                        marginHorizontal: moderateScale(11)
                    }}>
                        <AppButton
                            clicked={() => this.setState({ filterVisible: false, currentTempFilter: undefined })}
                            title="Cancel"
                            style={[styles.button, {
                                backgroundColor: '#00ADEF',
                                marginRight: verticalScale(7)
                            }]}
                        />
                        <AppButton
                            clicked={() => {
                                let obj = {
                                    activityStatus: this.state.currentTempFilter,
                                    id: this.state.currentTaskId
                                }
                                //console.log(obj)
                                activityStatusUpdate(obj, this.props.currentEvent.id)
                                this.setState({
                                    currentFilter: this.state.currentTempFilter,
                                    filterVisible: false
                                })
                            }}
                            title="OK"
                            style={[styles.button]}
                        />
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    }

    handleChecked = (activityTypeId) => {
        const { currentEvent, userData } = this.props

        let list = this.state.selectedTemplates

        if (list.find(each => each.activityTypeId == activityTypeId)) {
            list = list.filter(obj => {
                return obj.activityTypeId != activityTypeId;
            });
        } else {
            list.push(
                {
                    activityTypeId: activityTypeId,
                    eventId: currentEvent.id,
                    owner: userData.id,
                }
            )
        }
        //console.log(list)
        this.setState({ selectedTemplates: list })
    }

    renderTemplateModal = () => {
        return <Modal visible={this.state.showTemplates} animationType="slide"
            transparent={true}
        >
            <Pressable
                onPress={() => this.setState({ showTemplates: false, selectedTemplates: [] })}
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    justifyContent: 'flex-end',
                }}>
                <Pressable
                    style={{
                        marginHorizontal: moderateScale(11),
                        backgroundColor: '#fff',
                        height: "90%",
                        padding: verticalScale(15),
                        borderRadius: verticalScale(10),
                        marginBottom: 10,
                        //flex:1
                    }}>
                    {/* {this.state.defaultTasks.map((each,i) => {
                        return <Pressable
                            onPress={() => {}}
                            key={i}
                            >
                            <Text>{each.activityTypeName}</Text>
                        </Pressable>
                    })} */}
                    <ScrollView style={{}}>
                    {this.state.defaultTasks.map((each, index) => {
                        return <DefaultTemplate
                            key={index}
                            data={each}
                            handleChecked={this.handleChecked}
                        />
                    })}
                    </ScrollView>
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <AppButton
                            clicked={() => this.setState({ showTemplates: false, selectedTemplates: [] })}
                            title="Cancel"
                            style={[styles.button, {
                                backgroundColor: '#00ADEF',
                                marginRight: verticalScale(7)
                            }]}
                        />
                        <AppButton
                            clicked={() => {
                                if (this.state.selectedTemplates?.length > 0) {
                                    addTemplateActivity(this.state.selectedTemplates, this.props.currentEvent.id)
                                }
                                this.setState({
                                    selectedTemplates: [],
                                    showTemplates: false
                                })
                            }}
                            title="OK"
                            style={[styles.button]}
                        />
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    }

    render() {
        const { tabIndex,
            routes, } = this.state

        return <MenuProvider><ImageBackground
            source={require("../../../assets/images/blurBG.png")}
            resizeMode="cover"
            imageStyle={{
                width: "100%",
                height: "100%"
            }}
            style={{
                flex: 1,
                minWidth: "100%",
                minHeight: "100%"
            }}
        >
            <TopBar
                style={{ backgroundColor: 'transparent', }}
                title="Tasks"

                rightComponent={this.props.currentEvent.eventEditAccess ? this.renderRightHeaderComp() : <></>}
            />
            <View style={{
                marginHorizontal: moderateScale(10),
                flex: 1
            }}>




                <TabView

                    swipeEnabled={false}
                    navigationState={{ index: tabIndex, routes }}
                    renderScene={this.renderTabScene}
                    onIndexChange={(index) => this.setState({ tabIndex: index })}
                    initialLayout={{ width: deviceWidth - moderateScale(42) }}
                    renderTabBar={this.renderTabBar}
                />

                {/* <Pressable
                        onPress={() => this.props.navigation.navigate("AddTask")}
                        style={{
                            height: verticalScale(50),
                            width: verticalScale(50),
                            borderRadius: verticalScale(25),
                            borderWidth: verticalScale(5),
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: '#355D9B',
                            position: 'absolute',
                            zIndex: 100,
                            right: moderateScale(12),
                            bottom: moderateScale(65)
                        }}>
                        <FontAwesome5
                            name="plus"
                            style={{
                                fontSize: verticalScale(27),
                                color: '#355D9B'
                            }}
                        />
                    </Pressable> */}
            </View>
            {this.renderFilterModal()}
            {this.renderTemplateModal()}
        </ImageBackground >
        </MenuProvider>
    }
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
    },
    button: {
        height: verticalScale(40),
        flex: 1
    }
})

const mapStateToProps = state => {
    const { activityTypes } = state.events
    const { currentEvent } = state.events
    const { userData } = state.user

    return {
        activityTypes,
        currentEvent,
        userData
    }
}

export default connect(mapStateToProps)(EventTasks)
