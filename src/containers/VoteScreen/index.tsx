import * as React from 'react';
import {
    View,
    ViewStyle,
    StyleSheet,
    Pressable,
    ImageBackground,
    Dimensions,
    Text,
    Platform,
} from 'react-native';

import TopBar from '../../components/TopBar';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import ReactNativePickerModule from 'react-native-picker-module';
import XDate from 'xdate';
import moment from 'moment';

import { moderateScale, verticalScale } from '../../utils/scalingUnits';

import AppText from '../../components/UI/AppText';
import AppButton from '../../components/UI/button';
import * as SvgImage from '../../assets/svg-icons';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { updateEvent } from '../../store/actionCreators';
import Config from 'react-native-config';
import { Button, Divider } from 'react-native-elements';
import { showErrorModalFunc } from '../../store/utilsSlice';
import { store } from '../../store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CheckBox from '@react-native-community/checkbox';
import ModalSelector from 'react-native-modal-selector';

const mS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
];

// const MONTHS = () => {
//     const months = []
//     const dateStart = moment('Jan', 'MMM')
//     const dateEnd = moment().add(12, 'month')
//     while (dateEnd.diff(dateStart, 'months') >= 0) {
//         months.push({
//             value: mS[dateStart.format('M') - 1],
//             label: mS[dateStart.format('M') - 1]
//         })
//         // dateStart.add(1, 'month')
//     }
//     return months
// }

const YEARS = () => {
    const years = [];
    const dateStart = moment();
    const dateEnd = moment().add(5, 'y');
    while (dateEnd.diff(dateStart, 'years') >= 0) {
        years.push(dateStart.format('YYYY'));
        dateStart.add(1, 'year');
    }
    return years;
};

const months = mS.map((i, j) => {
    return {
        label: i,
        key: j
    }
});
const years = YEARS().map((i, j) => {
    return {
        label: i,
        key: j
    }
});

// define types start

type Styles = {
    container: ViewStyle;
    timeSection: ViewStyle;
};

export type VoteTimeItem = {
    startTime: string;
    endTime: string;
    showStartTimePicker: boolean;
    showEndTimePicker: boolean;
    addToAlldates: boolean;
};

export type VoteDateItem = {
    date: string;
    times: {
        [key: string | number]: VoteTimeItem;
    };
};

type VoteScreenState = {
    selectedMonth: string;
    selectedYear: number;
    currentDate: Date;
    votedDates: {
        [key: string | number]: VoteDateItem;
    };
    editingEvent: boolean;
};

type VoteScreenProps = {};

// define types end

class VoteScreen extends React.Component<VoteScreenProps, VoteScreenState> {
    monthPickerRef = React.createRef();
    yearPickerRef = React.createRef();
    calenderRef = React.createRef();

    placesInputRef = React.createRef();

    state: VoteScreenState = {
        selectedMonth: mS[moment().month()],
        selectedYear: moment().year(),
        //
        currentDate: new Date(),
        //
        // vote data
        votedDates: undefined,

        currentInputVal: undefined,
        //
        locations: undefined,
        // votedDates: {
        //     "1632096000000": {
        //         "date": "2021-09-20T00:00:00.000Z",
        //         times: {
        //             1: {
        //                 startTime: '2021-09-20T00:00:00.000Z',
        //                 endTime: '2021-09-20T00:00:00.000Z'
        //             }
        //         }
        //     },

        // }
        editingEvent: false,
    };

    componentDidMount() {
        let votedLocations = this.props.route.params?.votedLocations;
        let votedDates = this.props.route.params?.votedDates;

        if (votedLocations) {
            let locations = votedLocations;
            this.setState({ locations });
        }
        if (votedDates) {
            let dates = JSON.parse(votedDates);
            this.setState({ votedDates: dates });
        }
        if (this.props.route.params?.editingEvent) {
            this.setState({ editingEvent: true });
        }
    }

    componentDidUpdate(prevProps) { }

    /**
     *
     * LOGIC HANDLING
     */

    // date logic

    removeDate = (key: number) => {
        // remove the date by the key (timestamp)
        let votedDates = { ...this.state.votedDates };

        delete votedDates[key];
        this.setState({ votedDates });
    };

    addDate = (date: Date) => {
        let votedDates = { ...this.state.votedDates };

        let present = Object.keys(votedDates).find(
            key =>
                moment(votedDates[key].date).format('DD-MM-YYYY') ===
                moment(date).format('DD-MM-YYYY'),
        );
        if (present) {
            this.removeDate(present);
            return;
        }
        // if 6 or above voted dates dont add anymore
        if (Object.keys(votedDates).length >= 5) {
            return;
        }
        let newDateVal = {
            date,
        };

        // append to votedDates Object
        // timestamp is object key
        votedDates[date.getTime()] = newDateVal;

        //console.log(moment(date).format('DD-MM-YYYY'))
        this.setState({ votedDates });
    };

    // time logic

