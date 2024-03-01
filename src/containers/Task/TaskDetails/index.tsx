import * as React from 'react'
import {
    View,
    ImageBackground,
    ScrollView, StyleSheet,
    Dimensions,
    Pressable,
    Switch,
    Image,
    Text,
    Platform,
    TextInput,
    Keyboard
} from 'react-native'

import AppText from '../../../components/UI/AppText'
import TopBar from '../../../components/TopBar'
import AppButton from '../../../components/UI/button'
import EvilIcons from "react-native-vector-icons/EvilIcons"
import { moderateScale, verticalScale } from '../../../utils/scalingUnits'
import * as SvgIcons from '../../../assets/svg-icons'
import ReactNativePickerModule from "react-native-picker-module"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from 'react-native-toast-message'
import { clearCurrentTask, getCurrentTask, updateActivity } from '../../../store/actionCreators'
import { connect } from 'react-redux'
import validator from 'validator'
import { Button } from 'react-native-elements'
import ModalSelector from 'react-native-modal-selector'

class AddTask extends React.Component {
    state = {
        showDatePicker: false,
        //
        formValue: {
            taskName: {
                value: "",
                inEditMode: false
            },
            activityTypeName: {
                value: undefined,
                inEditMode: false
            },
            note: {
                value: "",
                inEditMode: false
            },
            status: {
                value: undefined,
                inEditMode: false
            },
            date: {
                value: null,
                inEditMode: false
            },
            amount: {
                value: 0,
                inEditMode: false
            },
            assignees: {
                value: undefined,
                inEditMode: false
            }
        },
        formValueAmountErrMsg: "",
        isPending: true,
        //
        taskEdited: false
    }

    catPickerRef = React.createRef()

    componentDidMount() {
        this.initializeFormValues()
        /* getCurrentTask(this.props.route.params.data.id).then(() => {
            
        }).catch(e => {
            console.log(e)
        }) */
    }

