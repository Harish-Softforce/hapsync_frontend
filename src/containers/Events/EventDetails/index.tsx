import * as React from 'react';
import {
    View,
    ViewStyle,
    StyleSheet,
    Pressable,
    ImageBackground,
    Dimensions,
    ScrollView,
    TextStyle,
    Image,
    TextInput,
    RefreshControl,
    Text,
    Platform,
    Linking,
    FlatList,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import TopBar from '../../../components/TopBar';
import AppText from '../../../components/UI/AppText';
//import DoubleTap from '../../../components/DoubleTapComponent';
import * as SvgIcons from '../../../assets/svg-icons';
import { moderateScale, verticalScale } from '../../../utils/scalingUnits';
import PollItem from '../../../components/PollItem';
import { PollDateType } from '../HostEventConfirm';
import moment from 'moment';
import { connect } from 'react-redux';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import {
    addInviteeChat,
    clearCurrentEvent,
    deleteLocationforCustomEvent,
    getCurrentEventDetails,
    inviteeVotingUpdate,
    updateEvent,
} from '../../../store/actionCreators';
import { staticConfigs } from '../../../utils/configs';

import GuestsList from './guestsList';
import { Button } from 'react-native-elements';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as SvgImage from '../../../assets/svg-icons';
import Config from 'react-native-config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { showLocation } from 'react-native-map-link';
import Share from 'react-native-share';
import Fontisto from 'react-native-vector-icons/Fontisto'
import CryptoJS from 'crypto-js';

type Styles = {
    container: ViewStyle;
    heading: TextStyle;
};

class EventDetails extends React.Component {
    state = {
        countdown: {
            days: {
                value: undefined,
            },
            hours: {
                value: undefined,
            },
            min: {
                value: undefined,
            },
            sec: {
                value: undefined,
            },
        },
        secondsTilEvent: -1,
        formValue: {
            eventName: {
                value: undefined,
                inEditMode: false,
            },
            address: {
                value: undefined,
                inEditMode: false,
            },
            date: {
                value: undefined,
                inEditMode: false,
            },
            eventDescription: {
                value: undefined,
                inEditMode: false
            }
        },
        formValueEventNameErrMsg: '',
        formValueEventDescErrMsg: "",
        selectedDate: undefined,
        selectedStartTime: undefined,
        selectedEndTime: undefined,
        //
        eventEdited: false,
        refreshing: false,
        userEditAccess: false,

        vendorsCount: 0,
        tasksCount: 0,
        guestCount: 0,
        budget: 0,

        imgHeight: 0,
        encryptEventId: null,
    };

    countdownInterval = undefined;
    countdownTimeout = undefined;

    componentDidMount() {
        setTimeout(() => {
            const data = this.props.currentEvent;

            if (data) {
                // duration is seconds from event date till now
                const dateTime =
                    data.timings[0].slot +
                    (data.timings[0].startTime ? ' ' + data.timings[0].startTime : '');
                const secondsTilEvent = moment(dateTime).diff(moment(), 'seconds');
                const startTime = Date.now();

                this.setState({ secondsTilEvent: secondsTilEvent });
                this.countdownUpdateFunc();
                // if date is in the past then start countdown
                // if (moment(dateTime).isAfter()) {
                //     this.countdownInterval = setInterval(() => this.countdownUpdateFunc(secondsTilEvent, startTime), 1000)
                // }

                let vendorsCount = 0;
                let tasksCount = 0;
                let guestCount = 0;
                let budget = 0;

                let tasks = data?.activities
                if (data.owner != this.props.userData.id) {
                    tasks = data.activities.filter(t => t.assignees.find(i => i.userId == this.props.userData.id))
                }

                tasks?.map(i => {
                    vendorsCount += i.vendors.length;
                });
                tasksCount = tasks?.length;
                guestCount = data?.invitees?.reduce((sum, { guestCount }) => sum + guestCount, 0)
                budget = data?.budget;

                this.setState(state => ({
                    ...state,
                    formValue: {
                        ...state.formValue,
                        eventName: {
                            ...state.formValue.eventName,
                            value: this.props.currentEvent.name,
                        },
                        address: {
                            value: this.props.currentEvent?.locations[0],
                            inEditMode: false,
                        },
                        date: {
                            value: this.props.currentEvent.timings[0],
                            inEditMode: false,
                        },
                        eventDescription: {
                            value: this.props.currentEvent.description,
                            inEditMode: false
                        }
                    },
                    //addressTextInput:this.props.currentEvent?.locations[0].name,
                    selectedDate: this.props.currentEvent.timings[0].slot,
                    selectedStartTime: moment(
                        this.props.currentEvent.timings[0].startTime
                            ? this.props.currentEvent.timings[0].startTime
                            : new Date(),
                        'hh:mm:ss',
                    ).toDate(),
                    selectedEndTime: moment(
                        this.props.currentEvent.timings[0].endTime
                            ? this.props.currentEvent.timings[0].endTime
                            : new Date(),
                        'hh:mm:ss',
                    ).toDate(),

                    userEditAccess:
                        this.props.currentEvent.owner == this.props.userData.id,
                    vendorsCount: vendorsCount,
                    tasksCount: tasksCount,
                    guestCount: guestCount,
                    budget: budget,
                }));
            }
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
                this.setState({ encryptEventId: encrypted })
            } catch (e) {
                console.log(e)
            }


        }, 1000);
    }

    onRefresh = async () => {
        //console.log(this.state)
        this.setState({ refreshing: true });
        await getCurrentEventDetails(this.props.route?.params.data.id, false);
        this.setState({ refreshing: false });
    };

    componentWillUnmount() {
        clearInterval(this.countdownInterval);
        clearTimeout(this.countdownTimeout);
        clearCurrentEvent();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.currentEvent != this.props.currentEvent) {
            if (this.props.currentEvent) {
                let data = this.props.currentEvent;
                const eventTime =
                    data.timings[0].slot +
                    (data.timings[0].startTime ? ' ' + data.timings[0].startTime : '');
                const secondsTilEvent = moment(eventTime).diff(moment(), 'seconds');

                if (this.state.secondsTilEvent != secondsTilEvent) {
                    this.setState({ secondsTilEvent: secondsTilEvent });
                    // if date is in the past then start countdown

                    //clearInterval(this.countdownInterval)
                    //console.log(this.countdownInterval)
                    //setTimeout(() => {
                    //    this.countdownInterval = setInterval(() => this.countdownUpdateFunc(duration), 1000)
                    // }, 5000)

                    if (this.state.secondsTilEvent == 0) {
                        this.countdownUpdateFunc();
                    }
                }
                let vendorsCount = 0;
                let tasksCount = 0;
                let guestCount = 0;
                let budget = 0;

                let tasks = data?.activities
                if (data.owner != this.props.userData.id) {
                    tasks = data.activities.filter(t => t.assignees.find(i => i.userId == this.props.userData.id))
                }

                tasks?.map(i => {
                    vendorsCount += i.vendors.length;
                });
                tasksCount = tasks?.length;
                guestCount = data?.invitees?.reduce((sum, { guestCount }) => sum + guestCount, 0)
                budget = data?.budget;

                this.setState(state => ({
                    ...state,
                    formValue: {
                        ...state.formValue,
                        eventName: {
                            ...state.formValue.eventName,
                            value: this.props.currentEvent.name,
                        },
                        address: {
                            value: this.props.currentEvent?.locations[0],
                            inEditMode: false,
                        },
                        date: {
                            value: this.props.currentEvent.timings[0],
                            inEditMode: false,
                        },
                        eventDescription: {
                            value: this.props.currentEvent.description,
                            inEditMode: false
                        }
                    },
                    //addressTextInput:this.props.currentEvent?.locations[0].name,
                    selectedDate: this.props.currentEvent.timings[0].slot,
                    selectedStartTime: moment(
                        this.props.currentEvent.timings[0].startTime
                            ? this.props.currentEvent.timings[0].startTime
                            : new Date(),
                        'hh:mm:ss',
                    ).toDate(),
                    selectedEndTime: moment(
                        this.props.currentEvent.timings[0].endTime
                            ? this.props.currentEvent.timings[0].endTime
                            : new Date(),
                        'hh:mm:ss',
                    ).toDate(),

                    userEditAccess:
                        this.props.currentEvent.owner == this.props.userData.id,
                    vendorsCount: vendorsCount,
                    tasksCount: tasksCount,
                    guestCount: guestCount,
                    budget: budget,
                }));
            }
        }
    }

    countdownUpdateFunc = () => {
        let diff,
            minutes,
            seconds,
            hours = 0,
            days = 0;
        // get the number of seconds that have elapsed since
        // startTimer() was called
        //diff = secondsTilEvent - (((Date.now() - currentDate) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (this.state.secondsTilEvent / 60) | 0;
        seconds = this.state.secondsTilEvent % 60 | 0;

        // if its 00:00 dont subtract again
        if (minutes < 0 && seconds < 0) {
            minutes = 0;
            seconds = 0;
        } else {
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
        }

        if (minutes >= 60) {
            hours = (minutes / 60) | 0;
            minutes = minutes % 60 | 0;
        }
        if (hours >= 24) {
            days = (hours / 24) | 0;
            hours = hours % 24 | 0;
        }

        // const display = days + ':::' + hours + "::" + minutes + ":" + seconds;

        if (this.state.secondsTilEvent >= 0) {
            let countdown = { ...this.state.countdown };
            countdown.days.value = days;
            countdown.hours.value = hours;
            countdown.min.value = minutes;
            countdown.sec.value = seconds;

            this.countdownTimeout = setTimeout(() => {
                let secondsTilEvent = this.state.secondsTilEvent - 1;
                this.setState({ countdown: countdown, secondsTilEvent: secondsTilEvent });
                //console.log("secondsTilEvent " + secondsTilEvent)
                this.countdownUpdateFunc();
            }, 1000);
        } else {
            let countdown = { ...this.state.countdown };
            countdown.days.value = 0;
            countdown.hours.value = 0;
            countdown.min.value = '00';
            countdown.sec.value = '00';
            this.setState({ countdown: countdown, secondsTilEvent: 0 });
        }
        return;
    };

    calculatePollNo = (data: Array) => {
        if (Array.isArray(data)) {
            let trueNo = data.filter(each => each.vote == 'LIKE').length;
            let falseNo = data.filter(each => each.vote == 'DISLIKE').length;
            return {
                trueNo,
                falseNo,
            };
        } else {
            return {
                trueNo: 0,
                falseNo: 0,
            };
        }
    };

    getEventCategoryName = () => {
        const { eventsCategories } = this.props;
        const data = this.props.currentEvent;

        let name;
        if (eventsCategories) {
            let nameObj = eventsCategories.filter(
                each => each.eventTypeId == data.eventTypeId,
            )[0];
            name = nameObj ? nameObj.eventTypeName : undefined;
        }

        return name;
    };

    handleTextAndEditableUpdate = (key: string, value, inEditMode: boolean) => {
        const formValue = { ...this.state.formValue };
        const { eventEdited } = this.state;

        if (!eventEdited) {
            this.setState({ eventEdited: true });
        }

        let newData = {
            value: value,
            inEditMode: inEditMode,
        };

        /* if (newData.inEditMode) {
                if (!this[`${key}Input`].isFocused()) {
                    // this[`${key}Input`]?.focus()
                    // console.log('input ref ',this[`${key}Input`]?.isFocused())
                }
            } */
        //console.log(newData)

        formValue[key] = newData;

        this.setState({ formValue });
    };

    submitEdits = () => {
        console.log(this.state.formValue.eventDescription.value)
        if (this.state.formValue.eventName.value != ''
            && this.state.formValue.eventDescription.value != '' && this.state.selectedStartTime <= this.state.selectedEndTime) {
            const formValue = { ...this.state.formValue };

            //console.log(this.state)
            let obj = { ...this.props.currentEvent };

            if (this.state.formValue.eventName.inEditMode) {
                obj.name = this.state.formValue.eventName.value;
            }
            if (this.state.formValue.address.inEditMode) {
                obj.locations = [this.state.formValue.address.value];
            }
            if (this.state.formValue.eventDescription.inEditMode) {
                obj.description = this.state.formValue.eventDescription.value;
            }
            if (this.state.formValue.date.inEditMode) {
                obj.timings = [
                    {
                        slot: moment(new Date(this.state.selectedDate)).format(
                            'YYYY-MM-DD',
                        ),
                        startTime: moment(new Date(this.state.selectedStartTime)).format(
                            'HH:mm',
                        ),
                        endTime: moment(new Date(this.state.selectedEndTime)).format(
                            'HH:mm',
                        ),
                    },
                ];
            }
            obj.eventId = obj.id;
            //console.log(obj)

            updateEvent(obj);

            this.setState({ eventEdited: false });
            for (let formKey in formValue) {
                formValue[formKey].inEditMode = false;
            }
        }
    };

    renderRightHeader = () => {
        const data = this.props.currentEvent;
        const { eventEdited } = this.state;

        return (
            <View>
                {eventEdited ? (
                    <Pressable onPress={this.submitEdits}>
                        <Feather
                            name="check"
                            style={{
                                fontSize: verticalScale(27),
                                color: '#355D9B',
                            }}
                        />
                    </Pressable>
                ) : (
                    <Pressable
                        onPress={() =>
                            this.props.navigation.navigate('EventOptions', {
                                data: data,
                                uid: this.props.userData.id,
                            })
                        }>
                        <SvgIcons.SettingsIcon />
                    </Pressable>
                )}
            </View>
        );
    };

    handleTimingVote = (pollId, status) => {
        if (!(this.state.secondsTilEvent > 0)) {
            return
        }
        let obj = {
            pollingId: pollId,
            pollingType: 'TIME',
            vote: status,
            userId: this.props.userData.id,
        };
        //console.log(obj)
        inviteeVotingUpdate(obj, this.props.currentEvent.id);
    };

    handleLocationVote = (pollId, clickStatus, prevStatus) => {

        if (!(this.state.secondsTilEvent > 0)) {
            return
        }
        let a = prevStatus;

        if (a == 'PENDING') {
            a = clickStatus;
            let obj = {
                pollingId: pollId,
                pollingType: 'LOCATION',
                vote: a,
                userId: this.props.userData.id,
            };

            inviteeVotingUpdate(obj, this.props.currentEvent.id);
        } else if (a == clickStatus) {
            a = 'PENDING';
            let obj = {
                pollingId: pollId,
                pollingType: 'LOCATION',
                vote: a,
                userId: this.props.userData.id,
            };

            inviteeVotingUpdate(obj, this.props.currentEvent.id);
        }
    };

    renderPolls = () => {
        const data = this.props.currentEvent;

        const category = data.eventTypeName;

        if (category?.toLowerCase() !== 'custom' || data.pollingStatus == 'ENDED') {
            return;
        }

        let pollDates: PollDateType[] = [];
        // api data

        if (Array.isArray(data.timings)) {
            data.timings.forEach(each => {
                if (each.startTime && each.endTime) {
                    pollDates.push({
                        date: moment(each.slot, 'YYYY-MM-DD').toString(),
                        time: {
                            startTime: moment(each.startTime, 'hh:mm:ss').toString(),
                            endTime: moment(each.endTime, 'hh:mm:ss').toString(),
                        },
                        polling: each.polling,
                        // send remaining data in each time obj, for when PollDates screen returns them
                        ...each,
                    });
                } else {
                    pollDates.push({
                        date: moment(each.slot, 'YYYY-MM-DD').toString(),
                        time: undefined,
                        polling: each.polling,
                        // send remaining data in each time obj, for when PollDates screen returns them
                        ...each,
                    });
                }
            });
        }

        return (
            <>
                {this.state.userEditAccess && this.state.secondsTilEvent > 0 && (
                    <View style={{ marginBottom: moderateScale(-5), alignItems: 'center' }}>
                        <Button
                            title="END POLLING"
                            buttonStyle={{
                                backgroundColor: '#CF6364',
                            }}
                            onPress={() =>
                                this.props.navigation.navigate('EndDatePolling', {
                                    pollDates: data.timings,
                                    pollLocations: data.locations,
                                    eventId: data.id,
                                })
                            }
                        />
                    </View>
                )}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: moderateScale(15),
                        marginBottom: moderateScale(13),
                    }}>
                    <Text
                        style={styles.heading}
                    //todo
                    // change to: Freeze the date/time and location
                    >
                        Vote for Best Day
                    </Text>
                    {/* <Pressable onPress={() => this.props.navigation.navigate("PollDateUpdate", {
                    // send all nav params to poll dates screen
                    ...this.props.route.params,
                    datesWithUniqueTimes: pollDates,
                    editAccess: this.state.userEditAccess,
                    userId: this.props.userData.id,
                })}>
                    <AppText style={{
                        color: '#00ADEF'
                    }}>See all</AppText>
                </Pressable> */}
                </View>
                <FlatList
                    data={pollDates}
                    renderItem={({ item }) =>
                        <PollItem
                            containerStyle={{
                                width: deviceWidth / 2 - moderateScale(30),
                                marginRight: moderateScale(10)
                            }}
                            data={item}
                            uid={this.props.userData.id}
                            eventId={this.props.currentEvent.id}
                            handleTimingVote={this.handleTimingVote}
                            userEditAccess={this.state.userEditAccess && this.state.secondsTilEvent > 0 && (pollDates?.length > 1)}
                        />
                    }
                    keyExtractor={(item, index) => index}
                    contentContainerStyle={{ padding: 3 }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
                {/* <View
                    style={{
                        flexDirection: 'row',
                    }}>
                    {pollDates.map((each, index) => {
                        const even = index % 2 == 0;

                        return (
                            <PollItem
                                containerStyle={{
                                }}
                                key={index}
                                data={each}
                                uid={this.props.userData.id}
                                handleTimingVote={this.handleTimingVote}
                            />
                        );
                    })}
                </View> */}
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        {(data?.allowSuggestMore || this.state.userEditAccess) &&
                            this.state.secondsTilEvent > 0 && (
                                <Button
                                    title={'Suggest more'}
                                    containerStyle={{
                                        flex: 1,
                                        //marginHorizontal: 10,
                                        marginTop: moderateScale(10),
                                    }}
                                    type="outline"
                                    buttonStyle={{
                                        padding: moderateScale(6),
                                        borderColor: 'rgba(238, 215, 255, 0.27)',
                                        //borderWidth: 0.5,
                                        backgroundColor: 'rgba(238, 215, 255, 0.27)',
                                    }}
                                    titleStyle={{
                                        color: 'red',
                                        fontFamily: 'Mulish',
                                        fontSize: 16,
                                    }}
                                    onPress={() => {
                                        /* let votedDates={}
                                                let timeobj={}
                                                this.props.currentEvent?.timings?.map((each,i)=>{
                        
                                                    if (!(new Date(each.slot).getDate() in votedDates)){
                                                        timeobj={}
                                                    }
                                                    
                                                    if(each.startTime){
                                                        timeobj[i]={
                                                            startTime:new Date(moment(each.startTime,"hh:mm:ss")),
                                                            endTime:new Date(moment(each.endTime,"hh:mm:ss")),
                                                            showStartTimePicker:false,
                                                            showEndTimePicker:false,
                                                            addToAlldates:false
                                                        }
                                                    }
                                                    votedDates[new Date(each.slot).getDate()]={
                                                        date:new Date(each.slot),
                                                        times:Object.keys(timeobj).length==0?undefined:timeobj
                                                    }
                                                }) */
                                        //console.log(votedDates)
                                        this.props.navigation.navigate('VoteScreen', {
                                            //votedDates:JSON.stringify(votedDates),
                                            editingEvent: true,
                                            eventData: this.props.currentEvent,
                                        });
                                    }}
                                />
                            )}
                        <Button
                            title={'See all (' + pollDates.length + ') '}
                            containerStyle={{
                                flex: 1,
                                //marginHorizontal: 10,
                                marginTop: moderateScale(10),
                            }}
                            type="outline"
                            buttonStyle={{
                                padding: moderateScale(6),
                                borderColor: 'rgba(238, 215, 255, 0.27)',
                                //borderWidth: 0.5,
                                backgroundColor: 'rgba(238, 215, 255, 0.27)',
                            }}
                            titleStyle={{
                                color: '#00ADEF',
                                fontFamily: 'Mulish',
                                fontSize: 16,
                            }}
                            icon={
                                <Image
                                    style={{ height: 16, width: 20 }}
                                    source={require('../../../assets/images/open-eye.png')}
                                />
                            }
                            iconRight
                            onPress={() =>
                                this.props.navigation.navigate('PollDateUpdate', {
                                    // send all nav params to poll dates screen
                                    ...this.props.route.params,
                                    datesWithUniqueTimes: pollDates,
                                    incompleteEvent: this.state.secondsTilEvent != 0,
                                    editAccess: (data?.allowSuggestMore || this.state.userEditAccess) && this.state.secondsTilEvent != 0,
                                    userEditAccess: this.state.userEditAccess && this.state.secondsTilEvent != 0,
                                    userId: this.props.userData.id,
                                })
                            }
                        />
                    </View>
                </View>
            </>
        );
    };

    renderLocations = () => {
        const data = this.props.currentEvent;

        const category = data.eventTypeName;

        if (category?.toLowerCase() !== 'custom' || data.pollingStatus == 'ENDED') {
            return;
        }

        const locationsData = data.locations ? data.locations : [];

        return (
            <>
                <View
                    style={{
                        //backgroundColor: '#fff',
                        borderRadius: moderateScale(10),
                        marginVertical: moderateScale(10),
                        //padding: moderateScale(10),
                    }}>
                    <Text style={styles.heading}>Vote for Best Location</Text>
                    <View style={{}}>
                        {locationsData.map((each, index) => {
                            let prevStatus = null;
                            each.polling.map(item => {
                                if (item.userId == this.props.userData.id) {
                                    prevStatus = item.vote;
                                }
                            });

                            return (
                                <View
                                    key={each.id}
                                    style={{
                                        flexDirection: 'row',
                                        backgroundColor: '#fff',
                                        minHeight: moderateScale(50),
                                        alignItems: 'center',
                                        borderBottomWidth: 0.5,
                                        borderWidth: 0.5,
                                        borderColor: '#ccc',
                                        borderRadius: moderateScale(6),
                                        padding: 10,
                                        //paddingVertical: moderateScale(16),
                                        marginTop: moderateScale(10),
                                        justifyContent: 'space-between',
                                    }}>
                                    <AppText style={{ flex: 1, color: 'grey' }}>
                                        {each.name}
                                    </AppText>
                                    {/* locationsData.length == 1 ? (
                                        <></>
                                    ) : */ (
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}>
                                                <Pressable
                                                    onPress={() =>
                                                        this.handleLocationVote(
                                                            each.id,
                                                            'DISLIKE',
                                                            prevStatus,
                                                        )
                                                    }
                                                    style={{
                                                        alignItems: 'center',
                                                        padding: moderateScale(9),
                                                    }}>
                                                    <View style={{ transform: [{ rotateY: '180deg' }] }}>
                                                        <MaterialCommunityIcons
                                                            name="thumb-down"
                                                            style={{
                                                                color:
                                                                    prevStatus == 'LIKE' ? '#C0C0C0' : '#E14F50',

                                                                fontSize: moderateScale(18),
                                                            }}
                                                        />
                                                    </View>
                                                    <AppText
                                                        style={{
                                                            color: '#E14F50',
                                                            fontFamily: 'Mulish-ExtraBold',
                                                        }}>
                                                        {this.calculatePollNo(each.polling).falseNo}
                                                    </AppText>
                                                </Pressable>
                                                <Pressable
                                                    onPress={() =>
                                                        this.handleLocationVote(each.id, 'LIKE', prevStatus)
                                                    }
                                                    style={{
                                                        padding: moderateScale(9),
                                                        alignItems: 'center',
                                                    }}>
                                                    <MaterialCommunityIcons
                                                        name="thumb-up"
                                                        style={{
                                                            color:
                                                                prevStatus == 'DISLIKE' ? '#C0C0C0' : '#355D9B',
                                                            fontSize: moderateScale(18),
                                                        }}
                                                    />
                                                    <AppText
                                                        style={{
                                                            color: '#355D9B',
                                                            fontFamily: 'Mulish-ExtraBold',
                                                        }}>
                                                        {this.calculatePollNo(each.polling).trueNo}
                                                    </AppText>
                                                </Pressable>
                                                {(this.state.userEditAccess && this.state.secondsTilEvent > 0)
                                                    && locationsData.length > 1 && <Pressable
                                                        onPress={() => {
                                                            //alert (each.id)
                                                            Alert.alert('Alert!', 'Are you sure you want to remove?', [
                                                                {
                                                                    text: 'Cancel',
                                                                    onPress: () => { },
                                                                    style: 'cancel',
                                                                },
                                                                {
                                                                    text: 'Yes',
                                                                    onPress: () => {

                                                                        deleteLocationforCustomEvent(each.id, this.props.currentEvent.id)
                                                                    },
                                                                    style: 'destructive'
                                                                },
                                                            ])
                                                        }}
                                                        style={{
                                                            padding: moderateScale(5),
                                                            alignItems: 'center',
                                                            alignSelf: 'center'
                                                        }}>
                                                        {/* <Ionicons
                                                        name="remove-circle-outline"
                                                        style={{
                                                            color: '#E14F50',
                                                            // '#355D9B',
                                                            fontSize: moderateScale(25),
                                                        }}
                                                    /> */}
                                                        <MaterialCommunityIcons
                                                            name='map-marker-remove-variant'
                                                            style={{
                                                                color: '#E14F50',
                                                                // '#355D9B',
                                                                fontSize: moderateScale(33),
                                                            }}
                                                        />
                                                    </Pressable>}
                                            </View>
                                        )}
                                </View>
                            );
                        })}
                    </View>
                    {(data?.allowSuggestMore || this.state.userEditAccess) &&
                        this.state.secondsTilEvent > 0 && (
                            <Button
                                title={'Suggest more'}
                                containerStyle={{
                                    flex: 1,
                                    //marginHorizontal: 10,
                                    marginTop: 10,
                                }}
                                type="outline"
                                buttonStyle={{
                                    padding: moderateScale(6),
                                    borderColor: 'rgba(238, 215, 255, 0.27)',
                                    //borderWidth: 0.5,
                                    backgroundColor: 'rgba(238, 215, 255, 0.27)',
                                }}
                                titleStyle={{
                                    color: 'red',
                                    fontFamily: 'Mulish',
                                    fontSize: 16,
                                }}
                                onPress={() => {
                                    this.props.navigation.navigate('SuggestLocation', {
                                        eventData: this.props.currentEvent,
                                    });
                                }}
                            />
                        )}
                </View>
            </>
        );
    };

    renderStats = () => {
        const { navigate } = this.props.navigation;

        let stats = [
            {
                title: 'Vendors',
                value: this.state.vendorsCount,
                icon: <SvgIcons.VendorsIcon />,
                onPress: () => {
                    navigate('EventVendorScreen');
                },
            },
            {
                title: 'Tasks',
                value: this.state.tasksCount,
                icon: <SvgIcons.CheckListIcon />,
                onPress: () => {
                    navigate('TasksParent');
                },
            },
        ];
        if (this.props.currentEvent.allowGuestList || this.state.userEditAccess) {
            stats.push({
                title: 'Guests',
                value: this.state.guestCount,
                icon: <SvgIcons.GuestsIcon />,
                onPress: () => {
                    //navigate("EventGuests") }
                    //console.log(this.scrollViewRef)
                    //this.scrollViewRef.scrollTo({ y: this.layout.y, animated: true })
                    this.scrollViewRef.scrollToPosition(0, this.layout.y);
                },
            });
        }
        if (this.props.currentEvent.userAccess) {
            stats.push({
                title: 'Budget',
                value: this.state.budget + '$',
                icon: <SvgIcons.BudgetIcon />,
                onPress: () => {
                    navigate('Budget');
                },
            });
        }

        return (
            <View
                style={{
                    flexDirection: 'row',
                    paddingVertical: moderateScale(5),
                    borderRadius: moderateScale(10),
                    marginBottom: moderateScale(10),
                    //borderWidth:1,
                    backgroundColor: '#fff',
                    alignItems: 'flex-start',
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.2,
                            shadowRadius: 1,
                        },
                        android: {
                            elevation: 1,
                        },
                    }),
                }}>
                {stats.map((each, index) => {
                    return (
                        <Pressable
                            key={each.title}
                            onPress={each.onPress}
                            style={{
                                //height: moderateScale(120),
                                flex: 1,
                                //marginLeft: index !== 0 ? moderateScale(3.5) : 0,
                                //borderRadius: moderateScale(10),
                                alignItems: 'center',
                                padding: moderateScale(8.5),
                                backgroundColor: '#fff',
                            }}>
                            <View
                                style={{
                                    width: moderateScale(54),
                                    height: moderateScale(54),
                                    borderRadius: moderateScale(27),
                                    backgroundColor: '#00ADEF',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <View
                                    style={{
                                        transform: [{ scale: moderateScale(0.95) }],
                                    }}>
                                    {each.icon}
                                </View>
                            </View>
                            <AppText
                                style={{
                                    color: '#355D9B',
                                    //fontFamily: 'Mulish-ExtraBold',
                                    fontSize: moderateScale(12.3),
                                }}>
                                {each.title}
                            </AppText>
                            <AppText
                                style={{
                                    color: '#88879C',
                                    fontSize: moderateScale(10),
                                }}>
                                {each.value}
                            </AppText>
                        </Pressable>
                    );
                })}
            </View>
        );
    };

    renderGuests = () => {
        const data = this.props.currentEvent;

        return (
            <GuestsList
                data={data}
                userEditAccess={
                    this.state.userEditAccess && this.state.secondsTilEvent > 0
                }
            />
        );
    };

    renderCountdown = () => {
        const { countdown } = this.state;

        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    //marginTop: 'auto'
                }}>
                {Object.keys(countdown).map((key, index) => {
                    if (key == "sec") {
                        return
                    }
                    return (
                        <View
                            key={key}
                            style={{
                                minHeight: verticalScale(60),
                                minWidth: moderateScale(60),
                                flexDirection: 'row',
                                alignItems: 'center',
                                flex: 1
                            }}>
                            {index !== 0 && (
                                <AppText
                                    style={{
                                        color: '#fff',
                                        fontSize: verticalScale(30),
                                        fontFamily: 'Mulish-ExtraBold',
                                        //marginTop: -verticalScale(8)
                                    }}>
                                    :
                                </AppText>
                            )}
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                }}>
                                <AppText
                                    style={{
                                        color: '#fff',
                                        fontSize: verticalScale(28),
                                        fontFamily: 'Mulish-Bold',
                                    }}>
                                    {countdown[key].value}
                                </AppText>
                                <AppText
                                    style={{
                                        color: '#fff',
                                        fontFamily: 'Mulish-Bold',
                                        fontSize: verticalScale(9),
                                    }}>
                                    {key.toUpperCase()}
                                </AppText>
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };

    renderImageWithCountdown = () => {
        const data = this.props.currentEvent;

        const category = data.eventTypeName;

        return (
            <View
                style={{
                    // alignItems: 'center',
                    //height: moderateScale(400)
                    //marginBottom: 45
                    marginBottom: moderateScale(10),
                }}>
                <ImageBackground
                    style={{
                        resizeMode: 'cover',
                        // flex: 1,
                        minHeight: moderateScale(170),
                        width: 'auto',

                        borderColor: '#355D9B',
                        position: 'relative',
                        zIndex: 10,
                    }}
                    imageStyle={{
                        // borderBottomLeftRadius: moderateScale(0),
                        // borderBottomRightRadius: moderateScale(0),
                        borderRadius: moderateScale(10),
                    }}
                    source={
                        data.imagePath
                            ? { uri: data?.imagePath }
                            : require('../../../assets/images/splashscreen.png')
                    }
                    onLayout={event => {
                        const { x, y, height, width } = event.nativeEvent.layout;
                        this.setState({ imgHeight: height });
                    }}
                // source={require("../../../assets/images/splashscreen.png")}
                >
                    <LinearGradient
                        colors={[
                            'rgba(0,0,0,0.4)',
                            'rgba(0,0,0,0.4)',
                            'rgba(0,0,0,0.4)',
                            'rgba(0,0,0,0.4)',
                            'rgba(0,0,0,0.4), ',
                            'rgba(0,0,0,0.4)',
                        ]}
                        style={{
                            flex: 1,
                            padding: moderateScale(10),
                            // borderBottomLeftRadius: moderateScale(0),
                            // borderBottomRightRadius: moderateScale(0),
                            borderRadius: moderateScale(10),
                        }}>
                        <View
                            style={{
                                //marginTop: verticalScale(30)
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{
                                    color: '#fff',
                                    fontSize: verticalScale(20),
                                    fontFamily: 'Mulish-Bold',
                                    fontWeight: 'bold',
                                    flex: 1,
                                }}>
                                {data?.name}
                            </Text>
                            <AppText
                                style={[{
                                    color: '#fff',
                                    fontSize: verticalScale(15),
                                    fontWeight: '500'
                                }]}>
                                {(category?.toLowerCase() !== 'custom' ||
                                    data.pollingStatus == 'ENDED') &&
                                    moment(data.timings[0].slot).format('DD MMM[,] YYYY')}
                            </AppText>

                            {/* <AppText
                            style={{
                                color: '#fff',
                                fontSize: verticalScale(18),
                                fontFamily: 'Mulish-Bold',
                                marginTop: verticalScale(20)
                            }}
                        >
                            {(category?.toLowerCase() !== "custom" || data.pollingStatus == "ENDED") && data?.locations[0]?.name}
                        </AppText> */}
                        </View>
                        <View style={{ marginVertical: moderateScale(14) }}>
                            {this.renderCountdown()}
                        </View>
                        {(category?.toLowerCase() !== 'custom' ||
                            data.pollingStatus == 'ENDED') && (
                                <View
                                    style={{
                                        alignItems: 'center',
                                        padding: moderateScale(10),
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        marginTop: 6,
                                        borderRadius: 6,
                                        flexDirection: "row",
                                        //justifyContent: "space-between"
                                        //borderBottomLeftRadius:10,borderBottomRightRadius:10
                                    }}>
                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontSize: verticalScale(12),
                                            fontWeight: '600',
                                            fontFamily: 'Mulish-Bold',
                                            width: "90%"
                                            //backgroundColor:"red"
                                            //marginTop: verticalScale(20)
                                        }}>
                                        {data?.locations[0]?.name}
                                    </Text>
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
                                        style={{
                                            // backgroundColor: 'white',
                                            //borderWidth: 1,
                                            borderRadius: moderateScale(4)

                                        }}>
                                        <MaterialCommunityIcons
                                            name="directions"
                                            style={{
                                                fontSize: moderateScale(30),
                                                color: 'rgba(0, 173, 239, 1)',
                                            }}
                                        />
                                    </Pressable>
                                </View>
                            )}
                    </LinearGradient>
                </ImageBackground>

                {/* <Image
                style={{
                    resizeMode: 'cover',
                    // flex: 1,
                    height: this.state.imgHeight + 15,
                    width: '90%',
                    borderBottomLeftRadius: moderateScale(50),
                    borderBottomRightRadius: moderateScale(50),
                    borderColor: '#355D9B',
                    position: 'absolute',
                    opacity: 0.5,
                    alignSelf: 'center',
                    zIndex: 2
                }}
                source={
                    data.imagePath
                        ? { uri: data?.imagePath }
                        : require("../../../assets/images/splashscreen.png")
                }
            />
            <Image
                style={{
                    resizeMode: 'cover',
                    height: this.state.imgHeight + 30,
                    width: '80%',
                    borderBottomLeftRadius: moderateScale(50),
                    borderBottomRightRadius: moderateScale(50),
                    borderColor: '#355D9B',
                    position: 'absolute',
                    zIndex: 1,
                    alignSelf: 'center',
                    opacity: 0.2
                }}
                source={
                    data.imagePath
                        ? { uri: data?.imagePath }
                        : require("../../../assets/images/splashscreen.png")
                }
            /> */}
            </View>
        );
    };

    renderEventEditableFields = () => {
        const data = this.props.currentEvent;
        const { formValue } = this.state;

        const category = data.eventTypeName;

        return (
            <View>
                {this.state.userEditAccess && (
                    <View style={styles.section}>
                        {this.state.formValue.eventName.inEditMode ? (
                            <View>
                                <Text style={styles.heading}>Event Name</Text>
                                <TextInput
                                    style={{
                                        color: '#88879C',
                                        borderBottomWidth: 1,
                                        fontSize: 17,
                                        paddingTop: moderateScale(10),
                                    }}
                                    onChangeText={val => {
                                        this.handleTextAndEditableUpdate('eventName', val, true);
                                        if (val == '') {
                                            this.setState({
                                                formValueEventNameErrMsg: 'Please Enter Valid Name',
                                            });
                                        } else {
                                            this.setState({ formValueEventNameErrMsg: '' });
                                        }
                                    }}
                                    value={this.state.formValue.eventName.value}
                                />
                                {
                                    <View style={{ padding: 3 }}>
                                        <Text style={{ color: 'red' }}>
                                            {this.state.formValueEventNameErrMsg}
                                        </Text>
                                    </View>
                                }
                            </View>
                        ) : (
                            <Pressable
                                onLongPress={() => {
                                    if (
                                        this.state.userEditAccess &&
                                        this.state.secondsTilEvent != 0
                                    ) {
                                        this.handleTextAndEditableUpdate(
                                            'eventName',
                                            this.state.formValue.eventName.value,
                                            true,
                                        );
                                    }
                                }}>
                                <Text style={styles.heading}>Event Name</Text>

                                <AppText style={styles.smallGreyText}>
                                    {this.state.formValue.eventName.value}
                                </AppText>
                            </Pressable>
                        )}
                    </View>
                )}

                {(category?.toLowerCase() !== 'custom' ||
                    data.pollingStatus == 'ENDED') &&
                    this.state.userEditAccess && (
                        <View style={styles.section}>
                            {this.state.formValue.address.inEditMode ? (
                                <View>
                                    <AppText style={[styles.heading]}>Location</AppText>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-start',
                                            paddingTop: moderateScale(7),
                                        }}>
                                        <GooglePlacesAutocomplete
                                            placeholder="Enter Address"
                                            enablePoweredByContainer={false}
                                            fetchDetails={true}
                                            onPress={(data, details) => {
                                                // 'details' is provided when fetchDetails = true
                                                //console.log( details);
                                                let val = {
                                                    name: data.description,
                                                    preference: 1,
                                                    latitude: details?.geometry.location.lat,
                                                    longitude: details?.geometry.location.lng,
                                                    //"vote": "PENDING",
                                                };
                                                this.handleTextAndEditableUpdate('address', val, true);
                                            }}
                                            query={{
                                                key: Config.GOOGLE_PLACE_API_KEY,
                                                language: 'en',
                                            }}
                                            styles={{
                                                textInput: {
                                                    borderRadius: moderateScale(6),
                                                    borderColor: 'rgba(53, 93, 155, 1)',
                                                    color: 'rgba(53, 93, 155, 1)',
                                                    padding: 6,
                                                    height: moderateScale(42),
                                                    borderWidth: 0.5,
                                                    marginRight: moderateScale(6),
                                                    minHeight: moderateScale(42),
                                                },
                                            }}
                                            textInputProps={
                                                {
                                                    /* onChangeText: (val) => {
                                                                      this.setState({addressTextInput:val})
                                                                  },
                                                                  value: this.state.addressTextInput, */
                                                    //placeholderTextColor: "rgba(53, 93, 155, 1)"
                                                }
                                            }
                                            keyboardShouldPersistTaps="handled"
                                            onFail={err => {
                                                console.log('error is ', err);
                                            }}
                                        />

                                        <View
                                            style={{
                                                width: moderateScale(40),
                                                height: moderateScale(40),
                                                borderRadius: moderateScale(30),
                                                backgroundColor: 'rgba(0, 173, 239, 1)',
                                                //marginTop: 5.6,
                                                borderColor: 'grey',
                                                //borderWidth: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                            <Feather
                                                name="map-pin"
                                                style={{
                                                    fontSize: 22,
                                                    color: '#fff',
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                <Pressable
                                    onLongPress={() => {
                                        if (
                                            this.state.userEditAccess &&
                                            this.props.currentEvent.eventTypeName != 'CUSTOM' &&
                                            this.state.secondsTilEvent != 0
                                        ) {
                                            this.handleTextAndEditableUpdate(
                                                'address',
                                                data.locations[0],
                                                true,
                                            );
                                        }
                                    }}>
                                    <AppText style={[styles.heading]}>Location</AppText>

                                    <AppText style={styles.smallGreyText}>
                                        {data.locations[0]?.name}
                                    </AppText>
                                </Pressable>
                            )}
                        </View>
                    )}
                {/* <View
                style={styles.nameContainer}
            >
                <AppText style={[styles.heading]}>Event Category</AppText>
                <AppText style={[styles.smallGreyText]}>{this.getEventCategoryName()}</AppText>

            </View> */}
                {(category?.toLowerCase() !== 'custom' ||
                    data.pollingStatus == 'ENDED') &&
                    this.state.userEditAccess && (
                        <>
                            {this.state.formValue.date.inEditMode ? (
                                <>
                                    <View style={styles.section}>
                                        {this.renderDateSelector()}
                                        <View style={{ height: moderateScale(11) }}></View>
                                        {this.renderTimeSelector()}
                                    </View>
                                </>
                            ) : (
                                <>
                                    <Pressable
                                        onLongPress={() => {
                                            if (
                                                this.state.userEditAccess &&
                                                this.props.currentEvent.eventTypeName != 'CUSTOM' &&
                                                this.state.secondsTilEvent != 0
                                            ) {
                                                this.handleTextAndEditableUpdate(
                                                    'date',
                                                    undefined,
                                                    true,
                                                );
                                            }
                                        }}>
                                        <View
                                            style={[
                                                styles.nameContainer,

                                            ]}>
                                            <AppText style={[styles.heading]}>
                                                {'Date & Time'}
                                            </AppText>
                                            <AppText style={[styles.smallGreyText]}>
                                                {moment(data.timings[0].slot).format('DD MMM[,] YYYY') +
                                                    (data.timings[0].startTime
                                                        ? '-' +
                                                        moment(data.timings[0].startTime, 'hh:mm').format(
                                                            'LT',
                                                        )
                                                        : '')}
                                            </AppText>
                                        </View>
                                    </Pressable>
                                </>
                            )}
                        </>
                    )}
            </View>
        );
    };

    renderDateSelector = () => {
        return (
            <View style={{ marginBottom: moderateScale(6) }}>
                <Text style={[styles.heading, { marginBottom: 10 }]}>Change Date</Text>
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
                    minimumDate={new Date()}
                    display={Platform.OS == 'ios' ? 'inline' : 'default'}
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
                <Text style={[styles.heading, { marginBottom: moderateScale(10) }]}>
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
                    <View
                        style={{
                            flex: 1,
                            marginLeft: moderateScale(6),
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
                {this.state.selectedStartTime > this.state.selectedEndTime
                    && <Text style={{ color: "red", paddingTop: 5 }}>End Time should be greater than Start Time</Text>
                }
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
    details = () => {
        const data = this.props.currentEvent;
        return <>
            <View style={[styles.nameContainer, { marginBottom: moderateScale(10), paddingVertical: moderateScale(0), }]}>
                <View
                    style={{
                        flexDirection: 'row',
                        padding: moderateScale(10),
                        alignItems: 'center',
                        borderWidth: 0.5,
                        borderColor: "#fff",
                        //borderBottomColor: "#FF69B4",
                        //borderBottomColor: "grey",
                        //borderRadius: moderateScale(10)
                    }}>

                    <Image
                        style={{
                            width: moderateScale(42),
                            height: moderateScale(42),
                            borderRadius: moderateScale(27),
                            borderWidth: 0.5,
                            borderColor: "grey"
                        }}

                        source={
                            data.hostImage
                                ? {
                                    uri: data.hostImage
                                }
                                : require("../../../assets/images/event.png")
                        }
                    />
                    <View
                        style={{
                            flex: 1,
                            paddingLeft: moderateScale(15),
                            flexDirection: "row",
                            alignItems: 'center',
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <View style={{}}>
                                <Text style={{ fontFamily: "Mulish", fontSize: moderateScale(13), color: '#87899C' }}>
                                    Hosted By</Text>
                                <Text style={{ fontFamily: "Mulish", fontSize: moderateScale(15), color: "#36454F" }}>
                                    {data?.hostName}</Text>
                            </View>
                            <Text style={{
                                fontSize: moderateScale(14),
                                //color: '#88879C',
                                //color: 'rgba(0, 173, 239, 1)'
                                color: "#355D9B"
                            }}>
                                {data?.hostPhone}
                            </Text>
                        </View>

                        <Pressable
                            onPress={() => {
                                if (data?.hostPhone) {
                                    Linking.openURL(`tel:${data?.hostPhone}`).catch(e => {
                                        console.log(e)
                                    })
                                }
                            }}
                            style={[styles.blueBox, { flexDirection: 'row', }, { marginRight: 7 }]}
                        >
                            <MaterialIcons name="call" size={20} color="#00ADEF" />
                        </Pressable>
                        {this.props?.userData?.id != data?.userId && <Pressable
                            style={[styles.blueBox, { flexDirection: 'row', marginLeft: moderateScale(7) }]}
                            onPress={() => {
                                let channel_id = "event-" + data.id
                                if (data.userId > this.props.userData.id) {
                                    channel_id = channel_id + "-onetoone-" + this.props.userData.id + "-" + data.userId
                                } else {
                                    channel_id = channel_id + "-onetoone-" + data.userId + "-" + this.props.userData.id
                                }

                                let obj = {
                                    channelId: channel_id,
                                    eventId: data.id,
                                    user1_id: this.props.userData.id,
                                    user2_id: data.userId
                                }
                                if (data?.chatInfo?.find(i => i.channelId == channel_id)) {
                                    this.props.navigation.navigate("Chat")
                                } else {
                                    addInviteeChat(data.id, obj, this.props.navigation)
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
                        </Pressable>}
                    </View>
                </View>

                {<View style={{
                    padding: moderateScale(10),
                    borderWidth: 0.5,
                    borderColor: "#fff",
                    //borderBottomColor: "#355D9B",
                    borderTopColor: "grey",
                    //borderRadius: moderateScale(10)
                }}
                >
                    <Text style={{ fontFamily: "Mulish", fontSize: moderateScale(13), color: "#87899C" }}>
                        Event Description</Text>
                    <View style={{ marginTop: moderateScale(3) }}></View>
                    {this.state.formValue.eventDescription.inEditMode ?
                        <>
                            <View>
                                <TextInput
                                    style={{
                                        fontFamily: "Mulish", fontSize: moderateScale(13), color: '#36454F'
                                        , borderBottomColor: '#000', borderBottomWidth: 1
                                    }}
                                    multiline={true}
                                    onChangeText={val => {
                                        this.handleTextAndEditableUpdate('eventDescription', val, true);
                                        if (val == '') {
                                            this.setState({
                                                formValueEventDescErrMsg: 'Event Description cannot be empty',
                                            });
                                        } else {
                                            this.setState({ formValueEventDescErrMsg: '' });
                                        }
                                    }}
                                    value={this.state.formValue.eventDescription.value}
                                />
                                {
                                    <View style={{ paddingVertical: 3 }}>
                                        <Text style={{ color: 'red' }}>
                                            {this.state.formValueEventDescErrMsg}
                                        </Text>
                                    </View>
                                }
                            </View>
                        </>
                        : <Pressable
                            onLongPress={() => {
                                if (
                                    this.state.userEditAccess &&
                                    this.state.secondsTilEvent != 0
                                ) {
                                    this.handleTextAndEditableUpdate(
                                        'eventDescription',
                                        this.state.formValue.eventDescription.value,
                                        true,
                                    );
                                }
                            }}>
                            <Text style={{ fontFamily: "Mulish", fontSize: moderateScale(13), color: '#36454F' }}>
                                {data?.description}</Text>
                        </Pressable>}

                </View>
                }
            </View>
        </>
    }
    shareEvent = () => {
        return <>
            <Pressable
                onPress={() => {
                    if (this.state.encryptEventId) {
                        Share.open({
                            //message: Config.RSVP_BASE_URL + this.props.currentEvent.id
                            message: Config.RSVP_BASE_URL + encodeURIComponent(this.state.encryptEventId)
                        }).then((res) => {
                            console.log(res);
                        }).catch((err) => {
                            console.log(err);
                        })
                    }
                }}
                style={[styles.section, { flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }]}>
                <Text style={{
                    fontFamily: "Mulish-ExtraBold",
                    color: '#355D9B',
                    flex: 1,
                    fontSize: moderateScale(15.5),
                }}>Share Event Invitation</Text>
                <Fontisto
                    name='share'
                    style={{
                        color: '#355D9B',
                        fontSize: moderateScale(21),
                        marginRight: moderateScale(3)
                    }}
                />
            </Pressable>
        </>
    }

    render() {
        const data = this.props.currentEvent;

        if (data == null) {
            return <></>;
        }
        return (
            <ImageBackground
                source={require('../../../assets/images/blurBG.png')}
                resizeMode="cover"
                imageStyle={{
                    width: '100%',
                    height: '100%',
                }}
                style={{
                    flex: 1,
                }}>
                <TopBar
                    style={{ backgroundColor: 'transparent' }}
                    title="Event Details"
                    middleComponent={this.state.secondsTilEvent > 0 ? <Pressable
                        onPress={() => {
                            if (this.state.encryptEventId) {
                                Share.open({
                                    //message: Config.RSVP_BASE_URL + this.props.currentEvent.id
                                    message: Config.RSVP_BASE_URL + encodeURIComponent(this.state.encryptEventId)
                                }).then((res) => {
                                    console.log(res);
                                }).catch((err) => {
                                    console.log(err);
                                })
                            }
                        }}
                    >

                        <Fontisto
                            name='share'
                            style={{
                                color: '#355D9B',
                                fontSize: moderateScale(20),
                                marginRight: moderateScale(3)
                            }}
                        />
                    </Pressable> : null}
                    rightComponent={
                        this.state.userEditAccess ? this.renderRightHeader() : null
                    }
                />
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="handled"
                    ref={ref => (this.scrollViewRef = ref)}
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }>
                    <View
                        style={{
                            marginHorizontal: moderateScale(20),
                        }}>
                        {this.renderImageWithCountdown()}
                        {this.details()}
                        {this.renderPolls()}
                        {this.renderLocations()}
                        {this.props?.currentEvent.tabAccess && this.renderStats()}
                        <View
                            // you can store layout for each of the fields
                            onLayout={event => (this.layout = event.nativeEvent.layout)}>
                            {(data.allowGuestList || this.state.userEditAccess) &&
                                this.renderGuests()}
                        </View>
                        {this.renderEventEditableFields()}
                        {this.state.secondsTilEvent > 0 && this.shareEvent()}
                    </View>
                </KeyboardAwareScrollView>
            </ImageBackground>
        );
    }
}

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create<Styles>({
    container: {
        flexGrow: 1,
        paddingBottom: moderateScale(50),
    },
    heading: {
        fontFamily: 'Mulish-ExtraBold',
        color: '#355D9B',
        fontSize: moderateScale(15.5),
    },
    smallGreyText: {
        color: '#88879C',
        fontSize: moderateScale(13),
        paddingTop: moderateScale(10),
    },
    nameContainer: {
        backgroundColor: '#fff',
        borderRadius: moderateScale(10),
        marginBottom: moderateScale(10),
        //minHeight: moderateScale(80),
        padding: moderateScale(10),
        justifyContent: 'space-around',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    section: {
        //minHeight: moderateScale(145),
        borderRadius: moderateScale(10),
        backgroundColor: '#fff',
        marginBottom: moderateScale(10),
        padding: moderateScale(10),
        //justifyContent: 'space-around'
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    blueBox: {
        width: moderateScale(30),
        height: moderateScale(30),
        borderRadius: moderateScale(4),
        //backgroundColor: "rgba(0, 173, 239, 1)",
        //marginTop: 5.6,
        borderColor: 'rgba(0, 173, 239, 1)',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapStateToProps = state => {
    const { eventsCategories } = state.events;
    const { currentEvent } = state.events;
    const { userData } = state.user;

    return {
        eventsCategories,
        currentEvent,
        userData,
    };
};

export default connect(mapStateToProps)(EventDetails);