    addTimeToDate = dateKey => {
        let votedDates = { ...this.state.votedDates };

        // timestamp is used as time key
        let timeKey = new Date().getTime();

        let dateObjToUpdate = votedDates[dateKey];
        if (dateObjToUpdate.times) {
            if (Object.keys(dateObjToUpdate.times).length >= 3) {
                return;
            }
        }
        let startT = moment().set('hour', 10).set('minute', 0);
        let endT = moment().set('hour', 11).set('minute', 0);

        // if initial add time key
        if (!dateObjToUpdate.times) {
            dateObjToUpdate['times'] = {};

            dateObjToUpdate['times'][timeKey] = {
                startTime: startT.toDate(),
                endTime: endT.toDate(),
                showStartTimePicker: false,
                showEndTimePicker: false,
            };
        } else {
            dateObjToUpdate['times'][timeKey] = {
                startTime: startT.toDate(),
                endTime: endT.toDate(),
                showStartTimePicker: false,
                showEndTimePicker: false,
            };
        }

        votedDates[dateKey] = dateObjToUpdate;

        this.setState({ votedDates });
    };

    updateTime = (dateKey, timeKey) => { };

    removeTimeFromDate = (dateKey, timeKey) => {
        let votedDates = { ...this.state.votedDates };

        delete votedDates[dateKey]['times'][timeKey];

        this.setState({ votedDates });
    };

    clearAllDateTimes = dateKey => {
        let votedDates = { ...this.state.votedDates };

        delete votedDates[dateKey].times;

        this.setState({ votedDates });
    };

    setStartTime = (dateKey, timeKey, date: Date) => {
        let votedDates = { ...this.state.votedDates };

        votedDates[dateKey]['times'][timeKey].startTime = date;

        this.setState({ votedDates });
    };

    setEndTime = (dateKey, timeKey, date: Date) => {
        let votedDates = { ...this.state.votedDates };

        votedDates[dateKey]['times'][timeKey].endTime = date;

        this.setState({ votedDates });
    };

    toggleStartTimePicker = (dateKey, timeKey, show: boolean) => {
        let votedDates = { ...this.state.votedDates };

        votedDates[dateKey]['times'][timeKey].showStartTimePicker = show;

        this.setState({ votedDates });
    };

    toggleEndTimePicker = (dateKey, timeKey, show: boolean) => {
        let votedDates = { ...this.state.votedDates };

        votedDates[dateKey]['times'][timeKey].showEndTimePicker = show;

        this.setState({ votedDates });
    };

    toggleAddToAllDates = (dateKey, timeKey, value: boolean) => {
        let votedDates = { ...this.state.votedDates };

        // change checkbox state
        votedDates[dateKey]['times'][timeKey].addToAlldates = value;

        // if true then add time to all dates
        if (value) {
            for (let eachDateKey in votedDates) {
                votedDates[eachDateKey]['times'] = {
                    ...votedDates[eachDateKey]['times'],
                    [timeKey]: { ...votedDates[dateKey]['times'][timeKey] },
                };
            }
        } else {
            // if false remove all times with that key in all dates
            for (let eachDateKey in votedDates) {
                // if time property isnt available
                if (votedDates[eachDateKey]['times']) {
                    if (votedDates[eachDateKey]['times'][timeKey]) {
                        // remove from other dates, and spare current date
                        if (dateKey !== eachDateKey) {
                            delete votedDates[eachDateKey]['times'][timeKey];
                        }
                    }
                }
            }
        }

        this.setState({ votedDates });
    };

    /***
     * LOCATION ADD AND REMOVE LOGIC
     */

    addLocation = location => {
        const locations = { ...this.state.locations };

        // if 3 or above voted dates dont add anymore
        if (Object.keys(locations).length >= 3) {
            return;
        }

        // append to location Object
        // random no is object key
        locations[Math.floor(1000 * Math.random())] = location;
        this.setState({ locations });
    };

    removeLocation = key => {
        const locations = { ...this.state.locations };

        delete locations[key];

        this.setState({ locations });
    };

    /**
     *
     * UI RENDERING
     */

