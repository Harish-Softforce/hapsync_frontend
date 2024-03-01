import * as React from 'react'
import {
    View,
    ImageBackground,
    ScrollView, StyleSheet,
    Dimensions,
    Pressable,
    Switch,
    Image,
    Platform,
    Keyboard
} from 'react-native'

import Text from '../../../components/UI/AppText'
import TopBar from '../../../components/TopBar'
import AppInput from '../../../components/UI/Input'
import AppButton from '../../../components/UI/button'

import { moderateScale, verticalScale } from '../../../utils/scalingUnits'

import * as SvgIcons from '../../../assets/svg-icons'

import DateTimePickerModal from "react-native-modal-datetime-picker";
import ReactNativePickerModule from "react-native-picker-module"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import EvilIcons from "react-native-vector-icons/EvilIcons"

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'
import { addActivity, getAllActivityTypes } from '../../../store/actionCreators'
import { connect } from 'react-redux'
import AppText from '../../../components/UI/AppText'
import ModalSelector from 'react-native-modal-selector'

class AddTask extends React.Component {
    state = {
        //formValues
        taskName: '',
        note: '',
        amount: 0,

        showDatePicker: false,
        selectedDate: new Date(),
        //
        selectedCategory: undefined,

        //
        assignees: [],
        status: "PENDING",
        activityTypes: []
    }
    catPickerRef = React.createRef()

    componentDidMount() {

        //getAllActivityTypes
        getAllActivityTypes().then(() => {
            let a = []
            this.props.activityTypes.map(i => {
                a.push({
                    value: i.activityTypeName,
                    label: i.activityTypeName,
                    id: i.id,
                    key: i.id
                })
            })
            const { userData } = this.props
            this.setState({
                assignees: [{
                    userId: userData.id,
                    status: "ACTIVE",
                    name: userData.name,
                    phone: userData.phone,
                    selected: true
                }]
            })
            this.setState({ activityTypes: a })
        }).catch(e => {
            console.log(e)
        })

    }

    renderSaveButton = () => {
        const { taskName, selectedCategory, amount } = this.state
        let validForm = false
        if (taskName == '' || selectedCategory == undefined || Number(amount) < 0) {
            validForm = false
        } else {
            validForm = true
        }
        return <AppButton
            title="Save"
            style={{ backgroundColor: validForm ? '#355D9B' : 'grey', marginTop: 5 }}
            clicked={() => {
                if (validForm) {
                    let activityTypeId = null
                    this.state.activityTypes.map(i => {
                        if (i.value == selectedCategory) {
                            activityTypeId = i.id
                        }
                    })

                    let obj = {
                        eventId: this.props.currentEvent.id,
                        name: taskName,
                        notes: this.state.note,
                        status: this.state.status,
                        date: moment(this.state.selectedDate).format("YYYY-MM-DD"),
                        activityTypeId: activityTypeId,
                        owner: this.props.userData.id,
                        budget: this.state.amount,
                        assignees: this.state.assignees
                    }

                    addActivity(obj, this.props.navigation)
                }
            }}
        />
    }

    renderRightHeaderComp = () => {
        const { taskName, selectedCategory, amount } = this.state
        let validForm = false
        if (taskName == '' || selectedCategory == undefined || Number(amount) < 0) {
            validForm = false
        } else {
            validForm = true
        }
        return <Pressable
            onPress={() => {
                if (validForm) {

                    let activityTypeId = null
                    this.state.activityTypes.map(i => {
                        if (i.value == selectedCategory) {
                            activityTypeId = i.id
                        }
                    })

                    let obj = {
                        eventId: this.props.currentEvent.id,
                        name: taskName,
                        notes: this.state.note,
                        status: this.state.status,
                        date: moment(this.state.selectedDate).format("YYYY-MM-DD"),
                        activityTypeId: activityTypeId,
                        owner: this.props.userData.id,
                        budget: this.state.amount,
                        assignees: this.state.assignees
                    }

                    addActivity(obj, this.props.navigation)
                }
            }}
        >
            <MaterialIcons
                name="check"
                style={{
                    fontSize: verticalScale(26),
                    color: validForm ? '#355D9B' : 'grey'
                }}
            />
        </Pressable>
    }

