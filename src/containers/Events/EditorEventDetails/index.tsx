import * as React from 'react'
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
    TextInput
} from 'react-native';


import TopBar from '../../../components/TopBar'
import Text from '../../../components/UI/AppText'

import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import * as SvgIcons from '../../../assets/svg-icons'
import { moderateScale, verticalScale } from '../../../utils/scalingUnits';
import PollItem from '../../../components/PollItem';

import { PollDateType } from '../HostEventConfirm'

import { launchCamera, launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import moment from 'moment';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { getEventsCategories } from '../../../store/actionCreators';

type Styles = {
    container: ViewStyle,
    heading: TextStyle
}

class EditorEventDetails extends React.Component {

    state = {
        selectedImage: undefined,
        //
        countdown: {
            days: {
                value: undefined
            },
            hours: {
                value: undefined
            },
            min: {
                value: undefined
            },
            sec: {
                value: undefined
            }
        },
        //
        formValue: {
            eventName: {
                value: undefined
            },
            address: {
                value: undefined
            },
        }
    }

    countdownInterval = undefined

    componentDidMount() {
        const data = this.props.route.params?.data

        if (!this.props.eventsCategories) {
            getEventsCategories()
        }

        this.setDefaultFormValues()

        // duration is seconds from event date till now
        const duration = moment(data?.createdDate).diff(moment(), "seconds")
        const startTime = Date.now()

        this.countdownUpdateFunc(duration, startTime)
        this.countdownInterval = setInterval(() => this.countdownUpdateFunc(duration, startTime), 1000)
    }

    componentDidUpdate(prevProps) {
        if (this.props.route.params?.data !== prevProps.route?.params?.data) {
            this.setDefaultFormValues()
        }
    }

    componentWillUnmount() {
        clearInterval(this.countdownInterval)
    }

    /** form handers start */
    setDefaultFormValues = () => {
        let formValue = { ...this.state.formValue }
        const data = this.props.route.params?.data

        formValue.address.value = data?.locations[0].name
        formValue.eventName.value = data?.name

        this.setState({ formValue })
    }

    handleTextChange = (key, value) => {
        let formValue = { ...this.state.formValue }

        formValue[key].value = value;

        this.setState({ formValue })
    }

    /** form handlers end */

    countdownUpdateFunc = (duration, start) => {
        let diff,
            minutes,
            seconds,
            hours = 0,
            days = 0
            ;
        // get the number of seconds that have elapsed since
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        // if its 00:00 dont subtract again
        if (minutes < 0 && seconds < 0) {
            minutes = 0
            seconds = 0
        }

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        if (minutes > 60) {
            hours = (minutes / 60) | 0
            minutes = (minutes % 60) | 0;
        }
        if (hours > 24) {
            days = (hours / 24) | 0
            hours = (hours % 24) | 0;
        }

        // const display = days + ':::' + hours + "::" + minutes + ":" + seconds;

        let countdown = { ...this.state.countdown }
        countdown.days.value = days;
        countdown.hours.value = hours;
        countdown.min.value = minutes;
        countdown.sec.value = seconds;

        this.setState({ countdown })

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            start = Date.now() + 1000;
        }

    }

    calculatePollNo = (data: Array) => {
        if (Array.isArray(data)) {
            let trueNo = data.filter((each) => each.vote == true).length
            let falseNo = data.filter((each) => each.vote == false).length
            return {
                trueNo,
                falseNo
            }
        } else {
            return {
                trueNo: 0,
                falseNo: 0
            }
        }
    }

    getEventCategoryName = () => {
        const { eventsCategories } = this.props
        const data = this.props.route.params?.data

        let name
        if (eventsCategories) {
            let nameObj = eventsCategories.filter((each) => each.eventTypeId == data?.eventTypeId)[0]
            name = nameObj ? nameObj.eventTypeName : undefined
        }

        return name
    }



    renderPolls = () => {
        let pollDates: PollDateType[] = []
        // api data
        const data = this.props.route.params?.data

        if (Array.isArray(data.timings)) {
            data.timings.forEach((each) => {

                if ((each.startTime && each.endTime)) {

                    pollDates.push(
                        {
                            date: moment(each.slot, "YYYY-MM-DD").toString(),
                            time: {
                                startTime: moment(each.startTime, 'hh:mm:ss').toString(),
                                endTime: moment(each.endTime, 'hh:mm:ss').toString()
                            },
                            polling: each.polling,
                            // send remaining data in each time obj, for when PollDates screen returns them
                            ...each
                        }
                    )
                } else {
                    pollDates.push(
                        {
                            date: moment(each.slot, "YYYY-MM-DD").toString(),
                            time: undefined,
                            polling: each.polling,
                            // send remaining data in each time obj, for when PollDates screen returns them
                            ...each
                        }
                    )
                }
            })
        }


        return <>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: moderateScale(20),
                marginBottom: moderateScale(16)
            }}>
                <Text style={styles.heading}>When do you want to come?</Text>
                <Pressable onPress={() => this.props.navigation.navigate("PollDates", {
                    // send all nav params to poll dates screen
                    ...this.props.route.params,
                    datesWithUniqueTimes: pollDates,
                })}>
                    <Text style={{
                        color: '#00ADEF'
                    }}>See all</Text>
                </Pressable>
            </View>
            <View style={{
                flexDirection: 'row'
            }}>
                {
                    pollDates.slice(0, 2).map((each, index) => {
                        const even = index % 2 == 0

                        return <PollItem
                            containerStyle={{
                                marginRight: even ? moderateScale(6) : 0
                            }}
                            key={index}
                            data={each}
                        />
                    })
                }
            </View>
        </>
    }

    renderLocations = () => {

        const { data } = this.props.route.params

        const locationsData = data.locations ? data.locations : []

        return <View style={{
            backgroundColor: '#fff',
            borderRadius: moderateScale(10),
            marginTop: moderateScale(30),
            marginBottom: moderateScale(20),
            padding: moderateScale(20)
        }}>
            <Text style={styles.heading}>Location</Text>
            {locationsData.map((each, index) => {
                return <View
                    key={each.id}
                    style={{
                        flexDirection: 'row',
                        height: moderateScale(65),
                        alignItems: 'center',
                        borderBottomWidth: 0.5,
                        borderColor: '#355D9B'
                    }}>
                    <Text style={{ flex: 0.8, color: '#88879C' }}>
                        {each.name}
                    </Text>
                    <View
                        style={{
                            marginLeft: 'auto',
                            marginTop: moderateScale(9),
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                        <View style={{ alignItems: 'center' }}>
                            <View style={{ transform: [{ rotateY: '180deg' }], }}>
                                <MaterialCommunityIcons
                                    name="thumb-down"
                                    style={{
                                        color: '#E14F50',

                                        fontSize: moderateScale(18)
                                    }}
                                />
                            </View>
                            <Text style={{
                                color: '#E14F50',
                                fontFamily: 'Mulish-ExtraBold'
                            }}>{this.calculatePollNo(each.polling).falseNo}</Text>
                        </View>
                        <View style={{ marginLeft: moderateScale(16), alignItems: 'center' }}>
                            <MaterialCommunityIcons
                                name="thumb-up"
                                style={{ color: '#355D9B', fontSize: moderateScale(18) }}
                            />
                            <Text style={{
                                color: '#355D9B',
                                fontFamily: 'Mulish-ExtraBold'
                            }}>{this.calculatePollNo(each.polling).trueNo}</Text>

                        </View>
                    </View>

                </View>
            })
            }
        </View >
    }

    renderStats = () => {
        const stats = [
            {
                title: 'Vendors',
                value: '1085',
                icon: <SvgIcons.VendorsIcon />
            }, {
                title: 'Checklist',
                value: '4414',
                icon: <SvgIcons.CheckListIcon />
            }, {
                title: 'Guests',
                value: '012',
                icon: <SvgIcons.GuestsIcon />
            }, {
                title: 'Budget',
                value: '1000$',
                icon: <SvgIcons.BudgetIcon />
            }
        ]

        return <View style={{
            flexDirection: 'row',
            marginVertical: moderateScale(20)
        }}>
            {stats.map((each, index) => {

                return <View
                    key={each.title}
                    style={{
                        height: moderateScale(120),
                        flex: 1,
                        marginLeft: index !== 0 ? moderateScale(3.5) : 0,
                        borderRadius: moderateScale(10),
                        alignItems: 'center',
                        padding: moderateScale(8.5),
                        backgroundColor: '#fff'
                    }}>
                    <View
                        style={{
                            width: moderateScale(54),
                            height: moderateScale(54),
                            borderRadius: moderateScale(27),
                            backgroundColor: '#00ADEF',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <View style={{
                            transform: [{ scale: moderateScale(0.95) }]
                        }}>{each.icon}</View>
                    </View>
                    <Text style={{
                        color: '#355D9B',
                        fontFamily: 'Mulish-ExtraBold',
                        fontSize: moderateScale(12.3)
                    }}>{each.title}</Text>
                    <Text
                        style={{
                            color: '#88879C',
                            fontSize: moderateScale(10)
                        }}
                    >{each.value}</Text>
                </View>
            })}
        </View>
    }

    /** image picker code starts */
    handleImagePick = () => {
        const options: ImageLibraryOptions = {
            mediaType: "photo"
        }

        launchImageLibrary(options, (res) => {
            if (res.assets) {
                this.setState({ selectedImage: res.assets[0] })
            }
        })
    }

    renderImagePickView = () => {
        const { selectedImage } = this.state
        const data = this.props.route?.params?.data

        return <Pressable
            onPress={this.handleImagePick}
            style={{
                marginTop: moderateScale(45),
                height: moderateScale(160),
                borderRadius: moderateScale(10),
                borderColor: '#355D9B',
                borderWidth: 2.5,
                marginBottom: moderateScale(15),
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            {selectedImage ? <><Image
                style={{
                    flex: 1,
                    width: '90%',
                    marginTop: moderateScale(15),
                    borderRadius: moderateScale(9)
                }}
                source={{ uri: selectedImage.uri }}
            // source={require("../../../assets/images/splashscreen.png")}
            />
                <Text style={{ color: 'rgba(0, 173, 239, 1)' }}>Tap to change</Text>
            </> :
                <Image
                    style={{
                        resizeMode: 'cover',
                        flex: 1,
                        width: '100%',
                        height: moderateScale(160),
                        // width: 'auto',
                        borderRadius: moderateScale(10),
                        borderColor: '#355D9B',
                        // borderWidth: 2.5,
                    }}
                    source={{ uri: `data:image/jpeg;base64,${data?.image}` }}
                   />
            }


        </Pressable>
    }
    /** image picker code ends */

    /**countdown not currently used on this screen */
    renderCountdown = () => {
        const { countdown } = this.state

        return <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 'auto'
        }}>
            {
                Object.keys(countdown).map((key, index) => {
                    return <View
                        key={key}
                        style={{
                            minHeight: verticalScale(60),
                            minWidth: moderateScale(60),
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                        {index !== 0 && <Text style={{
                            color: '#fff',
                            fontSize: verticalScale(30),
                            fontFamily: 'Mulish-ExtraBold',
                            marginTop: -verticalScale(8)
                        }}>:</Text>}
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                color: '#fff',
                                fontSize: verticalScale(28),
                                fontFamily: 'Mulish-Bold'
                            }}>
                                {countdown[key].value}
                            </Text>
                            <Text style={{
                                color: '#fff',
                                fontFamily: 'Mulish-Bold',
                                fontSize: verticalScale(9)
                            }}>
                                {key.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                })
            }
        </View>
    }

    /**countdown not currently used on this screen */
    renderImageWithCountdown = () => {
        const data = this.props.route?.params?.data

        return <View style={{
            // alignItems: 'center',
            height: moderateScale(400)
        }}>
            <ImageBackground
                style={{
                    resizeMode: 'cover',
                    // flex: 1,
                    height: moderateScale(370),
                    width: 'auto',

                    borderColor: '#355D9B',
                    position: 'relative',
                    zIndex: 10,

                }}
                imageStyle={{
                    borderBottomLeftRadius: moderateScale(50),
                    borderBottomRightRadius: moderateScale(50),
                }}
                source={{ uri: `data:image/jpeg;base64,${data?.image}` }}
            // source={require("../../../assets/images/splashscreen.png")}
            >
                <LinearGradient colors={[
                    'rgba(0,0,0,0.7)',
                    'rgba(0,0,0,0.5)',
                    'rgba(0,0,0,0.1)',
                    'rgba(0,0,0,0.1)',
                    'rgba(0,0,0,0.5), ',
                    'rgba(0,0,0,0.7)',]}
                    style={{
                        flex: 1,
                        padding: verticalScale(19),
                        borderBottomLeftRadius: moderateScale(50),
                        borderBottomRightRadius: moderateScale(50),
                    }}>
                    <View style={{
                        marginTop: verticalScale(40)
                    }}>
                        <Text style={{
                            color: '#fff',
                            fontSize: verticalScale(15),
                        }}>
                            {moment(data?.createdDate).format('DD MMM[,] YYYY')}
                        </Text>
                        <Text style={{
                            color: '#fff',
                            fontSize: verticalScale(29),
                            fontFamily: 'Mulish-Bold'
                        }}>
                            {data?.name}
                        </Text>
                    </View>
                    {this.renderCountdown()}
                </LinearGradient>
            </ImageBackground>
            <Image
                style={{
                    resizeMode: 'cover',
                    // flex: 1,
                    height: moderateScale(385),
                    width: '90%',
                    borderBottomLeftRadius: moderateScale(50),
                    borderBottomRightRadius: moderateScale(50),
                    borderColor: '#355D9B',
                    position: 'absolute',
                    opacity: 0.5,
                    alignSelf: 'center',
                    zIndex: 2
                }}
                source={{ uri: `data:image/jpeg;base64,${data?.image}` }}
            />
            <Image
                style={{
                    resizeMode: 'cover',
                    height: moderateScale(400),
                    width: '80%',
                    borderBottomLeftRadius: moderateScale(50),
                    borderBottomRightRadius: moderateScale(50),
                    borderColor: '#355D9B',
                    position: 'absolute',
                    zIndex: 1,
                    alignSelf: 'center',
                    opacity: 0.2
                }}
                source={{ uri: `data:image/jpeg;base64,${data?.image}` }}
            />
        </View>
    }

    render() {
        const data = this.props.route?.params?.data
        const { formValue } = this.state


        return <ImageBackground
            source={require("../../../assets/images/blurBG.png")}
            resizeMode="cover"
            imageStyle={{
                width: deviceWidth,
                height: deviceHeight
            }}
            style={{
                flex: 1,
            }}
        >
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="always"
                contentContainerStyle={styles.container}
            >
                <TopBar
                    style={{ backgroundColor: 'transparent' }}
                    title="Edit Event"
                />
                <View style={{
                    marginHorizontal: moderateScale(20)
                }}>
                    {this.renderImagePickView()}
                    {/* {this.renderImageWithCountdown()} */}
                    {/* {this.renderPolls()}
                    {this.renderLocations()}*/}
                    {this.renderStats()}
                    <View
                        style={styles.nameContainer}
                    >
                        <Text style={[styles.heading]}>Event Name</Text>
                        <TextInput
                            onChangeText={(val) => this.handleTextChange('eventName', val)}
                            value={formValue.eventName.value}
                            style={[styles.smallGreyText]} />
                    </View>

                    <View
                        style={styles.nameContainer}
                    >
                        <Text style={[styles.heading]}>Address {"&"} Location</Text>
                        <TextInput
                            onChangeText={(val) => this.handleTextChange('address', val)}
                            value={formValue.address.value}
                            style={[styles.smallGreyText]} />
                    </View>
                    <View
                        style={styles.nameContainer}
                    >
                        <Text style={[styles.heading]}>Event Time {"&"} Date</Text>
                        <Text style={[styles.smallGreyText]}>{moment(data?.createdDate).format("DD MMM[,] YYYY[-]hh:mm A")}</Text>

                    </View>
                    {/* {this.renderGuests()} */}
                </View>
            </KeyboardAwareScrollView>
        </ImageBackground>
    }
}

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const styles = StyleSheet.create<Styles>({
    container: {
        flexGrow: 1,
        paddingBottom: moderateScale(50)
    },
    heading: {
        fontFamily: 'Mulish-ExtraBold',
        color: '#355D9B',
        fontSize: moderateScale(15.5)
    },
    smallGreyText: {
        color: '#88879C',
        fontSize: moderateScale(13),
        fontFamily: 'Mulish-Regular'
    },
    nameContainer: {
        backgroundColor: '#fff',
        borderRadius: moderateScale(10),
        marginBottom: moderateScale(20),
        height: moderateScale(100),
        padding: moderateScale(19),
        justifyContent: 'space-around'
    },

})

const mapStateToProps = state => {
    const { eventsCategories } = state.events

    return {
        eventsCategories
    }
}

export default connect(mapStateToProps)(EditorEventDetails)