    renderRightHeader = () => {
        const { votedDates, locations } = this.state;

        return (
            <Pressable
                style={{}}
                onPress={() => {
                    if (votedDates && Object.keys(votedDates).length != 0) {
                        if (this.state.editingEvent) {
                            let obj = { ...this.props.route.params?.eventData };
                            obj.eventId = obj.id;
                            let timingsApidata = [...obj.timings];

                            for (let dateKey in votedDates) {
                                if (
                                    !votedDates[dateKey]['times'] ||
                                    Object.keys(votedDates[dateKey]['times']).length === 0
                                ) {
                                    // if no time key, push like that
                                    timingsApidata.push({
                                        slot: moment(votedDates[dateKey]['date']).format(
                                            'YYYY-MM-DD',
                                        ),
                                        startTime: null,
                                        endTime: null,
                                        preference: 1,
                                        vote: 'PENDING',
                                        status: 'ADD',
                                    });
                                    // timingsApidata.push(parsedDates[dateKey])
                                } else {
                                    //console.log(" parsedDates[dateKey] ", parsedDates[dateKey])
                                    // if time key is available , loop through each
                                    for (let timeKey in votedDates[dateKey]['times']) {
                                        // push each into the unique array but with a "time" key this time

                                        delete votedDates[dateKey]['times'][timeKey][
                                            'showEndTimePicker'
                                        ];
                                        delete votedDates[dateKey]['times'][timeKey][
                                            'showStartTimePicker'
                                        ];

                                        if (
                                            !votedDates[dateKey]['times'][timeKey].startTime ||
                                            !votedDates[dateKey]['times'][timeKey].endTime
                                        ) {
                                            store.dispatch(
                                                showErrorModalFunc(
                                                    'Please check & select\nBoth start time and end time',
                                                ),
                                            );
                                            return;
                                        }

                                        timingsApidata.push({
                                            slot: moment(votedDates[dateKey]['date']).format(
                                                'YYYY-MM-DD',
                                            ),
                                            startTime: moment(
                                                votedDates[dateKey]['times'][timeKey].startTime,
                                            ).format('HH:mm'),
                                            endTime: moment(
                                                votedDates[dateKey]['times'][timeKey].endTime,
                                            ).format('HH:mm'),
                                            preference: 1,
                                            vote: 'PENDING',
                                            status: 'ADD',
                                        });
                                    }
                                }
                            }
                            obj.timings = timingsApidata;
                            //console.log(JSON.stringify(obj))
                            updateEvent(obj);
                            this.props.navigation.pop();
                        } else {
                            //console.log(votedDates)
                            for (let dateKey in votedDates) {
                                for (let timeKey in votedDates[dateKey]['times']) {
                                    /* if(!votedDates[dateKey]["times"][timeKey].startTime && !votedDates[dateKey]["times"][timeKey].endTime){
                                                      delete votedDates[dateKey]["times"][timeKey]
                                                      break
                                                  } */
                                    if (
                                        !votedDates[dateKey]['times'][timeKey].startTime ||
                                        !votedDates[dateKey]['times'][timeKey].endTime
                                    ) {
                                        store.dispatch(
                                            showErrorModalFunc(
                                                'Please check & select\nBoth start time and end time',
                                            ),
                                        );
                                        return;
                                    }
                                }
                            }

                            this.props.navigation.navigate('CreateEventScreen', {
                                ...this.props.route.params,
                                votedDates: JSON.stringify(votedDates),
                            });
                        }
                    }
                }}>
                <Feather
                    name="check"
                    style={{
                        fontSize: verticalScale(27),
                        color:
                            votedDates && Object.keys(votedDates).length != 0
                                ? '#355D9B'
                                : 'grey',
                    }}
                />
            </Pressable>
        );
    };