    renderCategoryPicker = () => {
        const { selectedCategory, activityTypes } = this.state


        const dataset = activityTypes

        return <View style={styles.section}>
            <Text style={[styles.heading]}>Category</Text>
            {/* <Pressable
                onPress={() => this.catPickerRef.current.show()}
                style={{
                    borderRadius: moderateScale(6),
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
                    <SvgIcons.DownArrow
                    />
                </View>
            </Pressable> */}
            {/* <ReactNativePickerModule
                pickerRef={this.catPickerRef}
                value={selectedCategory}
                title={"Select a category"}
                items={dataset}
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
                    this.setState({ selectedCategory: value })
                }}
            /> */}
            <ModalSelector
                overlayStyle={{  paddingVertical: verticalScale(100), }}
                data={dataset}
                initValue={selectedCategory}
                onChange={(option) => {
                    this.setState({ selectedCategory: option.value })
                }}
                header={
                    <View style={{ marginBottom: 5, alignItems: 'center', }}>
                        <Text style={{ fontSize: moderateScale(15), color: 'black', fontFamily:"Mulish" }}>Please select a category</Text>
                    </View>
                }
                cancelText="Close"
                optionTextStyle={{fontFamily:"Mulish"}}
                cancelTextStyle={{fontFamily:"Mulish"}}
            >
                <View
                    style={{
                        borderRadius: moderateScale(6),
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
                        <SvgIcons.DownArrow
                        />
                    </View>
                </View>
            </ModalSelector>
        </View>
    }

    renderDateSelector = () => {

        return <View style={styles.section}>
            <Text style={[styles.heading]}>Date</Text>
            <Pressable
                onPress={() => {
                    this.setState({ showDatePicker: true })
                }}
                style={{
                    borderRadius: moderateScale(6),
                    borderColor: 'rgba(53, 93, 155, 1)',
                    backgroundColor: '#fff',
                    minHeight: moderateScale(42),
                    borderWidth: 0.5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    //paddingHorizontal: moderateScale(8),
                    justifyContent: 'space-between'
                }}>

                <Text style={{
                    color: 'rgba(53, 93, 155, 1)',
                    fontFamily: 'Mulish-Regular',
                    marginLeft: moderateScale(6)
                }}>{moment(this.state.selectedDate).format("DD MMM[,] YYYY")}</Text>
                <EvilIcons
                    name="calendar"
                    style={{ fontSize: 40, color: 'rgba(0, 173, 239, 1)' }}
                />
            </Pressable>
            <DateTimePickerModal
                isVisible={this.state.showDatePicker}
                mode="date"
                display={Platform.OS=="ios"?'inline':'default'}
                minimumDate={new Date()}
                onConfirm={(date) => {
                    this.setState({ selectedDate: date, showDatePicker: false })
                }}
                onCancel={() => this.setState({ showDatePicker: false })}
            />
        </View>
    }

    renderTaskStatus = () => {
        const { status } = this.state;

        return <View style={styles.section}>
            <Text style={[styles.heading]}>Task Status</Text>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <AppButton
                    title="Pending"
                    style={[styles.button, status == "PENDING" ? {
                        //marginLeft: moderateScale(5),
                        backgroundColor: '#355D9B',
                        borderColor: '#355D9B',
                        borderWidth: moderateScale(1.5)
                    } : {
                        //marginLeft: moderateScale(5),
                        backgroundColor: '#fff',
                        borderColor: '#355D9B',
                        borderWidth: moderateScale(1.5)
                    }]}
                    labelStyle={{ color: status == "PENDING" ? '#fff' : '#355D9B', fontSize: moderateScale(11) }}
                    clicked={() => this.setState({ status: "PENDING" })}
                />
                <AppButton
                    title="InProgress"
                    style={[styles.button, status == "INPROGRESS" ? {
                        marginLeft: moderateScale(5),
                        backgroundColor: '#355D9B',
                        borderColor: '#355D9B',
                        borderWidth: moderateScale(1.5)
                    } : {
                        marginLeft: moderateScale(5),
                        backgroundColor: '#fff',
                        borderColor: '#355D9B',
                        borderWidth: moderateScale(1.5)
                    }]}
                    labelStyle={{ color: status == "INPROGRESS" ? '#fff' : '#355D9B', fontSize: moderateScale(11) }}
                    clicked={() => this.setState({ status: "INPROGRESS" })}
                />
                <AppButton
                    title="Completed"
                    style={[styles.button, status == "COMPLETED" ? {
                        marginLeft: moderateScale(5),
                        backgroundColor: '#355D9B',
                        borderColor: '#355D9B',
                        borderWidth: moderateScale(1.5)
                    } : {
                        marginLeft: moderateScale(5),
                        backgroundColor: '#fff',
                        borderColor: '#355D9B',
                        borderWidth: moderateScale(1.5)
                    }]}
                    labelStyle={{ color: status == "COMPLETED" ? '#fff' : '#355D9B', fontSize: moderateScale(11) }}
                    clicked={() => this.setState({ status: "COMPLETED" })}
                />
            </View>
        </View>
    }

    renderAssignees = () => {

        const entries = [
            /*  {
                 title: 'Unassigned',
                 icon: <SvgIcons.UnassignedIcon />,
                 screen: undefined,
             }, */
            {
                title: 'Assigned',
                icon: <SvgIcons.AssignedIcon
                    fill="#00ADEF"
                />,
                screen: undefined,
            },
        ]

        return <View style={styles.section}>
            <Text style={[styles.heading]}>Assigned To</Text>
            {
                entries.map((each, index) => {
                    return <Pressable
                        onPress={() => {
                            let acceptedGuests = [...this.props.currentEvent.invitees].filter(i => i.response == "ACCEPTED")
                            this.props.navigation.navigate("AssigneesScreen", {
                                type: each.title,
                                guests: acceptedGuests,
                                userData: this.props,
                                hostId: this.props.userData.id,
                                assignees: this.state.assignees,
                                onClickAssign: (list) => {
                                    this.setState({ assignees: list })
                                },
                            })
                        }}
                        key={index}
                        style={{
                            borderRadius: moderateScale(6),
                            borderColor: 'rgba(53, 93, 155, 1)',
                            backgroundColor: '#fff',
                            minHeight: moderateScale(42),
                            borderWidth: 0.5,
                            flexDirection: 'row',
                            alignItems: 'center',
                            //paddingHorizontal: moderateScale(8),
                            marginBottom: verticalScale(11)
                            // justifyContent: 'space-around'
                        }}>
                        <View style={{
                            flex: 0.13,
                            alignItems: 'center',
                            transform: [{ scale: moderateScale(1) }]
                        }}>
                            {each.icon}
                        </View>
                        <Text style={{
                            color: '#88879C',
                            flex: 0.7,
                            marginLeft: moderateScale(5)
                        }}
                        >
                            {each.title}
                        </Text>
                        <MaterialIcons
                            name="chevron-right"
                            style={{
                                color: '#88879C',
                                fontSize: verticalScale(23),
                                marginLeft: 'auto'
                            }}
                        />
                    </Pressable>
                })
            }
            {
                this.state.assignees.map((each, index) => {
                    return <Pressable
                        key={index}
                        // onPress={() => selectContact(item)}
                        style={{
                            flexDirection: "row",
                            backgroundColor: '#fff',
                            minHeight: verticalScale(60),
                            borderRadius: moderateScale(6),
                            marginBottom: moderateScale(7),
                            padding: moderateScale(10),
                            borderWidth: 0.5,
                            borderColor: '#355D9B',
                            alignItems: 'center'
                            // justifyContent: 'space-between'
                        }}
                    >
                        <View style={{
                            marginRight: moderateScale(7)
                        }}>
                            <Image
                                style={{
                                    width: moderateScale(52),
                                    height: moderateScale(52),
                                    borderRadius: moderateScale(27)
                                }}
                                source={require("../../../assets/images/event.png")}
                            />
                        </View>
                        <View style={{
                            //flex: 0.6,
                            justifyContent: 'center'
                        }}>
                            <AppText style={{
                                fontSize: moderateScale(14),
                                color: '#355D9B',
                                fontFamily: 'Mulish-Bold'
                            }}>
                                {each.name}
                            </AppText>
                            <AppText
                                style={{
                                    fontSize: moderateScale(13),
                                    color: "grey",
                                }}
                            >
                                {each.phone}
                            </AppText>
                        </View>

                    </Pressable>
                })
            }
        </View>
    }

    render() {

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
                title="Add Task"
                rightComponent={this.renderRightHeaderComp()}
            />
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flexGrow: 1,
                }}
            >
                <View style={{
                    marginHorizontal: moderateScale(15)
                }}>
                    <View style={styles.section}>
                        <Text style={[styles.heading]}>Task Name</Text>
                        <AppInput
                            onChangeText={(val) => this.setState({ taskName: val })}
                            value={this.state.taskName}
                            placeholder="Enter task name"
                            placeholderTextColor="#88879C"
                        />
                    </View>
                    {this.state.activityTypes.length > 0 && this.renderCategoryPicker()}
                    <View style={styles.section}>
                        <Text style={[styles.heading]}>Note</Text>
                        <AppInput
                            multiline
                            onChangeText={(val) => this.setState({ note: val })}
                            value={this.state.note}
                            placeholder="Enter note"
                            placeholderTextColor="#88879C"
                        />
                    </View>
                    {this.renderTaskStatus()}
                    {this.renderDateSelector()}
                    <View style={styles.section}>
                        <Text style={[styles.heading]}>Amount</Text>
                        <AppInput
                            onChangeText={(val) => this.setState({ amount: val })}
                            value={String(this.state.amount)}
                            placeholder="500$"
                            placeholderTextColor="#88879C"
                            keyboardType="number-pad"
                            returnKeyType='done'
                            onSubmitEditing={Keyboard.dismiss}
                        />
                    </View>
                    {this.renderAssignees()}

                </View>
            </KeyboardAwareScrollView>
            <View style={{ marginHorizontal: moderateScale(15) }}>
                {this.renderSaveButton()}
            </View>
        </ImageBackground >
    }
}


const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
    heading: {
        fontSize: moderateScale(15),
        color: '#355D9B',
        fontFamily: 'Mulish-ExtraBold',
        marginBottom: moderateScale(10)
    },
    //
    section: {
        backgroundColor: '#fff',
        padding: verticalScale(10),
        borderRadius: verticalScale(7),
        marginBottom: verticalScale(10),
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
    button: {
        height: verticalScale(30),
        flex: 1,
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

export default connect(mapStateToProps)(AddTask)
