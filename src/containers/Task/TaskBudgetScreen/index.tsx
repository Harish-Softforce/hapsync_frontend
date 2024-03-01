import * as React from 'react'
import {
    View,
    ImageBackground,
    ScrollView, StyleSheet,
    Dimensions,
    Pressable,
    Switch,
    Image,
    Modal,
    Text,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from 'react-native'

import AppText from '../../../components/UI/AppText'
import TopBar from '../../../components/TopBar'
import AppInput from '../../../components/UI/Input'


import { moderateScale, verticalScale } from '../../../utils/scalingUnits'

import * as SvgIcons from '../../../assets/svg-icons'

import { launchCamera, launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import EvilIcons from "react-native-vector-icons/EvilIcons"

import Toast from 'react-native-toast-message'
import AppButton from '../../../components/UI/button'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as SvgImage from '../../../assets/svg-icons'
import { TextInput } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { updateBudget } from '../../../store/actionCreators'
import validator from 'validator'

import 'react-native-get-random-values'
import ImagePicker from 'react-native-image-crop-picker';
import { v4 as uuidv4 } from 'uuid';
import DashedLine from 'react-native-dashed-line';

class EventTasks extends React.Component {
    state = {
        selectedImage: undefined,
        selectedImages: [],
        //
        formValue: {
            note: {
                value: "",
                inEditMode: false
            },
            amount: {
                value: "",
                inEditMode: false
            },
            payments: {
                value: [],
                inEditMode: false
            },
            receipts: {
                value: [],
                inEditMode: false
            }
        },
        formValueAmountErrMsg: "",

        paymentName: "",
        paymentAmount: "",
        selectedDate: new Date(),
        validPayment: false,
        //
        budgetEdited: false,
        modalVisible: false,
        showDatePicker: false,
    }

    componentDidMount() {

        this.setState(prevState => ({
            ...prevState,
            formValue: {
                note: {
                    value: this.props.currentTask?.budgetRequest.notes,
                    inEditMode: false
                },
                amount: {
                    value: this.props.currentTask?.budget,
                    inEditMode: false
                },
                payments: {
                    value: this.props.currentTask?.budgetRequest.payments,
                    inEditMode: false
                },
                receipts: {
                    value: this.props.currentTask?.budgetRequest.receipts,
                    inEditMode: false
                }
            }
        }))
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.currentTask != this.props.currentTask) {
            this.setState(prevState => ({
                ...prevState,
                formValue: {
                    note: {
                        value: this.props.currentTask.budgetRequest.notes,
                        inEditMode: false
                    },
                    amount: {
                        value: this.props.currentTask.budget,
                        inEditMode: false
                    },
                    payments: {
                        value: this.props.currentTask.budgetRequest.payments,
                        inEditMode: false
                    },
                    receipts: {
                        value: this.props.currentTask.budgetRequest.receipts,
                        inEditMode: false
                    }
                }
            }))
        }
    }


    handleTextAndEditableUpdate = (key: string, value: any, inEditMode: boolean) => {
        if (this.props.currentEvent.taskAccess) {
            const formValue = { ...this.state.formValue };
            const { budgetEdited } = this.state

            if (!budgetEdited) {
                this.setState({ budgetEdited: true })
            }

            let newData = {
                ...formValue[key],
                ...(value != undefined && { value }),
                ...(inEditMode && { inEditMode }),
            }

            formValue[key] = newData

            this.setState({ formValue })
            this.setState({
                paymentName: "",
                paymentAmount: "",
                selectedDate: new Date(),
            })
        }
    }

    submitEdits = () => {
        if (this.state.formValueAmountErrMsg == "") {
            let formValue = { ...this.state.formValue }
            for (let key in formValue) {
                formValue[key].inEditMode = false
            }
            //console.log(this.state)
            //console.log(this.props.currentTask)

            let obj = { ...this.props.currentTask }
            obj.eventId = this.props.currentEvent.id
            obj.userId = this.props.userData.id
            obj = {
                ...obj,
                budget: this.state.formValue.amount.value,
                budgetRequest: {
                    ...obj.budgetRequest,
                    notes: this.state.formValue.note.value,
                    payments: this.state.formValue.payments.value,
                    receipts: this.state.formValue.receipts.value,
                }
            }
            //console.log(obj)
            updateBudget(obj)

            this.setState({ budgetEdited: false, formValue })
        }
    }

    renderRightHeaderComp = () => {

        return this.state.budgetEdited ?
            <Pressable
                onPress={this.submitEdits}
            ><MaterialIcons
                    name="check"
                    style={{
                        fontSize: verticalScale(26),
                        color: '#355D9B'
                    }}
                /></Pressable> : undefined

    }


    handleImagePick = async () => {
        const options: ImageLibraryOptions = {
            mediaType: "photo",
            selectionLimit: 0
        }

        /* launchImageLibrary(options, (res) => {
            if (res.assets) {
                this.handleTextAndEditableUpdate("receipts",res.assets,true)
            }
        }) */
        await ImagePicker.openPicker({
            multiple: true,
            mediaType: "photo",
        }).then(async (files) => {
            console.log(files);
            if (files.length == 1) {
                await ImagePicker.openCropper({
                    path: files[0].path,
                    cropping: true,
                    freeStyleCropEnabled: true,
                    mediaType: "photo"
                }).then(img => {
                    let obj = [{ ...img }]
                    obj[0].fileName = uuidv4()
                    this.handleTextAndEditableUpdate("receipts", obj, true)
                }).catch(e => {
                    console.log(e)
                })
            } else {
                const arr = files.map(obj => {
                    return { ...obj, fileName: uuidv4() }
                })
                this.handleTextAndEditableUpdate("receipts", arr, true)
            }
        }).catch(e => {
            console.log(e)
        })
    }



    renderImagePickView = () => {
        const selectedImages = this.state.formValue.receipts.value
        return <Pressable
            onPress={this.props.currentEvent.taskAccess ? this.handleImagePick : null}
            style={{
                // marginTop: moderateScale(45),
                padding: moderateScale(9),
                minHeight: moderateScale(150),
                backgroundColor: '#fff',
                borderRadius: moderateScale(6),
                borderWidth: 0.1,
                // borderStyle: 'dashed',
                borderColor: '#88879c',
                elevation: 5,
                marginBottom: moderateScale(15),
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            {selectedImages.length > 0 ? <>
                <AppText style={{ color: 'rgba(0, 173, 239, 1)' }}>Tap to change</AppText>
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginRight: moderateScale(-9),
                    }}
                >
                    {selectedImages?.map((image, index) => {
                        return <Image
                            key={index}
                            style={{
                                flex: 1,
                                minHeight: verticalScale(70),
                                marginRight: moderateScale(10),
                                minWidth: '45%',
                                marginTop: moderateScale(10),
                                borderRadius: moderateScale(5)
                            }}
                            source={{ uri: image.receiptUrl ? image.receiptUrl : image.path }}
                        // source={require("../../../assets/images/splashscreen.png")}
                        />
                    })}
                </View>
            </> : <>
                <View style={{
                    backgroundColor: '#00ADEF',
                    height: verticalScale(50),
                    width: verticalScale(50),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: verticalScale(50)
                }}>
                    <SvgIcons.ReceiptIcon
                        style={{

                            transform: [{ scale: moderateScale(1.0) }]
                        }}
                    />
                </View>
                <AppText style={[styles.heading, { marginTop: 6 }]}>Add Receipts</AppText>
                <AppText style={{ color: 'rgba(0, 173, 239, 1)' }}>
                    (up to 12 Mb)
                </AppText>
            </>}


        </Pressable>
    }

    renderDateSelector = () => {

        return <View style={{}}>
            <AppText style={[styles.heading]}>Date</AppText>
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

                <AppText style={{
                    color: 'rgba(53, 93, 155, 1)',
                    fontFamily: 'Mulish-Regular',
                    marginLeft: moderateScale(6)
                }}>{moment(this.state.selectedDate).format("DD MMM[,] YYYY")}</AppText>
                <EvilIcons
                    name="calendar"
                    style={{ fontSize: 40, color: 'rgba(0, 173, 239, 1)' }}
                />
            </Pressable>
            <DateTimePickerModal
                isVisible={this.state.showDatePicker}
                mode="date"
                display={Platform.OS=='ios'?'inline':'default'}
                onConfirm={(date) => {
                    this.setState({ selectedDate: date, showDatePicker: false })
                }}
                onCancel={() => this.setState({ showDatePicker: false })}
            />
        </View>
    }

    renderPaymentModal = () => {
        return <Modal visible={this.state.modalVisible} animationType="slide"
            transparent={true}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <Pressable
                    onPress={() => this.setState({ modalVisible: false })}
                    style={{
                        flex: 1,
                        //backgroundColor:'rgba(53, 93, 155,0.2)',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        justifyContent: 'flex-end',
                    }}>
                    <Pressable
                        //onPress={()=>{}}
                        style={{
                            marginHorizontal: moderateScale(11),
                            backgroundColor: '#fff',
                            minHeight: verticalScale(100),
                            paddingVertical: verticalScale(11),
                            borderRadius: verticalScale(10),
                            marginBottom: 10
                        }}>
                        <View style={{ paddingHorizontal: 20 }}>
                            <View style={{ alignSelf: 'center' }}>
                                <AppText style={[{ color: '#355D9B', fontSize: moderateScale(15), fontFamily: 'Mulish-Bold' }]}>Add Payment</AppText>
                            </View>
                            <View>
                                <AppInput
                                    onChangeText={(val) => {
                                        if (val !== "" && validator.isNumeric(this.state.paymentAmount)) {
                                            this.setState({ validPayment: true })
                                        } else {
                                            this.setState({ validPayment: false })
                                        }
                                        this.setState({ paymentName: val })
                                    }}
                                    value={this.state.paymentName}
                                    label={"Name"}
                                    placeholder="Enter Name"
                                    labelStyle={styles.heading}
                                    style={{ fontFamily: 'Mulish-Light' }}
                                />
                            </View>
                            <View style={{ marginVertical: verticalScale(10) }}>
                                <AppInput
                                    onChangeText={(val) => {
                                        if (this.state.paymentName !== "" && validator.isNumeric(val)) {
                                            this.setState({ validPayment: true })
                                        } else {
                                            this.setState({ validPayment: false })
                                        }
                                        this.setState({ paymentAmount: val })
                                    }}
                                    value={this.state.paymentAmount}
                                    label={"Amount"}
                                    labelStyle={styles.heading}
                                    keyboardType='number-pad'
                                    returnKeyType='done'
                                    onSubmitEditing={Keyboard.dismiss}
                                    placeholder="Enter Amount"
                                    style={{ fontFamily: 'Mulish-Light', }}
                                />
                            </View>
                            <View>
                                {this.renderDateSelector()}
                            </View>

                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginTop: moderateScale(15),
                            marginHorizontal: moderateScale(15)
                        }}>
                            <AppButton
                                clicked={() => this.setState({ modalVisible: false })}
                                title="Cancel"
                                style={[styles.button, {
                                    backgroundColor: '#00ADEF',
                                    marginRight: moderateScale(10)
                                }]}
                            />
                            <AppButton
                                clicked={() => {
                                    if (this.state.validPayment) {
                                        this.setState({
                                            modalVisible: false
                                        })
                                        let val = [...this.state.formValue.payments.value]
                                        val.push({
                                            amount: this.state.paymentAmount,
                                            date: moment(this.state.selectedDate).format("YYYY-MM-DD"),
                                            name: this.state.paymentName
                                        })
                                        this.handleTextAndEditableUpdate("payments", val, true)
                                    }
                                }}
                                title="OK"
                                style={[{ backgroundColor: this.state.validPayment ? '#355D9B' : 'grey' }, styles.button]}
                            />
                        </View>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    }

    renderPayments = () => {
        const payments = this.state.formValue.payments.value

        return <View style={styles.section}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
                backgroundColor: "#faf4ff",
                borderRadius: 5,
                padding: 8

            }}>
                <Text style={styles.heading}>Add Payments</Text>
                <Pressable
                    style={{
                        marginRight: moderateScale(4)
                    }}
                    onPress={() => {
                        if (this.props.currentEvent.taskAccess) {
                            this.setState({ modalVisible: true })
                        }
                    }}
                >
                    <Feather
                        name="plus-circle"
                        style={{
                            color: '#355D9B',
                            fontSize: verticalScale(28)
                        }}
                    />
                </Pressable>
            </View>

            <View style={{
                borderRadius: verticalScale(6),
                backgroundColor: '#fff',
                borderColor: 'grey',
                borderWidth: 0.8,
                // flexDirection: 'row',
                // alignItems: 'center',
                // justifyContent: 'space-between',
                padding: verticalScale(15),
                // marginBottom: 1,
                borderStyle: 'dashed',
            }}>

                {
                    payments.map((each, index) => {
                        return <View
                            key={index}

                        >
                            <View style={{ display: "flex", flexDirection: "row", marginBottom: 15, marginTop: 15, justifyContent: "space-between" }}>

                                <View>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <SvgIcons.AssignedIcon
                                            fill="#73c400"
                                            style={{
                                                transform: [{ scale: moderateScale(1.4) }],
                                                marginLeft: moderateScale(0)
                                            }}
                                        />

                                        <View>
                                            <AppText style={{
                                                color: '#355D9B',
                                                fontFamily: 'Mulish-Bold',
                                                fontSize: moderateScale(14),
                                                fontWeight: "bold",
                                                marginLeft: 15,
                                            }}>
                                                {each.name}
                                            </AppText>
                                            <AppText style={{

                                                color: '#88879C',
                                                fontSize: verticalScale(10),
                                                marginLeft: 15,

                                            }}>
                                                {moment(each.date).format('YYYY-MM-DD')}
                                            </AppText>
                                        </View>


                                    </View>
                                </View>

                                <View>
                                    <AppText style={{
                                        color: '#355D9B',
                                        fontSize: verticalScale(15),
                                        fontWeight: "bold",
                                    }}>
                                        {each.amount}
                                    </AppText>
                                </View>
                            </View>
                            <View style={{ width: "100%", marginBottom: 10 }}>
                                <DashedLine dashLength={5} dashThickness={1} dashColor='#88879c' />
                            </View>
                        </View>

                    })
                }
            </View>
        </View>
    }

    render() {
        const data = this.props.route.params?.data
        const { formValue } = this.state

        let paid = 0
        this.props.currentTask?.budgetRequest.payments.map(i => {
            paid = paid + i.amount
        })
        let due = Number(this.props.currentTask?.budget) - Number(paid)

        return <ImageBackground
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
                title={this.props.currentTask?.name}
                rightComponent={this.renderRightHeaderComp()}
            />
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: moderateScale(10)
                }}
                keyboardShouldPersistTaps='handled'
            >

                <View style={{
                    marginHorizontal: moderateScale(15)
                }}>
                    {/* <View style={styles.section}>
                        <Text style={styles.heading}>Task Name</Text>
                        <AppText style={{
                            color: '#88879C'
                        }}>{data?.name}</AppText>
                    </View> */}

                    {formValue.amount.inEditMode ? <View style={styles.section}>
                        <Text style={styles.heading}>Total Amount</Text>
                        <TextInput style={[styles.textval, { borderBottomWidth: 0.5, }]}
                            onChangeText={(val) => {
                                this.handleTextAndEditableUpdate("amount", val, true)
                                if (!validator.isNumeric(val) || Number(val) <0) {
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
                        :
                        <Pressable
                            onLongPress={() => {
                                this.handleTextAndEditableUpdate("amount", undefined, true)
                            }}
                        >
                            <View style={styles.section}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>

                                    <Text style={[styles.heading, { marginTop: 0 }, { marginBottom: 0 }]}>Total Amount</Text>
                                    <Text style={[styles.textval, { fontSize: 26 }, { marginTop: 0 }]}>{this.state.formValue.amount.value}</Text>
                                    <View style={{ width: "100%", marginTop: 30 }}>
                                        <DashedLine dashLength={5} dashThickness={1} dashColor='#88879c' />
                                    </View>

                                </View>



                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <View>


                                        <Text style={styles.textval}>Paid: {paid}</Text>


                                    </View>

                                    <View style={[styles.section, { marginTop: 10 }, { marginBottom: 2 }, { backgroundColor: "#355D9B" }]}>

                                        <Text style={[styles.textval, { color: "#fff" }]}>Due: {due}</Text>
                                    </View>
                                </View>
                            </View>


                        </Pressable>
                    }

                    {/* <AppInput
                            placeholder="500$"
                            placeholderTextColor="#88879C"
                            keyboardType="number-pad"
                        /> */}
                    {formValue.note.inEditMode ?
                        <View style={styles.section}>
                            <Text style={styles.heading}>Notes</Text>
                            <TextInput style={{
                                color: '#88879C',
                                minHeight: verticalScale(45),
                                textAlignVertical: 'top',
                                borderWidth: verticalScale(0.5),
                                borderRadius: verticalScale(6),
                                borderColor: '#355D9B',
                                padding: 5,
                                marginBottom: 5


                            }}
                                onChangeText={(val) => {
                                    this.handleTextAndEditableUpdate("note", val, true)
                                }}
                                value={this.state.formValue.note.value}
                                multiline={true}
                            />

                        </View>
                        :
                        <Pressable
                            onLongPress={() => {
                                this.handleTextAndEditableUpdate("note", undefined, true)
                            }}
                        >
                            <View style={[styles.section, { paddingTop: 10 }]}>
                                <Text style={[styles.heading, { paddingBottom: 0 }]}>Notes</Text>
                                <Text style={{
                                    color: '#88879C',
                                    minHeight: verticalScale(42),
                                    textAlignVertical: 'top',
                                    borderWidth: verticalScale(0.5),
                                    borderRadius: verticalScale(6),
                                    borderColor: '#355D9B',
                                    padding: 5,
                                    marginBottom: 5

                                }}>{this.state.formValue.note.value}</Text>

                            </View>
                        </Pressable>
                    }
                    {this.renderPayments()}
                    {this.renderImagePickView()}
                </View>
                {this.renderPaymentModal()}
            </ScrollView>
        </ImageBackground >
    }
}


const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
    heading: {
        fontSize: moderateScale(15),
        marginBottom: verticalScale(6),
        color: '#355D9B',
        fontFamily: 'Mulish-ExtraBold'
    },
    section: {
        backgroundColor: '#fff',
        padding: verticalScale(10),
        borderRadius: verticalScale(6),
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
    textval: {
        fontSize: moderateScale(15),
        color: '#355D9B',
        fontWeight: "bold"
    },
    button: {
        height: verticalScale(40),
        flex: 1
    }
})

const mapStateToProps = state => {
    const { currentEvent } = state.events
    const { currentTask } = state.events
    const { userData } = state.user

    return {
        currentEvent,
        currentTask,
        userData
    }
}

export default connect(mapStateToProps)(EventTasks)