    renderCalenderHeader = date => {
        const { selectedMonth, selectedYear } = this.state;

        return (
            <>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}>
                    <ModalSelector
                        overlayStyle={{ paddingVertical: verticalScale(100), }}
                        data={months}
                        initValue={selectedMonth}
                        onChange={(option) => {
                            let value = option.label
                            let momentDateObj = moment(`${value} ${selectedYear}`, 'MMM YYYY');

                            const XdateObj = new XDate(
                                momentDateObj.year(),
                                momentDateObj.month(),
                                parseInt(momentDateObj.format('DD')),
                            );

                            if (this.calenderRef.current) {
                                this.calenderRef.current.updateMonth(XdateObj, true);
                            }
                            this.setState({ selectedMonth: value });
                        }}
                        header={
                            <View style={{ marginBottom: 5, alignItems: 'center', }}>
                                <Text style={{ fontSize: moderateScale(15), color: 'black',fontFamily:"Mulish" }}>Select Month</Text>
                            </View>
                        }
                        optionTextStyle={{fontFamily:"Mulish"}}
                        cancelTextStyle={{fontFamily:"Mulish"}}
                        cancelText="Close"
                    >
                        <View
                            //onPress={() => this.monthPickerRef.current.show()}
                            style={{
                                backgroundColor: 'rgba(248, 247, 250, 1)',
                                justifyContent: 'center',
                                borderRadius: moderateScale(4),
                                alignItems: 'center',
                                height: moderateScale(40),
                                width: moderateScale(75),
                                flexDirection: 'row',
                            }}>
                            <AppText
                                style={{
                                    color: 'rgba(53, 93, 155, 1)',
                                    fontSize: moderateScale(14),
                                }}>
                                {selectedMonth ? selectedMonth : 'Month'}
                            </AppText>
                            <MaterialIcons
                                name="arrow-drop-down"
                                style={{
                                    color: 'rgba(53, 93, 155, 1)',
                                    fontSize: 20,
                                }}
                            />
                        </View>
                    </ModalSelector>

                    <ModalSelector
                        overlayStyle={{ paddingVertical: verticalScale(100), }}
                        data={years}
                        initValue={String(selectedYear)}
                        onChange={(option) => {
                            let value = option.label
                            let momentDateObj = moment(`${selectedMonth} ${value}`, 'MMM YYYY');

                            const XdateObj = new XDate(
                                momentDateObj.year(),
                                momentDateObj.month(),
                                parseInt(momentDateObj.format('DD')),
                            );

                            if (this.calenderRef.current) {
                                this.calenderRef.current.updateMonth(XdateObj, true);
                            }
                            this.setState({ selectedYear: value });
                        }}
                        header={
                            <View style={{ marginBottom: 5, alignItems: 'center', }}>
                                <Text style={{ fontSize: moderateScale(15), color: 'black',fontFamily:"Mulish" }}>Select Year</Text>
                            </View>
                        }
                        optionTextStyle={{fontFamily:"Mulish"}}
                        cancelTextStyle={{fontFamily:"Mulish"}}
                        cancelText="Close"
                    >
                        <View
                            //onPress={() => this.yearPickerRef.current.show()}
                            style={{
                                backgroundColor: '#fff',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: moderateScale(40),
                                flexDirection: 'row',
                                width: moderateScale(75),
                            }}>
                            <AppText>{selectedYear ? selectedYear : 'Year'}</AppText>
                            <MaterialIcons
                                name="keyboard-arrow-down"
                                style={{
                                    color: 'grey',
                                    fontSize: 20,
                                }}
                            />
                        </View>
                    </ModalSelector>
                </View>

                {/* <ReactNativePickerModule
                    ref={this.monthPickerRef}
                    value={selectedMonth}
                    title={'Select month'}
                    items={months}
                    titleStyle={{ color: 'white' }}
                    itemStyle={{ color: 'white' }}
                    selectedColor="rgba(53, 93, 155, 1)"
                    confirmButtonEnabledTextStyle={{ color: 'white' }}
                    confirmButtonDisabledTextStyle={{ color: 'grey' }}
                    cancelButtonTextStyle={{ color: 'white' }}
                    confirmButtonStyle={{
                        backgroundColor: 'rgba(0,0,0,1)',
                    }}
                    cancelButtonStyle={{
                        backgroundColor: 'rgba(0,0,0,1)',
                    }}
                    contentContainerStyle={{
                        backgroundColor: 'rgba(0,0,0,1)',
                    }}
                    onCancel={() => {
                        console.log('Cancelled');
                    }}
                    onValueChange={value => {
                        let momentDateObj = moment(`${value} ${selectedYear}`, 'MMM YYYY');

                        const XdateObj = new XDate(
                            momentDateObj.year(),
                            momentDateObj.month(),
                            parseInt(momentDateObj.format('DD')),
                        );

                        if (this.calenderRef.current) {
                            this.calenderRef.current.updateMonth(XdateObj, true);
                        }
                        this.setState({ selectedMonth: value });
                    }}
                />
                <ReactNativePickerModule
                    pickerRef={this.yearPickerRef}
                    value={selectedYear}
                    title={'Select year'}
                    items={years}
                    titleStyle={{ color: 'white' }}
                    itemStyle={{ color: 'white' }}
                    selectedColor="rgba(53, 93, 155, 1)"
                    confirmButtonEnabledTextStyle={{ color: 'white' }}
                    confirmButtonDisabledTextStyle={{ color: 'grey' }}
                    cancelButtonTextStyle={{ color: 'white' }}
                    confirmButtonStyle={{
                        backgroundColor: 'rgba(0,0,0,1)',
                    }}
                    cancelButtonStyle={{
                        backgroundColor: 'rgba(0,0,0,1)',
                    }}
                    contentContainerStyle={{
                        backgroundColor: 'rgba(0,0,0,1)',
                    }}
                    onCancel={() => {
                        console.log('Cancelled');
                    }}
                    onValueChange={value => {
                        let momentDateObj = moment(`${selectedMonth} ${value}`, 'MMM YYYY');

                        const XdateObj = new XDate(
                            momentDateObj.year(),
                            momentDateObj.month(),
                            parseInt(momentDateObj.format('DD')),
                        );

                        if (this.calenderRef.current) {
                            this.calenderRef.current.updateMonth(XdateObj, true);
                        }
                        this.setState({ selectedYear: value });
                    }}
                /> */}
            </>
        );
    };

    renderCalender = () => {
        const { votedDates } = this.state;
        let markedDates = {};

        if (votedDates) {
            for (let key in votedDates) {
                markedDates[moment(votedDates[key].date).format('YYYY-MM-DD')] = {
                    selected: true,
                    selectedColor: '#355D9B',
                };
            }
        }

        return (
            <View
                style={{
                    padding: moderateScale(15),
                    borderRadius: moderateScale(10),
                    backgroundColor: '#fff',
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 1,
                        },
                        android: {
                            elevation: 1,
                        },
                    }),
                }}>
                {this.renderCalenderHeader()}
                <Calendar
                    ref={this.calenderRef}
                    minDate={new Date()}
                    markedDates={markedDates}
                    current={moment(this.state.currentDate).format('YYYY-MM-DD')}
                    hideArrows={true}
                    renderHeader={() => <View />}
                    onDayPress={day => {
                        this.addDate(new Date(day.year, day.month - 1, day.day));
                    }}
                    firstDay={1}
                />
            </View>
        );
    };

    renderVoteDates = () => {
        const { votedDates } = this.state;

        if (!votedDates) {
            return;
        }

        let sortedDateKeys = Object.keys(votedDates).sort((x, y) => x - y);

        return (
            <View
                style={{
                    marginTop: moderateScale(20),
                }}>
                {sortedDateKeys.map(key => {
                    const momentObj = moment(Date.parse(votedDates[key].date));
                    return (
                        <View
                            key={key}
                            style={{
                                marginBottom: moderateScale(10),
                            }}>
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: 10,
                                    ...Platform.select({
                                        ios: {
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 1,
                                        },
                                        android: {
                                            elevation: 1,
                                        },
                                    }),
                                    padding: 10,
                                    marginVertical: 5,
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: moderateScale(22),
                                            color: 'rgba(53, 93, 155, 1)',
                                            fontFamily: 'Mulish-Bold',
                                        }}>
                                        {mS[momentObj.month()] + ' ' + momentObj.format('DD')}
                                    </Text>
                                    <Pressable
                                        onPress={() => {
                                            this.removeDate(key);
                                        }}
                                        style={{
                                            padding: 10,
                                            transform: [{ scale: moderateScale(1.4) }],
                                        }}>
                                        <SvgImage.DeleteIcon />
                                    </Pressable>
                                </View>
                                <Divider style={{ marginTop: 10, marginBottom: 5 }} />
                                {
                                    // if vote date contains any time render it
                                    votedDates[key].times
                                        ? this.renderTimes(key, votedDates[key].times)
                                        : undefined
                                }
                                <Pressable
                                    onPress={() => {
                                        this.addTimeToDate(key);
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: 5,
                                        marginTop: 5,
                                    }}>
                                    <MaterialCommunityIcons
                                        name="plus"
                                        style={{ fontSize: 22, color: '#355D9B' }}
                                    />
                                    <Text>
                                        <AppText
                                            style={{
                                                color: 'rgba(53, 93, 155, 1)',
                                                fontFamily: 'Mulish-Regular',
                                                marginLeft: moderateScale(6),
                                                //flex:1
                                            }}>
                                            Add time range{' '}
                                        </AppText>
                                        <AppText style={{ color: '#929599' }}>{'(optional)'}</AppText>
                                    </Text>
                                </Pressable>
                            </View>

                            {/* <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        minHeight: moderateScale(100),
                        marginBottom: moderateScale(10),
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            color: '#00ADEF',
                            fontSize: moderateScale(12),
                            fontFamily: 'Mulish-ExtraBold'
                        }}>{mS[momentObj.month()]}</Text>
                        <Text
                            style={{
                                fontSize: moderateScale(32),
                                color: '#88879C',
                                fontFamily: 'Mulish-ExtraBold'
                            }}
                        >{momentObj.format('DD')}</Text>
                    </View>
                    {
                        // if vote date contains any time render it
                        votedDates[key].times ? this.renderTimes(key, votedDates[key].times) : undefined
                    }
                    {
                        // if no time then show Full day bar
                        !(votedDates[key].times && Object.keys(votedDates[key].times).length > 0) && <View style={{
                            minHeight: moderateScale(36),
                            borderRadius: moderateScale(10),
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            marginBottom: moderateScale(10)
                        }}>
                            <Text style={{
                                fontFamily: 'Mulish-ExtraBold',
                                color: '#88879C',
                                fontSize: moderateScale(21),
                            }}>Full Day</Text>
                        </View>
                    }
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <AppButton
                            title="Add Time"
                            clicked={() => this.addTimeToDate(key)}
                            style={{ height: moderateScale(40), flex: 1 }}
                        />
                        {
                            votedDates[key].times && Object.keys(votedDates[key].times).length > 0 && <AppButton
                                title="Clear"
                                clicked={() => this.clearAllDateTimes(key)}
                                style={{
                                    height: moderateScale(40),
                                    backgroundColor: '#00ADEF',
                                    flex: 1
                                }}
                            />
                        }
                        <AppButton
                            clicked={() => this.removeDate(key)}
                            title="Delete"
                            style={{
                                height: moderateScale(40),
                                flex: 1,
                                backgroundColor: '#E14F50'
                            }}
                        />
                    </View> */}
                        </View>
                    );
                })}
            </View>
        );
    };

    renderTimes = (dateKey, times) => {
        return Object.keys(times).map(key => {
            const timeObject: VoteTimeItem = times[key];

            return (
                <View
                    key={key}
                    style={
                        {
                            //marginBottom: moderateScale(15),
                        }
                    }>
                    <View style={styles.timeSection}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <View
                                style={{
                                    flex: 1,
                                }}>
                                <AppText
                                    style={{
                                        marginBottom: 3,
                                        fontSize: 14,
                                        color: 'rgba(53, 93, 155, 1)',
                                    }}>
                                    Starts at
                                </AppText>
                                <Pressable
                                    onPress={() => this.toggleStartTimePicker(dateKey, key, true)}
                                    style={{
                                        borderRadius: moderateScale(10),
                                        borderColor: 'rgba(53, 93, 155, 1)',
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
                                    {timeObject.startTime ? (
                                        <AppText
                                            style={{
                                                color: 'rgba(53, 93, 155, 1)',
                                                fontFamily: 'Mulish-Regular',
                                                marginLeft: moderateScale(6),
                                            }}>
                                            {moment(timeObject.startTime).format('hh:mm A')}
                                        </AppText>
                                    ) : (
                                        <AppText
                                            style={{
                                                color: 'grey',
                                                fontFamily: 'Mulish-Regular',
                                                marginLeft: moderateScale(6),
                                            }}>
                                            Select Time
                                        </AppText>
                                    )}
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
                                <AppText
                                    style={{
                                        marginBottom: 3,
                                        fontSize: 14,
                                        color: 'rgba(53, 93, 155, 1)',
                                    }}>
                                    Ends at
                                </AppText>
                                <Pressable
                                    onPress={() => this.toggleEndTimePicker(dateKey, key, true)}
                                    style={{
                                        borderRadius: moderateScale(10),
                                        borderColor: 'rgba(53, 93, 155, 1)',
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
                                    {timeObject.endTime ? (
                                        <AppText
                                            style={{
                                                color: 'rgba(53, 93, 155, 1)',
                                                fontFamily: 'Mulish-Regular',
                                                marginLeft: moderateScale(6),
                                            }}>
                                            {moment(timeObject.endTime).format('hh:mm A')}
                                        </AppText>
                                    ) : (
                                        <AppText
                                            style={{
                                                color: 'grey',
                                                fontFamily: 'Mulish-Regular',
                                                marginLeft: moderateScale(6),
                                            }}>
                                            Select Time
                                        </AppText>
                                    )}
                                    <Ionicons
                                        name="time-outline"
                                        size={24}
                                        color="rgba(0, 173, 239, 1)"
                                    />
                                </Pressable>
                            </View>
                            <Pressable
                                onPress={() => this.removeTimeFromDate(dateKey, key)}
                                style={{
                                    padding: 10,
                                    marginLeft: 5,
                                    transform: [{ scale: moderateScale(1.4) }],
                                }}>
                                <SvgImage.DeleteIcon />
                            </Pressable>
                        </View>
                        {timeObject.startTime > timeObject.endTime
                            && <Text style={{ color: "red", paddingTop: 5 }}>End Time should be greater than Start Time</Text>
                        }

                        <DateTimePickerModal
                            isVisible={timeObject.showStartTimePicker}
                            mode="time"
                            date={new Date(timeObject.startTime)}
                            onConfirm={date => {
                                this.setStartTime(dateKey, key, date);
                                this.toggleStartTimePicker(dateKey, key, false);
                                // this.setState({ startTime: date, showStartTimePicker: false })
                            }}
                            onCancel={() => this.toggleStartTimePicker(dateKey, key, false)}
                        />
                        <DateTimePickerModal
                            isVisible={timeObject.showEndTimePicker}
                            mode="time"
                            date={new Date(timeObject.endTime)}
                            onConfirm={date => {
                                this.setEndTime(dateKey, key, date);
                                this.toggleEndTimePicker(dateKey, key, false);
                                // this.setState({ endTime: date, showEndTimePicker: false })
                            }}
                            onCancel={() => this.toggleEndTimePicker(dateKey, key, false)}
                        />
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            transform: [{ scale: moderateScale(0.9) }]
                        }}>
                            <CheckBox
                                tintColors={{
                                    true: '#355D9B',
                                    false: '#355D9B'
                                }}
                                value={timeObject.addToAlldates}
                                onValueChange={(newValue) => this.toggleAddToAllDates(dateKey, key, newValue)}
                            />
                        </View>
                        <Text
                            style={{
                                color: '#355D9B'
                            }}
                        >Add to all dates</Text>
                    </View>
                    <Divider />
                </View>
            );
        });
    };

    renderLocations = () => {
        const { locations } = this.state;

        return (
            <View
                style={{
                    backgroundColor: '#fff',
                    borderRadius: moderateScale(10),
                    marginTop: moderateScale(30),
                    marginBottom: moderateScale(20),
                    padding: moderateScale(20),
                }}>
                <View
                    style={{
                        borderRadius: moderateScale(10),
                        borderColor: '#00ADEF',
                        minHeight: moderateScale(42),
                        borderWidth: 0.5,
                        flexDirection: 'row',
                        // justifyContent: 'center',
                        alignItems: 'flex-start',
                        paddingHorizontal: moderateScale(8),
                    }}>
                    <MaterialCommunityIcons
                        name="map-outline"
                        style={{
                            fontSize: moderateScale(22),
                            color: '#00ADEF',
                            marginLeft: moderateScale(4),
                            marginTop: moderateScale(12),
                        }}
                    />
                    <GooglePlacesAutocomplete
                        ref={this.placesInputRef}
                        placeholder="SEARCH ON GOOGLE"
                        enablePoweredByContainer={false}
                        onPress={(data, details = null) => {
                            // 'details' is provided when fetchDetails = true
                            // console.log(data, details);
                            this.addLocation(data.description);
                            this.placesInputRef.current.clear();
                        }}
                        query={{
                            key: Config.GOOGLE_PLACE_API_KEY,
                            language: 'en',
                        }}
                        styles={{
                            textInput: {
                                color: '#000',
                                // borderRadius: moderateScale(10),
                                // borderColor: 'rgba(53, 93, 155, 1)',
                                // color: 'rgba(53, 93, 155, 1)',
                                // padding: 6,
                                // height: moderateScale(42),
                                // borderWidth: 0.5,
                                // marginRight: moderateScale(6)
                            },
                        }}
                        textInputProps={{
                            // onChangeText: (val) => this.setState({ location: val })
                            value: this.state.currentInputVal, // undefined value
                        }}
                    // keyboardShouldPersistTaps="handled"
                    />
                    {/* <TextInput
                    style={{
                        marginLeft: moderateScale(10),
                        fontSize: moderateScale(15)
                    }}
                    placeholder=""
                /> */}
                </View>
                {locations &&
                    Object.keys(locations).map((key, index) => {
                        return (
                            <View
                                key={index}
                                style={{
                                    flexDirection: 'row',
                                    height: moderateScale(65),
                                    alignItems: 'center',
                                    borderBottomWidth: 0.5,
                                    borderColor: '#355D9B',
                                }}>
                                <AppText style={{ flex: 0.8, color: '#88879C' }}>
                                    {locations[key]}
                                </AppText>
                                <Pressable
                                    onPress={() => this.removeLocation(key)}
                                    style={{
                                        marginLeft: 'auto',
                                        marginTop: moderateScale(9),
                                        transform: [{ scale: moderateScale(1.03) }],
                                    }}>
                                    <SvgImage.DeleteIcon />
                                </Pressable>
                            </View>
                        );
                    })}
            </View>
        );
    };

    render() {
        return (
            <ImageBackground
                source={require('../../assets/images/blurBG.png')}
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
                    title="Poll: When to meet"
                //rightComponent={this.renderRightHeader()}
                />
                <KeyboardAwareScrollView
                    bounces={true}
                    extraHeight={verticalScale(100)}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.container}>
                    <View
                        style={{
                            marginHorizontal: 20,
                            flex: 1,
                        }}>
                        <AppText
                            style={{ alignSelf: 'center', marginBottom: 10, color: '#355D9B' }}>
                            Choose up to 5 dates
                        </AppText>
                        {this.renderCalender()}
                        {this.renderVoteDates()}

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 7,
                            }}>
                            <Button
                                title="Create Poll"
                                containerStyle={{
                                    flex: 1,
                                }}
                                buttonStyle={{
                                    height: moderateScale(45),
                                    padding: 4,
                                    borderRadius: moderateScale(6),
                                    //elevation: 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginHorizontal: 2,
                                    backgroundColor: '#355D9B',
                                }}
                                titleStyle={{
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    fontFamily: 'Mulish',
                                    fontSize: moderateScale(18),
                                }}
                                onPress={() => {
                                    const { votedDates, locations } = this.state;
                                    console.log(votedDates)
                                    if (votedDates && Object.keys(votedDates).length != 0) {
                                        if (this.state.editingEvent) {
                                            let obj = { ...this.props.route.params?.eventData };
                                            obj.eventId = obj.id;
                                            let timingsApidata = [...obj.timings];

                                            for (let dateKey in votedDates) {
                                                if (
                                                    !votedDates[dateKey]['times'] ||
                                                    Object.keys(votedDates[dateKey]['times']).length === 0
                                                ) {
                                                    // if no time key, push like that
                                                    timingsApidata.push({
                                                        slot: moment(votedDates[dateKey]['date']).format(
                                                            'YYYY-MM-DD',
                                                        ),
                                                        startTime: null,
                                                        endTime: null,
                                                        preference: 1,
                                                        vote: 'PENDING',
                                                        status: 'ADD',
                                                    });
                                                    // timingsApidata.push(parsedDates[dateKey])
                                                } else {
                                                    //console.log(" parsedDates[dateKey] ", parsedDates[dateKey])
                                                    // if time key is available , loop through each
                                                    if (votedDates[dateKey].times) {
                                                        let invalidTime = false
                                                        var timesArr = Object.values(
                                                            votedDates[dateKey]['times'],
                                                        ).map(item => {
                                                            if (item.startTime > item.endTime) {
                                                                invalidTime = true
                                                            }
                                                            return moment(item.startTime).format('LT')
                                                        });
                                                        if (invalidTime) {
                                                            return;
                                                        }
                                                        var isDuplicate = timesArr.some(
                                                            (item, idx) => timesArr.indexOf(item) != idx,
                                                        );
                                                        if (isDuplicate) {
                                                            store.dispatch(
                                                                showErrorModalFunc(
                                                                    'Cannot create poll with same times for a date',
                                                                ),
                                                            );
                                                            return;
                                                        }

                                                    }

                                                    for (let timeKey in votedDates[dateKey]['times']) {
                                                        // push each into the unique array but with a "time" key this time

                                                        delete votedDates[dateKey]['times'][timeKey][
                                                            'showEndTimePicker'
                                                        ];
                                                        delete votedDates[dateKey]['times'][timeKey][
                                                            'showStartTimePicker'
                                                        ];

                                                        if (
                                                            !votedDates[dateKey]['times'][timeKey]
                                                                .startTime ||
                                                            !votedDates[dateKey]['times'][timeKey].endTime
                                                        ) {
                                                            store.dispatch(
                                                                showErrorModalFunc(
                                                                    'Please check & select\nBoth start time and end time',
                                                                ),
                                                            );
                                                            return;
                                                        }

                                                        timingsApidata.push({
                                                            slot: moment(votedDates[dateKey]['date']).format(
                                                                'YYYY-MM-DD',
                                                            ),
                                                            startTime: moment(
                                                                votedDates[dateKey]['times'][timeKey].startTime,
                                                            ).format('HH:mm'),
                                                            endTime: moment(
                                                                votedDates[dateKey]['times'][timeKey].endTime,
                                                            ).format('HH:mm'),
                                                            preference: 1,
                                                            vote: 'PENDING',
                                                            status: 'ADD',
                                                        });
                                                    }
                                                }
                                            }
                                            obj.timings = timingsApidata;
                                            if (timingsApidata.length > 5) {
                                                store.dispatch(showErrorModalFunc("Cannot add more than 5 Polls"))
                                                return
                                            }
                                            //console.log(JSON.stringify(obj))
                                            updateEvent(obj);
                                            this.props.navigation.pop();
                                        } else {
                                            //console.log(votedDates)
                                            let total = 0
                                            for (let dateKey in votedDates) {

                                                if (votedDates[dateKey].times) {
                                                    let invalidTime = false

                                                    var timesArr = Object.values(votedDates[dateKey]['times'])
                                                        .map(item => {
                                                            if (item.startTime > item.endTime) {
                                                                invalidTime = true
                                                            }
                                                            return moment(item.startTime).format('LT')
                                                        });
                                                    if(invalidTime){
                                                        return
                                                    }

                                                    var isDuplicate = timesArr.some(
                                                        (item, idx) => timesArr.indexOf(item) != idx,
                                                    );
                                                    if (isDuplicate) {
                                                        store.dispatch(
                                                            showErrorModalFunc(
                                                                'Cannot create poll with same times for a date',
                                                            ),
                                                        );
                                                        return;
                                                    }
                                                    total = total + Object.values(votedDates[dateKey]['times']).length
                                                } else {
                                                    total = total + 1
                                                }

                                                /* for (let timeKey in votedDates[dateKey]["times"]) {
                                                                        /* if(!votedDates[dateKey]["times"][timeKey].startTime && !votedDates[dateKey]["times"][timeKey].endTime){
                                                                            delete votedDates[dateKey]["times"][timeKey]
                                                                            break
                                                                        } /
                                                                        console.log(votedDates[dateKey]["times"][timeKey])
                                                                        if (!votedDates[dateKey]["times"][timeKey].startTime || !votedDates[dateKey]["times"][timeKey].endTime) {
                                                                            store.dispatch(showErrorModalFunc("Please check & select\nBoth start time and end time"))
                                                                            return
                                                                        }
                                                                        
                                                                    } */
                                            }
                                            if (total > 5) {
                                                store.dispatch(showErrorModalFunc("Cannot add more than 5 Polls"))
                                                return
                                            }

                                            this.props.navigation.navigate('CreateEventScreen', {
                                                ...this.props.route.params,
                                                votedDates: JSON.stringify(votedDates),
                                            });
                                        }
                                    }
                                }}
                            />
                            {/*true//this.state.editingEvent
                            ? <></>
                            : <AppButton
                                title="Discard"
                                style={{ height: moderateScale(40), flex: 1, backgroundColor: '#00ADEF' }}
                                clicked={() => {
                                    this.props.navigation.navigate("CreateEventScreen")
                                }}
                            />} */}
                        </View>
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
        paddingBottom: 50,
    },
    timeSection: {
        minHeight: moderateScale(74),
        borderRadius: moderateScale(6),
        //backgroundColor: 'red',
        // marginBottom: moderateScale(15),
        paddingVertical: moderateScale(10),
        justifyContent: 'space-around',
    },
});

export default VoteScreen;