    componentWillUnmount() {
        //clearCurrentTask()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentTask != this.props.currentTask) {
            this.initializeFormValues()
        }
    }

    initializeFormValues = () => {

        if (this.props.currentTask) {
            let data = this.props.currentTask
            this.setState(prevState => ({
                ...prevState,
                formValue: {
                    taskName: {
                        value: data.name,
                        inEditMode: false
                    },
                    activityTypeName: {
                        value: data.activityTypeName,
                        inEditMode: false
                    },
                    note: {
                        value: data.notes,
                        inEditMode: false
                    },
                    status: {
                        value: data.status,
                        inEditMode: false
                    },
                    date: {
                        value: data.date,
                        inEditMode: false
                    },
                    amount: {
                        value: data.budget,
                        inEditMode: false
                    },
                    assignees: {
                        value: data.assignees,
                        inEditMode: false
                    }
                }
            }))
        }
    }

    handleTextAndEditableUpdate = (key: string, value, inEditMode: boolean) => {

        if (this.props.currentEvent.taskAccess) {
            const formValue = { ...this.state.formValue };
            const { taskEdited } = this.state

            if (!taskEdited) {
                this.setState({ taskEdited: true })
            }

            let newData = {
                ...formValue[key],
                ...(value != undefined && { value }),
                ...(inEditMode && { inEditMode }),
            }

            formValue[key] = newData

            this.setState({ formValue })
        }
    }

    submitEdits = () => {
        let formValue = { ...this.state.formValue }
        for (let key in formValue) {
            formValue[key].inEditMode = false
        }

        const { taskName, status, date, amount, activityTypeName, assignees, note } = this.state.formValue

        let validForm = false
        if (taskName.value == "" || activityTypeName.value == undefined || date.value == null || this.state.formValueAmountErrMsg != "") {
            validForm = false
        } else {
            validForm = true
        }
        //console.log(validForm)

        if (validForm) {

            let activityTypeId = this.props.currentTask.activityTypeId
            this.props.activityTypes.map(i => {
                if (i.activityTypeName == activityTypeName.value) {
                    activityTypeId = i.id
                }
            })

            let obj = {
                id: this.props.currentTask.id,
                eventId: this.props.currentEvent.id,
                name: taskName.value,
                notes: note.value,
                status: status.value,
                date: moment(date.value).format("YYYY-MM-DD"),
                activityTypeId: activityTypeId,
                owner: this.props.userData.id,
                budget: amount.value,
                assignees: assignees.value,
                //vendors:this.props.currentTask.vendors
            }
            console.log(JSON.stringify(obj))
            updateActivity(obj)

            this.setState({ taskEdited: false });

        }

    }


    renderRightHeader = () => {
        const { taskEdited } = this.state

        return <View>
            {taskEdited ? <Pressable
                onPress={this.submitEdits}
            >
                <Feather
                    name="check"
                    style={{
                        fontSize: verticalScale(27),
                        color: '#355D9B'
                    }}
                />
            </Pressable>
                :
                undefined
            }
        </View>
    }


    renderDate = () => {
        return <View style={styles.section}>
            <AppText style={[styles.heading]}>Date</AppText>
            <View

                style={{
                    borderRadius: moderateScale(10),
                    borderColor: 'rgba(53, 93, 155, 1)',
                    backgroundColor: '#fff',
                    //minHeight: moderateScale(42),
                    borderWidth: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    //paddingHorizontal: moderateScale(8)
                }}>
                {/* <MaterialCommunityIcons
                    name="calendar-blank-outline"
                    style={{ fontSize: 22, color: 'rgba(0, 173, 239, 1)' }}
                /> */}
                <AppText style={{
                    color: 'rgba(53, 93, 155, 1)',
                    fontFamily: 'Mulish-Regular',
                    //marginLeft: moderateScale(6)
                }}>{moment(this.state.formValue.date.value).format("DD MMM[,] YYYY")}</AppText>

            </View>

        </View>
    }

    renderTaskStatus = () => {
        //const data = this.props.route.params?.data

        const { status } = this.state.formValue

        return <View style={styles.section}>
            <AppText style={[styles.heading]}>Task Status</AppText>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <AppButton
                    title="Pending"
                    style={[styles.button, status.value == "PENDING" ? {
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
                    labelStyle={{ color: status.value == "PENDING" ? '#fff' : '#355D9B', fontSize: moderateScale(11) }}
                    clicked={() => { this.handleTextAndEditableUpdate("status", "PENDING", true) }}
                />
                <AppButton
                    title="InProgress"
                    style={[styles.button, status.value == "INPROGRESS" ? {
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
                    labelStyle={{ color: status.value == "INPROGRESS" ? '#fff' : '#355D9B', fontSize: moderateScale(11) }}
                    clicked={() => { this.handleTextAndEditableUpdate("status", "INPROGRESS", true) }}
                />
                <AppButton
                    title="Completed"
                    style={[styles.button, status.value == "COMPLETED" ? {
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
                    labelStyle={{ color: status.value == "COMPLETED" ? '#fff' : '#355D9B', fontSize: moderateScale(11) }}
                    clicked={() => { this.handleTextAndEditableUpdate("status", "COMPLETED", true) }}
                />
            </View>
        </View>
    }

    renderAssignees = () => {

        const entries = this.state.formValue.assignees.value || []

        return <View style={styles.section}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={styles.heading}>Assigned To</Text>
                {this.props.currentEvent.eventEditAccess && <Button
                    containerStyle={{ alignSelf: 'flex-end' }}
                    type="clear"
                    title={'Change'}
                    onPress={() => {
                        let acceptedGuests = [...this.props.currentEvent.invitees].filter(i => i.response == "ACCEPTED")
                        let assigned = this.state.formValue.assignees.value || []
                        this.props.navigation.navigate("AssigneesScreen", {
                            type: "Assigned",
                            hostId: this.props.userData.id,
                            guests: acceptedGuests,
                            assignees: this.state.formValue.assignees.value,
                            onClickAssign: (list) => {
                                //this.setState({assignees:list})
                                let l = []
                                list.map(i => {
                                    if (assigned.find(j => j.userId == i.userId)) {
                                        l.push(i)
                                    } else {
                                        let obj = i
                                        obj.report = "New"
                                        l.push(obj)
                                    }
                                })
                                this.handleTextAndEditableUpdate("assignees", l, true)
                            },
                        })
                    }}
                />}
            </View>
            {
                entries.map((each, index) => {
                    return <Pressable
                        key={index}
                        // onPress={() => selectContact(item)}
                        style={{
                            flexDirection: "row",
                            backgroundColor: '#fff',
                            //minHeight: verticalScale(60),
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

    renderCategoryPicker = () => {
        const { activityTypeName } = this.state.formValue
        let dataset = []
        this.props.activityTypes.map(i => {
            dataset.push({
                value: i.activityTypeName,
                label: i.activityTypeName,
                id: i.id,
                key: i.id
            })
        })

        return <View style={styles.section}>
            <AppText style={[styles.heading]}>Category</AppText>
            <ModalSelector
                overlayStyle={{ paddingVertical: verticalScale(100), }}
                data={dataset}
                initValue={activityTypeName?.value}
                onChange={(option) => {
                    this.handleTextAndEditableUpdate("activityTypeName", option.value, true)
                }}
                header={
                    <View style={{ marginBottom: 5, alignItems: 'center', }}>
                        <Text style={{ fontSize: moderateScale(15), color: 'black',fontFamily:"Mulish" }}>Please select a category</Text>
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
                    }}>{activityTypeName?.value}</Text>
                    <View
                        style={{ transform: [{ scale: moderateScale(0.8) }], marginLeft: 'auto' }}
                    >
                        <SvgIcons.DownArrow
                        />
                    </View>
                </View>
            </ModalSelector>
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
                <AppText style={{
                    color: 'rgba(53, 93, 155, 1)',
                    fontFamily: 'Mulish-Regular'
                }}>{activityTypeName.value ? activityTypeName.value : "Please select a category"}</AppText>
                <View
                    style={{ transform: [{ scale: moderateScale(0.8) }], marginLeft: 'auto' }}
                >
                    <SvgIcons.DownArrow
                    />
                </View>
            </Pressable>
            <ReactNativePickerModule
                ref={this.catPickerRef}
                value={activityTypeName.value ? activityTypeName.value : ""}
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
                    this.handleTextAndEditableUpdate("activityTypeName", value, true)
                }}
            /> */}
        </View>
    }

    renderDateSelector = () => {

        return <View style={styles.section}>
            <AppText style={styles.heading}>Date</AppText>
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
                    paddingHorizontal: moderateScale(8),
                    justifyContent: 'space-between'
                }}>

                <Text style={{
                    color: 'rgba(53, 93, 155, 1)',
                    fontFamily: 'Mulish-Regular',
                    marginLeft: moderateScale(6)
                }}>{moment(this.state.formValue.date.value).format("DD MMM[,] YYYY")}</Text>
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
                display={Platform.OS=='ios'?'inline':'default'}
                minimumDate={new Date()}
                date={new Date(this.state.formValue.date.value)}
                //maximumDate={new Date(this.props.currentEvent.timings[0].slot)}
                onConfirm={(date) => {
                    this.setState({ showDatePicker: false })
                    this.handleTextAndEditableUpdate("date", date, true)
                }}
                onCancel={() => this.setState({ showDatePicker: false })}
            />
        </View>
    }

    render() {
        //const data = this.props.currentTask
        const { formValue } = this.state
        //console.log(formValue)
        if (!this.props.currentTask) {
            return <></>
        }

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
                title={this.props.currentTask.name}
                rightComponent={this.renderRightHeader()}
            />
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: moderateScale(10)
                }}
            >
                <View style={{
                    marginHorizontal: moderateScale(15)
                }}>
                    {/* <View style={styles.section}>
                        <AppText style={styles.heading}>Task Name</AppText>
                        <DoubleTapInput
                            textInputProps={{
                                value: formValue.taskName.value,
                                editable: formValue.taskName.inEditMode,
                                onChangeText: (val) => { this.handleTextAndEditableUpdate("taskName", val) },
                                style: {
                                    color: '#88879C'
                                }
                            }}
                            onDoubleTap={() => {
                                this.handleTextAndEditableUpdate("taskName", undefined, true)
                            }}
                            pressableProps={{
                                ...(formValue.taskName.inEditMode && { pointerEvents: 'none' })
                            }}
                        />
                    </View> */}
                    {this.renderTaskStatus()}
                    {this.state.formValue.date.inEditMode ?
                        this.renderDateSelector()
                        : <Pressable
                            onLongPress={() => {
                                this.handleTextAndEditableUpdate("date", undefined, true)
                            }}
                        >
                            {this.renderDate()}
                        </Pressable>
                    }
                    {formValue.amount.inEditMode ? <View style={styles.section}>
                        <Text style={styles.heading}>Total Amount</Text>
                        <TextInput style={{
                            color: '#88879C',
                            borderBottomWidth: 0.5,
                            fontSize: 15,
                            paddingVertical: -10
                        }}
                            onChangeText={(val) => {
                                this.handleTextAndEditableUpdate("amount", val, true)
                                if (!validator.isNumeric(val) || Number(val) < 0) {
                                    this.setState({ formValueAmountErrMsg: "Please Enter Valid Amount" })
                                } else {
                                    this.setState({ formValueAmountErrMsg: "" })
                                }
                            }}
                            value={String(this.state.formValue.amount.value)}
                            keyboardType='number-pad'
                            returnKeyType='done'
                            onSubmitEditing={Keyboard.dismiss}
                        />
                        <View>
                            <Text style={{ color: "red" }}>{this.state.formValueAmountErrMsg}</Text>
                        </View>
                    </View>
                        : <Pressable
                            onLongPress={() => {
                                this.handleTextAndEditableUpdate("amount", undefined, true)
                            }}
                        >
                            <View style={styles.section}>

                                <Text style={styles.heading}>Total Amount</Text>

                                <Text style={{
                                    color: '#88879C'
                                }}>{String(this.state.formValue.amount.value)}</Text>

                            </View>
                        </Pressable>
                    }
                    {this.renderAssignees()}

                    {this.state.formValue.activityTypeName.inEditMode ?
                        this.renderCategoryPicker()
                        :
                        <Pressable
                            onLongPress={() => {
                                this.handleTextAndEditableUpdate("activityTypeName", undefined, true)
                            }}
                        >
                            <View style={styles.section}>

                                <AppText style={[styles.heading]}>Category</AppText>

                                <AppText style={{
                                    color: '#88879C'
                                }}>{formValue.activityTypeName.value}</AppText>

                            </View>
                        </Pressable>}
                    {<Pressable
                        onLongPress={() => {
                            this.handleTextAndEditableUpdate("note", undefined, true)
                        }}
                        style={styles.section}>
                        <AppText style={[styles.heading]}>Note</AppText>
                        {formValue.note.inEditMode ? <TextInput
                            value={formValue.note.value}
                            //editable={formValue.note.inEditMode}
                            onChangeText={(val) => this.handleTextAndEditableUpdate("note", val)}
                            style={{
                                color: '#88879C',
                                borderBottomWidth: verticalScale(1),
                                borderBottomColor: '#355D9B',
                                paddingVertical: -10,
                            }}
                            multiline={true}
                        /> : <Text style={{ color: '#88879C', fontFamily: "Mulish" }}>{formValue.note.value}</Text>}
                    </Pressable>}
                </View>
            </KeyboardAwareScrollView>
        </ImageBackground >
    }
}


const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
    heading: {
        fontSize: moderateScale(16),
        marginBottom: verticalScale(6),
        color: '#355D9B',
        fontFamily: 'Mulish-Bold'
    },
    //
    section: {
        backgroundColor: '#fff',
        padding: verticalScale(10),
        borderRadius: verticalScale(10),
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
    const { currentTask } = state.events
    const { userData } = state.user

    return {
        activityTypes,
        currentEvent,
        currentTask,
        userData
    }
}

export default connect(mapStateToProps)(AddTask)