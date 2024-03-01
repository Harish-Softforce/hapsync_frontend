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
    Text,
    Image,
    LogBox,
    FlatList,
    Platform,
} from 'react-native';


import TopBar from '../../../components/TopBar'
//import Text from '../../../components/UI/AppText'
import AppInput from '../../../components/UI/Input'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import EvilIcons from "react-native-vector-icons/EvilIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import AntDesign from "react-native-vector-icons/AntDesign"

import { moderateScale } from '../../../utils/scalingUnits';

import * as SvgImage from '../../../assets/svg-icons'

import moment from 'moment'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ReactNativePickerModule from "react-native-picker-module"
import { launchCamera, launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { connect } from 'react-redux';
import { addToDrafts } from '../../../store/draftsSlice';
import PollDateItem from '../../../components/PollItem'
import { Button, Divider } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import 'react-native-get-random-values'
LogBox.ignoreLogs(['VirtualizedLists should never be nested',]);

import { v4 as uuidv4 } from 'uuid';
import Config from 'react-native-config';
import { store } from '../../../store';
import { showErrorModalFunc } from '../../../store/utilsSlice';

type Styles = {
    container: ViewStyle
    section: ViewStyle
    heading: TextStyle
}

class CreateEvent extends React.Component {
    constructor(props) {
        super(props)
        this.catPickerRef = React.createRef()
        this.placesInputRef = React.createRef()

        this.state = {
            defaultImage: undefined,
            selectedImage: undefined,
            eventTypeId: undefined,
            selectedCategory: undefined,
            //
            selectedDate: new Date(),
            selectedStartTime: new Date(),
            selectedEndTime: new Date(),
            //
            // startTime: new Date(),
            // endTime: new Date(),
            //
            textflag: true,
            disableMainScreenDates: false,
            showDatePicker: false,
            showStartTimePicker: false,
            showEndTimePicker: false,
            //
            eventName: undefined,
            description: undefined,
            location: {
                loc: undefined,
                lat: undefined,
                lng: undefined
            },
            votedLocations: undefined,
            //
            eventUUID: undefined,
            showPlusIcon: false,
            showInput: false,
            activities: []
        }
    }

    componentDidMount() {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews '])

        // if user is not navigating from drafts screen
        if (!this.props.route.params?.eventUUID) {
            // UUID for event
            let uuid = Date.now();
            this.setState({ eventUUID: uuid })
        } else {
            this.setState({ eventUUID: this.props.route.params?.eventUUID })

            this.updateValuesFromDraft()
        }

        if (this.props.route.params) {
            const { category } = this.props.route.params;

            if (category) {
                this.setState(
                    {
                        selectedCategory: category.type,
                        defaultImage: category.imagePath,
                        eventTypeId: category.id
                    }
                )
            }
        }

        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            let votedDates = this.props.route.params?.votedDates

            // if dates are voted already disable date selectors here
            if (votedDates) {
                if (Object.keys(JSON.parse(votedDates)).length == 0) {
                    this.setState({ disableMainScreenDates: false })
                } else {
                    this.setState({ disableMainScreenDates: true })
                }
            }
        });
    }

    componentWillUnmount() {
        this._unsubscribe();

        this.saveToDrafts()
    }



    checkFormComplete = () => {
        const { selectedImage, votedLocations, location,
            selectedStartTime, selectedEndTime,
            selectedCategory, eventName, description } = this.state

        let formComplete = true

        let valuesToCheck = {
            //  selectedImage,
            selectedCategory,
            eventName,
            //description
        }

        for (let key in valuesToCheck) {
            if (!valuesToCheck[key]) {
                formComplete = formComplete && false
            }
            else {
                if (valuesToCheck[key] == "") {
                    formComplete = formComplete && false
                }
            }
        }
        //console.log(this.st)

        // check for location
        if (!votedLocations) {
            // if voted location is empty  location is not set
            if (!location.lat || location.loc == "") {
                formComplete = formComplete && false
            }
        } else {
            if (Object.keys(votedLocations).length < 1) {
                formComplete = false
            }
        }
        if (this.state.disableMainScreenDates) {

        } else {
            if (selectedStartTime > selectedEndTime) {
                formComplete = false
            }
        }


        return formComplete
    }


    handleImagePick = async () => {
        const options: ImageLibraryOptions = {
            mediaType: "photo"
        }

        /* launchImageLibrary(options, (res) => {
            if (res.assets) {
                this.setState({ selectedImage: res.assets[0] })
            }
        }) */
        let optionsObj = {
            cropping: true,
            freeStyleCropEnabled: true,
            mediaType: 'photo',
        }
        if (Platform.OS == 'ios') {
            optionsObj = {
                ...optionsObj,
                width: 1200, // Add this 
                height: 1500, // Add this
            }
        }
        await ImagePicker.openPicker(optionsObj).then(img => {
            console.log(img)
            let obj = { ...img }
            obj.fileName = uuidv4()
            console.log(obj);

            this.setState({ selectedImage: obj })
            console.log(obj);
        }).catch(e => {
            console.log(e)
        })
    }

    updateValuesFromDraft = () => {
        if (!this.props.route?.params?.draftData) {
            return
        };
        //console.log(this.props.route?.params?.draftData)


        const { selectedImage,
            defaultImage,
            eventTypeId,
            selectedCategory,
            selectedDate,
            selectedStartTime,
            selectedEndTime,
            eventName,
            description,
            location,
            disableMainScreenDates,
            votedDates,
            votedLocations,
            activities,
            eventUUID } = this.props.route?.params?.draftData

        const newRouteProps = {
            selectedImage,
            defaultImage,
            eventTypeId,
            selectedCategory,
            ...(selectedDate && { selectedDate: new Date(selectedDate) }),
            ...(selectedStartTime && { selectedStartTime: new Date(selectedStartTime) }),
            ...(selectedEndTime && { selectedEndTime: new Date(selectedEndTime) }),
            ...(activities && { activities: activities }),
            eventName,
            description,
            location,
            disableMainScreenDates,
            eventUUID,
            votedLocations
        }

        // remove any empty keys
        // for (let k in newRouteProps) {
        //     if (newRouteProps[k] == undefined)
        //         delete newRouteProps[k]
        // }
        if (votedLocations && Object.keys(votedLocations).length < 5 && Object.keys(votedLocations).length > 0) {
            this.setState({ showPlusIcon: true })
        }

        this.setState({
            ...newRouteProps
        })


        this.props.navigation?.setParams({
            votedDates,
            //votedLocations
        })

    }

    saveToDrafts = () => {
        const { selectedImage,
            defaultImage,
            eventTypeId,
            selectedCategory,
            selectedDate,
            selectedStartTime,
            selectedEndTime,
            eventName,
            description,
            location,
            disableMainScreenDates,
            eventUUID,
            votedLocations,
            activities
        } = this.state;

        const { addToDrafts } = this.props

        let votedDates = this.props.route.params?.votedDates

        const dataToStore = {
            selectedImage,
            defaultImage,
            eventName,
            description,
            eventTypeId,
            selectedCategory,
            votedDates,
            votedLocations,
            location,
            ...(activities && { activities: activities }),
            // only send if not disabled
            ...(!disableMainScreenDates && {
                selectedDate: moment(selectedDate).format(),
                selectedStartTime: moment(selectedStartTime).format(),
                selectedEndTime: selectedEndTime ? moment(selectedEndTime).format() : null,
            }),
            disableMainScreenDates,
            eventUUID
        }

        //console.log(dataToStore)

        addToDrafts({
            id: eventUUID,
            data: dataToStore
        })
    }

    renderImagePickView = () => {
        const { selectedImage } = this.state


        return <Pressable
            onPress={this.handleImagePick}
            style={{
                //marginTop: moderateScale(10),
                minHeight: moderateScale(150),
                //backgroundColor: '#cccccc',
                borderRadius: moderateScale(10),
                //borderWidth: 2,
                //borderStyle: 'dashed',
                //borderColor: 'rgba(53, 93, 155, 1)',
                marginBottom: moderateScale(10),
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            {selectedImage ? <>

                <ImageBackground
                    imageStyle={{
                        borderRadius: moderateScale(9)
                    }}
                    style={{
                        flex: 1,
                        width: '100%',
                        //marginTop: moderateScale(15),
                        //borderRadius: moderateScale(9)
                    }}
                    source={{ uri: selectedImage.path }}
                // source={require("../../../assets/images/splashscreen.png")}
                >
                    <View style={{
                        position: "absolute", bottom: 0, right: 0
                    }}>
                        <View style={{

                            borderRadius: 100,
                            backgroundColor: "black",
                            height: 60,
                            width: 60,
                            //marginTop: 5.6,
                            // borderColor: 'white',
                            // borderWidth: 0.5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: 10
                        }}>
                            <EvilIcons name='camera' size={37} color="white" />
                        </View>
                        {/* <Text style={{ color: 'rgba(0, 173, 239, 1)' }}>Tap to change</Text> */}
                    </View>
                </ImageBackground>
            </> : <>
                <View style={{
                    padding: 15,
                    borderRadius: 100,
                    borderColor: "rgba(0, 173, 239, 1)",
                    borderWidth: 2
                }}>
                    <Image
                        style={{
                            width: 45,
                            height: 45,
                        }}
                        source={require("../../../assets/images/selectImage.png")}
                    />
                </View>
                <View style={{ height: 10 }}></View>
                <Text style={{
                    fontFamily: 'Mulish-Bold',
                    fontSize: moderateScale(20),
                    color: 'rgba(53, 93, 155, 1)',
                }}>Add Cover Photo</Text>
                <Text style={{ color: 'rgba(0, 173, 239, 1)', fontSize: moderateScale(15) }}>
                    (up to 12 Mb)
                </Text>
            </>}


        </Pressable>
    }

    renderNextButton = () => {
        const { selectedImage,
            defaultImage,
            eventTypeId,
            selectedCategory,
            selectedDate,
            selectedStartTime,
            selectedEndTime,
            eventName,
            description,
            location,
            disableMainScreenDates,
            eventUUID,
            votedLocations,
            activities
        } = this.state;

        let votedDates = this.props.route.params?.votedDates

        const navParamData = {
            selectedImage,
            defaultImage,
            eventName,
            description,
            eventTypeId,
            selectedCategory,
            votedDates,
            votedLocations,
            location,
            ...(activities && { activities: activities }),
            // only send if not disabled
            ...(!disableMainScreenDates && {
                selectedDate: moment(selectedDate).format(),
                selectedStartTime: moment(selectedStartTime).format(),
                selectedEndTime: selectedEndTime ? moment(selectedEndTime).format() : null,
            }),
            disableMainScreenDates,
            eventUUID
        }

        let formComplete = this.checkFormComplete()

        return <Button
            title="Next"
            containerStyle={{
                flex: 1
            }}
            buttonStyle={{
                height: moderateScale(45),
                padding: 4,
                borderRadius: moderateScale(6),
                //elevation: 2,
                justifyContent: 'center',
                alignItems: 'center',
                margin: moderateScale(6),
                backgroundColor: formComplete ? '#355D9B' : "grey",

            }}
            titleStyle={{
                color: '#fff',
                fontWeight: 'bold',
                fontFamily: "Mulish",
                fontSize: moderateScale(18)
            }}

            onPress={formComplete ? () => this.props.navigation.navigate("InviteFriend", navParamData) : undefined}
        />
        {/* <Pressable
            style={{
                alignSelf: 'flex-end',
                padding: 10,
            }}
            onPress={formComplete ? () => this.props.navigation.navigate("InviteFriend", navParamData) : undefined}
        >
            <Text
                style={{
                    color: formComplete ? 'rgba(53, 93, 155, 1)' : '#ccc',
                    fontSize: moderateScale(20),
                    fontFamily: 'Mulish-ExtraBold'
                }}
            >Next</Text>
        </Pressable> */}
    }

    addLocation = (location) => {
        const votedLocations = { ...this.state.votedLocations }

        // if 3 or above voted dates dont add anymore
        if (Object.keys(votedLocations).length >= 5) {
            return
        }
        let isContain = false
        Object.values(votedLocations).forEach((val) => {
            if (val.loc == location.loc) {
                isContain = true
            }
        })
        if (isContain) {
            store.dispatch(showErrorModalFunc("Location already given for polling"))
            return
        }

        if (votedLocations && Object.keys(votedLocations).length >= 4) {
            this.setState({ showPlusIcon: false, showInput: false })
        } else {
            this.setState({ showPlusIcon: true, showInput: false })
        }

        // append to location Object
        // random no is object key
        votedLocations[Math.floor(1000 * Math.random())] = location
        this.setState({ votedLocations })
    }

    removeLocation = (key) => {
        const votedLocations = { ...this.state.votedLocations }

        delete votedLocations[key];

        this.setState({ votedLocations })
    }

    renderVotedLocations = () => {

        const { votedLocations, showPlusIcon, showInput } = this.state;
        /*  let showInput = true
         if (votedLocations && Object.keys(votedLocations).length > 0) {
             showInput = false
         }
         let a = false
         if (showPlusIcon || showInput) {
             a = true
         } */

        return <>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                <Text style={styles.heading}>Location</Text>
                {showPlusIcon && <Pressable
                    onPress={() => {
                        this.setState({ showInput: true, showPlusIcon: false })
                    }}
                    style={{ marginVertical: moderateScale(5) }}
                >
                    <AntDesign name='pluscircle' size={27} color="#355D9B" />
                </Pressable>}
            </View>
            {(showInput || !votedLocations || Object.keys(votedLocations).length == 0) &&
                <View style={{ flexDirection: "row", marginTop: 7 }}>


                    <GooglePlacesAutocomplete
                        ref={this.placesInputRef}
                        placeholder='Enter Address'
                        enablePoweredByContainer={false}
                        fetchDetails={true}
                        onPress={(data, details) => {
                            // 'details' is provided when fetchDetails = true
                            // console.log(data, details);
                            this.addLocation({
                                loc: data.description,
                                lat: details?.geometry.location.lat,
                                lng: details?.geometry.location.lng
                            })
                            this.placesInputRef.current?.clear()
                        }}
                        query={{
                            key: Config.GOOGLE_PLACE_API_KEY,
                            language: 'en',
                        }}
                        styles={{
                            textInput: {
                                //color: '#000',
                                borderRadius: moderateScale(6),
                                borderColor: 'rgba(53, 93, 155, 1)',
                                color: 'rgba(53, 93, 155, 1)',
                                padding: 6,
                                height: moderateScale(42),
                                borderWidth: 0.5,
                                marginRight: moderateScale(6),
                                minHeight: moderateScale(42),

                            },
                            container: {
                                paddingBottom: 1,
                            }
                        }}
                        textInputProps={{
                            // onChangeText: (val) => this.setState({ location: val })
                            placeholderTextColor: "#cccccc",
                            value: this.state.currentInputVal // undefined value
                        }}
                    // keyboardShouldPersistTaps="handled"
                    />
                    <View style={{
                        width: moderateScale(40),
                        height: moderateScale(40),
                        borderRadius: moderateScale(30),
                        backgroundColor: "rgba(0, 173, 239, 1)",
                        //marginTop: 5.6,
                        borderColor: 'grey',
                        //borderWidth: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Feather
                            name="map-pin"
                            style={{
                                fontSize: 22,
                                color: '#fff'
                            }}
                        />
                    </View>
                    {/* <MaterialCommunityIcons
                        name="map-outline"
                        style={{
                            fontSize: moderateScale(22),
                            color: '#00ADEF',
                            marginHorizontal: moderateScale(5),
                            marginTop: moderateScale(12)
                        }}
                    /> */}
                </View>
            }
            <View style={{ paddingTop: 2 }}></View>
            {votedLocations && Object.keys(votedLocations).map((key, index) => {
                return <View
                    key={index}
                    style={{
                        flexDirection: 'row',
                        //minHeight: moderateScale(45),
                        //alignItems: 'center',
                        borderWidth: 0.5,
                        borderColor: '#355D9B',
                        borderRadius: moderateScale(6),
                        padding: 10,
                        paddingVertical: moderateScale(16),
                        marginTop: 10,
                    }}>
                    <Feather
                        name="map-pin"
                        color={"#355D9B"}
                        size={moderateScale(30)}
                    />
                    <Text style={{ flex: 1, color: '#355D9B', paddingHorizontal: 7, fontFamily: "Mulish" }}>
                        {votedLocations[key].loc}
                    </Text>
                    <View>
                        <Pressable
                            onPress={() => {
                                //console.log(Object.keys(votedLocations).length)
                                this.setState({ showPlusIcon: true, showInput: false })
                                if (Object.keys(votedLocations).length == 1) {
                                    this.setState({ showPlusIcon: false, showInput: true })
                                }
                                this.removeLocation(key)
                            }}
                            style={{
                                //marginLeft: 'auto',
                                marginLeft: 10,
                                borderRadius: moderateScale(40),
                                backgroundColor: "rgba(153, 153, 153, 0.1)",
                                padding: 5,
                                //marginTop: moderateScale(9),
                                transform: [{ scale: moderateScale(1.3) }]
                            }}>
                            <SvgImage.DeleteIcon
                            />
                        </Pressable>
                    </View>
                </View>
            })}
            {votedLocations && Object.keys(votedLocations).length < 5 && <View style={{ marginTop: moderateScale(10), }}>
                <View style={{ minHeight: 10, padding: 5, alignItems: "center", backgroundColor: "#CEEEF9", flexDirection: 'row' }}>
                    <Feather name="info" size={24} color="#355D9B" />
                    <Text style={{ paddingLeft: 5, color: "#355D9B", fontFamily: "Mulish" }}>
                        {
                            Object.keys(votedLocations).length < 2
                                ? "Add more to make it a poll"
                                : "Poll activated. Add up to " + String(5 - Object.keys(votedLocations).length) + " more locations"
                        }</Text>
                </View>
            </View>}
        </>
    }

    renderAddress = () => {
        return <View>
            <Text style={styles.heading}>Location</Text>
            <View style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginTop: moderateScale(4)
            }}>
                <GooglePlacesAutocomplete
                    placeholder='Enter Address'
                    enablePoweredByContainer={false}
                    fetchDetails={true}
                    onPress={(data, details) => {
                        // 'details' is provided when fetchDetails = true
                        //console.log( details);
                        this.setState({
                            location: {
                                loc: data.description,
                                lat: details?.geometry.location.lat,
                                lng: details?.geometry.location.lng
                            }
                        })
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
                            marginRight: moderateScale(6)
                        },
                    }}
                    textInputProps={{
                        onChangeText: (val) => {
                            if (this.state.textflag) {
                                this.setState({ textflag: false })
                            } else {
                                this.setState(prevState => ({
                                    ...prevState,
                                    location: {
                                        ...prevState.location,
                                        loc: val
                                    }
                                }))
                            }
                        },
                        value: this.state?.location.loc,
                        placeholderTextColor: "#cccccc"
                    }}
                    keyboardShouldPersistTaps="handled"
                    onFail={err => {
                        console.log('error is ', err)
                    }}
                />
                <View style={{
                    width: moderateScale(40),
                    height: moderateScale(40),
                    borderRadius: moderateScale(30),
                    backgroundColor: "rgba(0, 173, 239, 1)",
                    //marginTop: 5.6,
                    borderColor: 'grey',
                    //borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Feather
                        name="map-pin"
                        style={{
                            fontSize: 22,
                            color: '#fff'
                        }}
                    />

                </View>
                {/* <AntDesign size={25} /> */}

                {/* <AppInput
                    placeholder="Enter Address"
                    containerStyle={{
                        flex: 1,
                        paddingBottom: 0,
                        justifyContent: 'center',
                        marginRight: moderateScale(6)
                    }}
                /> */}
                {/* <View style={{
                    width: moderateScale(34),
                    height: moderateScale(34),
                    borderRadius: moderateScale(17),
                    marginTop: 5.6,
                    borderColor: 'grey',
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <MaterialCommunityIcons
                        name="map-outline"
                        style={{
                            fontSize: 22,
                            color: '#355D9B'
                        }}
                    />
                </View> */}
            </View>
        </View>
    }

    renderCategoryPicker = () => {
        const { selectedCategory } = this.state

        const { eventsCategories } = this.props

        if (!eventsCategories) {
            return
        }

        let catToShow = [
            ...eventsCategories,

        ]

        catToShow = catToShow.map(each => ({
            value: each.name,
            label: each.name
        }))

        // const dataset = [
        //     {
        //         value: "adhoc",
        //         label: "Adhoc",
        //     },
        //     {
        //         value: "value2",
        //         label: "Value2",
        //     },
        //     {
        //         value: "value3",
        //         label: "Value3",
        //     },
        // ]

        return <View style={styles.section}>
            <Text style={styles.heading}>Event Category</Text>
            <Pressable
                onPress={() => this.catPickerRef.current.show()}
                style={{
                    borderRadius: moderateScale(10),
                    borderColor: 'rgba(53, 93, 155, 1)',
                    minHeight: moderateScale(42),
                    borderWidth: 0.5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: moderateScale(8)
                }}>
                <Text style={{
                    color: 'rgba(53, 93, 155, 1)',
                    fontFamily: 'Mulish-Regular'
                }}>{selectedCategory ? selectedCategory : "Please select a category"}</Text>
                <View
                    style={{ transform: [{ scale: moderateScale(0.8) }], marginLeft: 'auto' }}
                >
                    <SvgImage.DownArrow
                    />
                </View>
            </Pressable>
            {/* <ReactNativePickerModule
                ref={this.catPickerRef}
                value={selectedCategory}
                title={"Select a category"}
                items={catToShow}
                titleStyle={{ color: "white" }}
                itemStyle={{ color: "white", }}
                selectedColor="rgba(53, 93, 155, 1)"
                confirmButtonEnabledTextStyle={{ color: "white" }}
                confirmButtonDisabledTextStyle={{ color: "grey" }}
                cancelButtonTextStyle={{ color: "white" }}
                confirmButtonStyle={{
                    backgroundColor: "rgba(0,0,0,1)",
                }}
                cancelButtonStyle={{
                    backgroundColor: "rgba(0,0,0,1)",
                }}
                contentContainerStyle={{
                    backgroundColor: "rgba(0,0,0,1)",
                }}
                onCancel={() => {
                    console.log("Cancelled")
                }}
                onValueChange={value => {
                    this.setState({
                        selectedCategory: value,
                        votedLocations: undefined,
                        location: undefined
                    })
                }}
            /> */}
        </View>
    }

    renderDateSelector = () => {
        const { disableMainScreenDates } = this.state

        return <View>
            <View style={{ marginBottom: moderateScale(6) }}>
                <Text style={styles.heading}>Date</Text>
            </View>
            <Pressable
                onPress={() => {
                    disableMainScreenDates ? undefined : this.setState({ showDatePicker: true })
                }}
                style={{
                    borderRadius: moderateScale(6),
                    borderColor: disableMainScreenDates ? '#ccc' : 'rgba(53, 93, 155, 1)',
                    backgroundColor: disableMainScreenDates ? '#ddd' : '#fff',
                    minHeight: moderateScale(42),
                    borderWidth: 0.5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: moderateScale(8),
                    justifyContent: 'space-between'
                }}>

                <Text style={{
                    color: 'rgba(53, 93, 155, 1)',
                    fontFamily: 'Mulish-Regular',
                    marginLeft: moderateScale(6)
                }}>{moment(this.state.selectedDate).format("DD MMM[,] YYYY")}</Text>
                {/* <View
                    style={{ transform: [{ scale: moderateScale(0.8) }], marginLeft: 'auto' }}
                >
                    <SvgImage.DownArrow
                    />
                </View> */}
                <EvilIcons
                    name="calendar"
                    style={{ fontSize: 40, color: disableMainScreenDates ? 'grey' : 'rgba(0, 173, 239, 1)' }}
                />
            </Pressable>

            {this.state.selectedCategory == "CUSTOM"
                && <>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ flex: 1, paddingVertical: 10, color: "red" }}>Not sure when?</Text>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: 'center', justifyContent: 'flex-end' }}>
                            {/* <MaterialCommunityIcons name='poll' size={24} color="#355D9B" /> */}
                            <Pressable onPress={() =>
                                this.props.navigation.navigate("VoteScreen", {
                                    ...this.props.route.params
                                })
                            } >
                                <Text style={{ padding: 5, marginLeft: 5, color: '#355D9B', fontFamily: 'Mulish', fontWeight: "600", }}>
                                    Poll your guests</Text>
                            </Pressable>
                        </View>
                    </View>
                </>
            }

            <DateTimePickerModal
                isVisible={this.state.showDatePicker}
                mode="date"
                display={Platform.OS == 'ios' ? 'inline' : 'default'}
                minimumDate={new Date()}
                onConfirm={(date) => {
                    this.setState({ selectedDate: date, showDatePicker: false })
                }}
                onCancel={() => this.setState({ showDatePicker: false })}
            />
        </View>
    }

    renderTimeSelector = () => {
        const { disableMainScreenDates } = this.state

        return <View>
            <Text style={[styles.heading, { marginBottom: moderateScale(10) }]}>Select Time</Text>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <View style={{
                    flex: 1
                }}>
                    <Text style={{
                        marginBottom: 3,
                        fontSize: 14,
                        color: 'rgba(53, 93, 155, 1)'
                    }}>Starts at</Text>
                    <Pressable
                        onPress={() => {
                            disableMainScreenDates ? undefined : this.setState({ showStartTimePicker: true })
                        }}
                        style={{
                            borderRadius: moderateScale(6),
                            borderColor: disableMainScreenDates ? '#ccc' : 'rgba(53, 93, 155, 1)',
                            backgroundColor: disableMainScreenDates ? '#ddd' : '#fff',
                            minHeight: moderateScale(42),
                            borderWidth: 0.5,
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                            justifyContent: "space-between",
                            paddingHorizontal: moderateScale(8),
                        }}>
                        {/* <MaterialCommunityIcons
                            name="calendar-blank-outline"
                            style={{ fontSize: 22, color: disableMainScreenDates ? 'grey' : 'rgba(0, 173, 239, 1)' }}
                        /> */}
                        <Text style={{
                            color: 'rgba(53, 93, 155, 1)',
                            fontFamily: 'Mulish-Regular',
                            marginLeft: moderateScale(6), flex: 1
                        }}>{moment(this.state.selectedStartTime).format("hh:mm A")}</Text>
                        <Ionicons name='time-outline' size={24} color="rgba(0, 173, 239, 1)" />
                        {/* <View
                            style={{ transform: [{ scale: moderateScale(0.8) }], marginLeft: 'auto' }}
                        >
                            <SvgImage.DownArrow
                            />
                        </View> */}
                    </Pressable>
                </View>
                <View style={{
                    flex: 1,
                    marginLeft: moderateScale(6)
                }}>
                    <Text style={{
                        marginBottom: 3,
                        fontSize: 14,
                        color: 'rgba(53, 93, 155, 1)'
                    }}>Ends at</Text>
                    <Pressable
                        onPress={() => {
                            disableMainScreenDates ? undefined : this.setState({ showEndTimePicker: true })
                        }}
                        style={{
                            borderRadius: moderateScale(6),
                            borderColor: disableMainScreenDates ? '#ccc' : 'rgba(53, 93, 155, 1)',
                            backgroundColor: disableMainScreenDates ? '#ddd' : '#fff',
                            minHeight: moderateScale(42),
                            borderWidth: 0.5,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flex: 1,
                            paddingHorizontal: moderateScale(8),
                        }}>
                        {/*  <MaterialCommunityIcons
                                name="calendar-blank-outline"
                                style={{ fontSize: 22, color: disableMainScreenDates ? 'grey' : 'rgba(0, 173, 239, 1)' }}
                            /> */}
                        <Text style={{
                            color: 'rgba(53, 93, 155, 1)',
                            fontFamily: 'Mulish-Regular',
                            marginLeft: moderateScale(6),
                            flex: 1,
                        }}>{moment(this.state.selectedEndTime).format("hh:mm A")}</Text>
                        <Ionicons name='time-outline' size={24} color="rgba(0, 173, 239, 1)" />
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
                onConfirm={(date) => {
                    this.setState({ selectedStartTime: date, showStartTimePicker: false })
                }}
                onCancel={() => this.setState({ showStartTimePicker: false })}
            />
            <DateTimePickerModal
                isVisible={this.state.showEndTimePicker}
                mode="time"
                onConfirm={(date) => {
                    this.setState({ selectedEndTime: date, showEndTimePicker: false })
                }}
                onCancel={() => this.setState({ showEndTimePicker: false })}
            />
        </View >
    }

    renderMultiTimeSelection = () => {

        let votedDates = this.props.route.params?.votedDates
        //console.log(votedDates)
        let parsedVotedDates = JSON.parse(votedDates)

        let datesWithUniqueTimes = [];

        if (votedDates) {
            let parsedDates = JSON.parse(votedDates)

            for (let dateKey in parsedDates) {
                if (!parsedDates[dateKey]["times"] || Object.keys(parsedDates[dateKey]["times"]).length === 0) {
                    // if no time key, push like that
                    delete parsedDates[dateKey]["times"]
                    datesWithUniqueTimes.push(parsedDates[dateKey])
                }
                else {
                    // if time key is available , loop through each
                    for (let timeKey in parsedDates[dateKey]["times"]) {
                        // push each into the unique array but with a "time" key this time

                        delete parsedDates[dateKey]["times"][timeKey]['showEndTimePicker']
                        delete parsedDates[dateKey]["times"][timeKey]['showStartTimePicker']

                        datesWithUniqueTimes.push({
                            ...parsedDates[dateKey], //get other contents
                            times: undefined, // remove times content,
                            time: {
                                ...parsedDates[dateKey]["times"][timeKey],
                            },
                            // empty polling
                            polling: []
                        })
                    }
                }
            }
        }

        let dateTodisplay = [...datesWithUniqueTimes]


        // append the date selected on main create screen
        // then show voted dates after it

        return <>
            {/* <View style={styles.section}> */}
            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between", marginHorizontal: 10 }}>
                <Text style={{ color: "#355D9B", fontFamily: "Mulish-ExtraBold", fontSize: 16 }}>Date/Time Poll</Text>
                <Button
                    onPress={() => {
                        this.props.navigation.navigate("VoteScreen", {
                            ...this.props.route.params
                        })
                    }}
                    type="clear" title={"Edit"} titleStyle={{ textDecorationLine: 'underline', color: "#00ADEF", fontFamily: "Mulish-Bold" }} />
            </View>

            <FlatList
                data={dateTodisplay}
                numColumns={2}
                renderItem={({ item }) => <PollDateItem
                    data={item}
                    containerStyle={{
                        marginBottom: moderateScale(8),
                        flex: 0.5,
                        marginHorizontal: moderateScale(4)
                    }}
                />}
                /* renderItem={({ item }) => {
                    return <>
                        <View style={{ flexDirection: "row", paddingVertical: 10 }}>
                            <Text style={{ marginRight: 15, color: "#355D9B", fontFamily: 'Mulish', fontWeight: "600" }}>{moment(new Date(item.date)).format("MMM Do")}</Text>
                            {item?.time
                                ? <Text style={{ color: "#355D9B", fontFamily: 'Mulish' }}>
                                    {moment(new Date(item.time.startTime)).format("hh:mm A")} - {moment(new Date(item.time.endTime)).format("hh:mm A")}
                                </Text>
                                : <Text style={{ color: "#355D9B", fontFamily: 'Mulish' }}>Anytime</Text>
                            }
                        </View>
                        <Divider />
                    </>
                }} */
                keyExtractor={(item, index) => index}
                contentContainerStyle={{ padding: 3 }}
            />
            {parsedVotedDates && Object.keys(parsedVotedDates).length > 1 && Object.keys(parsedVotedDates).length < 5
                && <View style={{ marginBottom: 5 }}>
                    <View style={{
                        minHeight: 10, padding: 5, alignItems: "center", backgroundColor: "#CEEEF9",
                        flexDirection: 'row', marginHorizontal: 10
                    }}>
                        <Feather name="info" size={24} color="#355D9B" />
                        <Text style={{ paddingLeft: 5, color: "#355D9B", fontFamily: "Mulish" }}>
                            {
                                "Poll activated. Add up to " + String(5 - Object.keys(parsedVotedDates).length) + " more times"
                            }
                        </Text>
                    </View>
                </View>}
            {/* {dateTodisplay.length < 3 &&
                <Button
                    containerStyle={{ alignSelf: 'flex-end' }}
                    type="clear"
                    titleStyle={{ color: 'red' }}
                    title={'Suggest more'}
                    onPress={() => this.props.navigation.navigate("VoteScreen", {
                        ...this.props.route.params
                    })}
                />
            } */}
        </>
    }

    render() {
        const { selectedCategory } = this.state

        return <ImageBackground
            source={require("../../../assets/images/blurBG.png")}
            resizeMode="cover"
            imageStyle={{
                width: "100%",
                height: "100%"
            }}
            style={{
                flex: 1
            }}
        >
            <TopBar
                style={{ backgroundColor: 'transparent' }}
                title="New Event"
            />
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
            >
                <View style={{ marginHorizontal: 20 }}>
                    {this.renderImagePickView()}
                    <View style={styles.section}>
                        <Text style={styles.heading}>Event Name</Text>
                        <AppInput
                            value={this.state.eventName}
                            placeholder="Enter Name"
                            placeholderTextColor={"#cccccc"}
                            style={{ padding: 9, marginTop: moderateScale(6), minHeight: moderateScale(42) }}
                            onChangeText={val => this.setState({ eventName: val })}
                        />
                        <View style={{ height: moderateScale(10) }}>

                        </View>
                        <Text style={{ flexDirection: 'row', alignItems: "center" }}>
                            <Text style={styles.heading}>Event Description</Text>
                            <Text style={{ color: "grey", fontFamily: "Mulish-Regular", }}> (Optional)</Text>
                        </Text>
                        <AppInput
                            value={this.state.description}
                            placeholder="Enter Description"
                            placeholderTextColor={"#cccccc"}
                            multiline
                            numberOfLines={1}
                            style={{ padding: 9, paddingTop: 12, marginTop: moderateScale(6), minHeight: moderateScale(42) }}
                            onChangeText={val => this.setState({ description: val })}
                        />
                        <View style={{ height: moderateScale(14) }}>

                        </View>

                        {/* {this.renderCategoryPicker()} */}
                        {selectedCategory == "CUSTOM" ? this.renderVotedLocations() : this.renderAddress()}
                    </View>
                    {/* {selectedCategory == "Custom" && <Pressable
                        onPress={() => this.props.navigation.navigate("VoteScreen", {
                            ...this.props.route.params
                        })}

                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 'auto',
                            marginBottom: moderateScale(10)
                        }}>
                        <><Text style={{
                            fontSize: moderateScale(14),
                            color: 'rgba(53, 93, 155, 1)',
                            fontFamily: 'Mulish-Light',
                            marginRight: moderateScale(4)
                        }}>Vote for best day</Text>
                            <View
                                style={{ transform: [{ scale: moderateScale(0.8) }] }}
                            >
                                <SvgImage.QuestionIcon
                                />
                            </View>
                        </>
                    </Pressable>} */}
                    {!this.state.disableMainScreenDates
                        ? <View style={styles.section}>
                            {this.renderDateSelector()}
                            <View style={{ height: moderateScale(11) }}></View>
                            {this.renderTimeSelector()}
                        </View>
                        : this.renderMultiTimeSelection()
                    }

                    {this.renderNextButton()}
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
        paddingBottom: moderateScale(20)
    },
    section: {
        //minHeight: moderateScale(145),
        borderRadius: moderateScale(10),
        backgroundColor: '#fff',
        marginBottom: moderateScale(10),
        padding: moderateScale(15),
        //justifyContent: 'space-around',
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
    },
    heading: {
        fontFamily: 'Mulish-ExtraBold',
        fontSize: moderateScale(16),
        color: 'rgba(53, 93, 155, 1)',
        elevation: 1,
    }
})

const mapStateToProps = state => {
    const { eventsCategories } = state.events

    return {
        eventsCategories
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addToDrafts: (data) => dispatch(addToDrafts(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent)