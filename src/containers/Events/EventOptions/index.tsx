import * as React from 'react'
import {
    View,
    ImageBackground,
    ScrollView, StyleSheet,
    Dimensions,
    Pressable,
    Switch,
    Platform
} from 'react-native'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import Text from '../../../components/UI/AppText'
import TopBar from '../../../components/TopBar'
import { moderateScale, verticalScale } from '../../../utils/scalingUnits'

import * as SvgIcons from '../../../assets/svg-icons'
import Toast from 'react-native-toast-message'

import { allowGuestsToSeeGuestlist, cancelEvent, copyEvent, guestsToProposeBestDayAndTime } from '../../../store/actionCreators'
import axios from '../../../axios'
import { connect } from 'react-redux'
import ConfirmModal from '../../../components/ConfirmModal'
import ReactNativeModal from 'react-native-modal'
import moment from 'moment'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-elements'
import { addToDrafts } from '../../../store/draftsSlice'
import { store } from '../../../store'

class EventOptions extends React.Component {
    state = {
        settings: {
            1: {
                content: 'Allow guests to propose best day and time',
                active: false,
            },
            2: {
                content: 'Allow guests to see guestlist',
                active: false
            },
        },
        showConfirmModal: false,
        showCopyModel: false,
        showDatePicker: false,
        showStartTimePicker: false,
        showEndTimePicker: false,

        selectedDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        selectedStartTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        selectedEndTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)

    }

    componentDidMount() {
        this.initialize()
    }

    initialize = () => {
        const data = this.props.currentEvent
        let settings = {
            1: {
                content: 'Allow guests to propose best day and time',
                active: data?.allowSuggestMore,
            },
            2: {
                content: 'Allow guests to see guestlist',
                active: data?.allowGuestList
            },
        }
        if (data.eventTypeName != "CUSTOM") {
            delete settings[1]
        }
        this.setState({
            settings: settings
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentEvent != this.props.currentEvent) {
            this.initialize()
        }
    }

    changeSettingState = (id, boolean) => {
        let settings = { ...this.state.settings }

        settings[id].active = boolean;

        this.setState({ settings })
    }

    renderSettings = () => {
        const settings = { ...this.state.settings }
        const { data } = this.props.route.params

        return <View style={{
            marginHorizontal: moderateScale(11)
        }}>
            {
                Object.keys(settings).map(key => {
                    return <View style={{
                        height: verticalScale(80),
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                        key={key}
                    >
                        <Text style={{
                            color: '#355D9B', fontSize: verticalScale(18),
                            fontFamily: 'Mulish-Bold',
                            flex: 1
                        }}>
                            {settings[key].content}
                        </Text>
                        <Switch
                            value={settings[key].active}
                            onValueChange={(val) => {
                                if (key == 1) {
                                    guestsToProposeBestDayAndTime(data.id, val)
                                } else {
                                    allowGuestsToSeeGuestlist(data.id, val)
                                }
                            }}
                        />
                    </View>
                })
            }
        </View>
    }

    handleRes = (res) => {
        const { data, uid } = this.props.route.params
        if (res == "YES") {
            cancelEvent(data.id, uid, this.props.navigation)
        }
        this.setState({ showConfirmModal: false })
    }


    renderOptions = () => {
        const { data, uid } = this.props.route.params

        const options = [
            // {
            //     title: 'Edit Event',
            //     icon: <SvgIcons.EditIcon />,
            //     // navigation: "EventTabs",
            //     onPress: () => this.props.navigation.navigate("EventTabs", {
            //         screenAction: 'edit',
            //         data
            //     })
            // },
            {
                title: 'Copy Event',
                icon: <SvgIcons.CopyIcon />,
                //navigation: undefined
                onPress: () => {
                    //this.setState({ showCopyModel: true })
                    let eventUUID = Date.now()

                    let temp = 1
                    let disableMainScreenDates = false
                    let votedLocations = {}
                    let location = undefined
                    let votedDates = {}
                    let date = undefined

                    if (data.eventTypeName=="CUSTOM") {
                        data.timings.map(e => {
                            let date = new Date(e.slot)
                            let index = date.getTime()
                            votedDates[index] = {
                                date
                            }
                            if (e?.startTime) {
                                temp = temp + 1
                                let tkey = temp + new Date().getTime()

                                let dateObjToUpdate = votedDates[index];
                                dateObjToUpdate['times'] = {};

                                dateObjToUpdate['times'][tkey] = {
                                    startTime: moment(e.startTime, "HH:mm:ss").toDate(),
                                    endTime: moment(e.startTime, "HH:mm:ss").toDate(),
                                    showStartTimePicker: false,
                                    showEndTimePicker: false,
                                };
                                votedDates[index] = dateObjToUpdate;
                            }
                        })
                        disableMainScreenDates = true

                        data.locations.map(e => {

                            votedLocations[Math.floor(1000 * Math.random())] = {
                                loc: e.name,
                                lat: e.longitude,
                                lng: e.latitude
                            }
                        })
                        votedDates=JSON.stringify(votedDates)

                    } else {
                        location = {
                            loc: data.locations[0].name,
                            lat: data.locations[0].latitude,
                            lng: data.locations[0].longitude
                        }
                        date = {
                            selectedDate: moment(new Date(data.timings[0].slot)).format(),
                            selectedStartTime: moment(data.timings[0].startTime, "HH:mm:ss").format(),
                            selectedEndTime: moment(data.timings[0].endTime, "HH:mm:ss").format(),
                        }
                        votedDates=undefined
                        votedLocations=undefined
                    }

                    const dataToStore = {
                        defaultImage: data.imagePath,
                        eventName: data.name,
                        eventTypeId: data.eventTypeId,
                        selectedCategory: data.eventTypeName,
                        votedDates: votedDates,
                        votedLocations: votedLocations,
                        location,
                        // only send if not disabled
                        ...(!disableMainScreenDates && date),
                        disableMainScreenDates,
                        eventUUID,
                        activities:data.activities
                    }

                    //console.log(dataToStore)

                    store.dispatch(
                        addToDrafts({
                            id: eventUUID,
                            data: dataToStore
                        })
                    )
                    this.props.navigation.pop(2)
                    this.props.navigation.navigate("Main",{
                        screen: "Drafts",
                    })
                    this.props.navigation.navigate("CreateEventScreen", {
                        draftData: dataToStore,
                        eventUUID: eventUUID
                    })
                }
            },
            {
                title: 'Cancel Event',
                icon: <SvgIcons.CancelIcon />,
                //navigation: undefined,
                onPress: () => {
                    this.setState({ showConfirmModal: true })
                }
            },
        ]

        return <View style={{}}>
            {options.map((each, index) => {
                return <Pressable
                    key={index}
                    style={{
                        flexDirection: 'row',
                        height: verticalScale(90),
                        alignItems: 'center',
                        borderBottomColor: '#76AEC6',
                        borderBottomWidth: verticalScale(1)
                    }}
                    onPress={() => {
                        if (each.onPress) {
                            each.onPress()
                            return
                        }

                        each.navigation ? this.props.navigation.navigate(each.navigation, {
                            data
                        }) : undefined
                    }}
                >
                    <View style={{
                        flex: 0.15,
                        alignItems: 'center'
                    }}>
                        <View
                            style={{ transform: [{ scale: moderateScale(1) }] }}
                        >
                            {each.icon}
                        </View>
                    </View>
                    <View style={{
                        flex: 0.7
                    }}>
                        <Text style={{
                            fontSize: verticalScale(18),
                            color: '#355D9B'
                        }}>
                            {each.title}
                        </Text>
                    </View>
                    <View style={{
                        flex: 0.15
                    }}>
                        <MaterialIcons
                            name="keyboard-arrow-right"
                            style={{
                                fontSize: verticalScale(20),
                                color: '#355D9B'
                            }}
                        />
                    </View>
                </Pressable>
            })}
        </View>
    }

    renderDateSelector = () => {
        return (
            <View style={{ marginBottom: moderateScale(6) }}>
                <Text style={[styles.heading2, { marginBottom: 10 }]}>Date/Time</Text>
                <Pressable
                    onPress={() => {
                        this.setState({ showDatePicker: true });
                    }}
                    style={{
                        borderRadius: moderateScale(6),
                        borderColor: 'rgba(53, 93, 155, 1)',
                        backgroundColor: '#fff',
                        minHeight: moderateScale(42),
                        borderWidth: 0.5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: moderateScale(8),
                        justifyContent: 'space-between',
                    }}>
                    {/* <MaterialCommunityIcons
                    name="calendar-blank-outline"
                    style={{ fontSize: 22, color: 'rgba(0, 173, 239, 1)' }}
                /> */}
                    <Text
                        style={{
                            color: 'rgba(53, 93, 155, 1)',
                            fontFamily: 'Mulish-Regular',
                            marginLeft: moderateScale(6),
                        }}>
                        {moment(this.state.selectedDate).format('DD MMM[,] YYYY')}
                    </Text>
                    {/* <View
                    style={{ transform: [{ scale: moderateScale(0.8) }], marginLeft: 'auto' }}
                >
                    <SvgImage.DownArrow
                    />
                </View> */}
                    <EvilIcons
                        name="calendar"
                        style={{ fontSize: 40, color: 'rgba(0, 173, 239, 1)' }}
                    />
                </Pressable>
                <DateTimePickerModal
                    isVisible={this.state.showDatePicker}
                    mode="date"
                    date={new Date(this.state.selectedDate)}
                    onConfirm={date => {
                        this.setState({ selectedDate: date, showDatePicker: false });
                    }}
                    onCancel={() => this.setState({ showDatePicker: false })}
                />
            </View>
        );
    };

    renderTimeSelector = () => {
        return (
            <View>
                <Text style={[styles.heading2, { marginBottom: moderateScale(10) }]}>
                    Select Time
                </Text>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            flex: 1,
                        }}>
                        <Text
                            style={{
                                marginBottom: 3,
                                fontSize: 14,
                                color: 'rgba(53, 93, 155, 1)',
                            }}>
                            Starts at
                        </Text>
                        <Pressable
                            onPress={() => {
                                this.setState({ showStartTimePicker: true });
                            }}
                            style={{
                                borderRadius: moderateScale(6),
                                borderColor: 'rgba(53, 93, 155, 1)',
                                backgroundColor: '#fff',
                                minHeight: moderateScale(42),
                                borderWidth: 0.5,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: moderateScale(8),
                            }}>
                            {/* <MaterialCommunityIcons
                            name="calendar-blank-outline"
                            style={{ fontSize: 22, color: 'rgba(0, 173, 239, 1)' }}
                        /> */}
                            <Text
                                style={{
                                    color: 'rgba(53, 93, 155, 1)',
                                    fontFamily: 'Mulish-Regular',
                                    marginLeft: moderateScale(6),
                                }}>
                                {moment(this.state.selectedStartTime, 'hh:mm:ss').format(
                                    'hh:mm A',
                                )}
                            </Text>
                            <Ionicons
                                name="time-outline"
                                size={24}
                                color="rgba(0, 173, 239, 1)"
                            />
                            {/* <View
                            style={{ transform: [{ scale: moderateScale(0.8) }], marginLeft: 'auto' }}
                        >
                            <SvgImage.DownArrow
                            />
                        </View> */}
                        </Pressable>
                    </View>
                    <View style={{ width: 10 }}></View>
                    <View
                        style={{
                            flex: 1,
                        }}>
                        <Text
                            style={{
                                marginBottom: 3,
                                fontSize: 14,
                                color: 'rgba(53, 93, 155, 1)',
                            }}>
                            Ends at
                        </Text>
                        <Pressable
                            onPress={() => {
                                this.setState({ showEndTimePicker: true });
                            }}
                            style={{
                                borderRadius: moderateScale(6),
                                borderColor: 'rgba(53, 93, 155, 1)',
                                backgroundColor: '#fff',
                                minHeight: moderateScale(42),
                                borderWidth: 0.5,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: moderateScale(8),
                            }}>
                            {/* <MaterialCommunityIcons
                            name="calendar-blank-outline"
                            style={{ fontSize: 22, color: 'rgba(0, 173, 239, 1)' }}
                        /> */}
                            <Text
                                style={{
                                    color: 'rgba(53, 93, 155, 1)',
                                    fontFamily: 'Mulish-Regular',
                                    marginLeft: moderateScale(6),
                                }}>
                                {moment(this.state.selectedEndTime, 'hh:mm:ss').format(
                                    'hh:mm A',
                                )}
                            </Text>
                            <Ionicons
                                name="time-outline"
                                size={24}
                                color="rgba(0, 173, 239, 1)"
                            />
                            {/* <View
                            style={{ transform: [{ scale: moderateScale(0.8) }], marginLeft: 'auto' }}
                        >
                            <SvgImage.DownArrow
                            />
                        </View> */}
                        </Pressable>
                    </View>
                </View>

                <DateTimePickerModal
                    isVisible={this.state.showStartTimePicker}
                    mode="time"
                    date={moment(this.state.selectedStartTime, 'hh:mm:ss').toDate()}
                    onConfirm={date => {
                        this.setState({
                            selectedStartTime: date,
                            showStartTimePicker: false,
                        });
                    }}
                    onCancel={() => this.setState({ showStartTimePicker: false })}
                />
                <DateTimePickerModal
                    isVisible={this.state.showEndTimePicker}
                    mode="time"
                    date={moment(this.state.selectedEndTime, 'hh:mm:ss').toDate()}
                    onConfirm={date => {
                        this.setState({ selectedEndTime: date, showEndTimePicker: false });
                    }}
                    onCancel={() => this.setState({ showEndTimePicker: false })}
                />
            </View>
        );
    };

    render() {
        let { data } = this.props.route.params

        return <>
            <ImageBackground
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
                    style={{ backgroundColor: 'transparent' }}
                    title="Options"
                />
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                >
                    <Text style={[styles.heading]}>Event Actions</Text>
                    {this.renderOptions()}
                    <Text style={[styles.heading]}>Settings</Text>
                    {this.renderSettings()}
                </ScrollView>
            </ImageBackground >
            <ConfirmModal showConfirmModal={this.state.showConfirmModal}
                confirmMessage={"Are you sure you want to Cancel the Event?"}
                handleRes={this.handleRes} />
            <ReactNativeModal
                isVisible={this.state.showCopyModel}
            //onBackdropPress={()=>this.setState({showCopyModel:false})}
            >
                <View style={{ backgroundColor: 'white', borderRadius: 6, padding: 15 }}>
                    <View style={{ backgroundColor: 'rgba(238, 215, 255, 0.27)', width: "100%" }}>
                        <Text
                            style={[{
                                fontSize: 18, color: "#355D9B",
                                //textDecorationLine: 'underline',
                                fontFamily: "Mulish-ExtraBold",
                                alignSelf: "center",
                                padding: 5

                            }]}>Copy Event</Text>
                    </View>
                    <View style={{}}>
                        {this.renderDateSelector()}
                        <View style={{ height: moderateScale(11) }}></View>
                        {this.renderTimeSelector()}
                        <View style={{ height: moderateScale(20) }}></View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        //minHeight: moderateScale(38),
                    }}>
                        <View style={{ flex: 1 }}>
                            <Button
                                title="Cancel"
                                type="outline"
                                buttonStyle={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 4,
                                    borderWidth: 1,
                                    borderColor: "#00ADEF",
                                    paddingVertical: moderateScale(10)
                                }}
                                titleStyle={{
                                    fontFamily: 'Mulish',
                                    color: '#00ADEF',
                                    fontSize: moderateScale(15),
                                    fontWeight: "600",
                                }}
                                onPress={() => {
                                    this.setState({ showCopyModel: false })
                                }}
                            />
                        </View>
                        <View style={{ width: 10 }}></View>
                        <View style={{ flex: 1 }}>
                            <Button
                                title="Confirm"
                                buttonStyle={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 4,
                                    borderWidth: 1,
                                    borderColor: "#00ADEF",
                                    backgroundColor: "#00ADEF",
                                    paddingVertical: moderateScale(10)
                                }}
                                titleStyle={{
                                    fontFamily: 'Mulish',
                                    fontSize: moderateScale(15),
                                    fontWeight: "600",
                                }}
                                onPress={() => {
                                    let obj = {
                                        "slot": moment(this.state.selectedDate).format('YYYY-MM-DD'),
                                        "startTime": moment(this.state.selectedStartTime).format('HH:mm'),
                                        "endTime": moment(this.state.selectedEndTime).format('HH:mm'),
                                        "eventId": data.id
                                    }
                                    copyEvent(obj, (res, err) => {
                                        this.setState({ showCopyModel: false })
                                        if (res) {
                                            this.props.navigation.pop(2)
                                            this.props.navigation.navigate('EventTabs', {
                                                data: { id: res.data.id },
                                                showConfirmModal: false,
                                            })
                                            Toast.show({
                                                type: 'success',
                                                text1: 'Copied Event successfully'
                                            })
                                        }
                                        else if (err) {
                                            console.log(err)
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Failed to Copy'
                                            })
                                        }
                                    })
                                }}
                            />
                        </View>
                    </View>
                </View>
            </ReactNativeModal>
        </>
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
    heading2: {
        fontFamily: 'Mulish-Bold',
        color: '#355D9B',
        fontSize: moderateScale(15.5),
    },
    section: {
        //minHeight: moderateScale(145),
        borderRadius: moderateScale(10),
        backgroundColor: '#fff',
        marginBottom: moderateScale(10),
        padding: moderateScale(10),
        //justifyContent: 'space-around'
        /* ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1,
            },
            android: {
                elevation: 1,
            },
        }), */
    },
})

const mapStateToProps = state => {
    const { currentEvent } = state.events

    return {
        currentEvent,
    }
}

export default connect(mapStateToProps)(EventOptions)
