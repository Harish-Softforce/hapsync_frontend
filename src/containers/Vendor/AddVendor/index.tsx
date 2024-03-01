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

import Text from '../../../components/UI/AppText'
import AppInput from '../../../components/UI/Input'


import TopBar from '../../../components/TopBar'
import { moderateScale, verticalScale } from '../../../utils/scalingUnits'

import * as SvgIcons from '../../../assets/svg-icons'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ReactNativePickerModule from "react-native-picker-module"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import validator from 'validator'
import { customVendor } from '../../../store/actionCreators'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import Config from 'react-native-config'

class AddVendor extends React.Component {
    state = {
        currentInputVal: "",
        formValue: {
            userName: {
                label: 'Name',
                value: undefined,
                valid: false,
                errorMessage: undefined,
                inputProps: {
                    placeholder: 'Enter Name'
                },
            },
            address: {
                label: 'Address',
                value: undefined,
                valid: false,
                errorMessage: undefined,
                inputProps: {
                    placeholder: 'Enter Address'
                },
            },
            phone: {
                label: 'Phone Number',
                value: undefined,
                valid: false,
                errorMessage: undefined,
                inputProps: {
                    placeholder: 'Enter Number',
                },
            },
            email: {
                label: 'Email',
                value: undefined,
                valid: false,
                errorMessage: undefined,
                inputProps: {
                    placeholder: 'Enter Email'
                },
            }
        },
        //
        selectedCategory: undefined,
    }
    catPickerRef = React.createRef()


    validate = (key) => {
        let formValue = this.state.formValue;

        switch (key) {
            // 
            case "userName":
                if (validator.isEmpty(formValue[key].value)) {
                    formValue[
                        key
                    ].errorMessage = `${formValue[key].label} cannot be empty`;
                    formValue[key].valid = false;
                } else {
                    formValue[key].errorMessage = undefined;
                    formValue[key].valid = true;
                }
                break;
            case "address":
                if (validator.isEmpty(formValue[key].value)) {
                    formValue[
                        key
                    ].errorMessage = `${formValue[key].label} cannot be empty`;
                    formValue[key].valid = false;
                } else {
                    formValue[key].errorMessage = undefined;
                    formValue[key].valid = true;
                }
                break;
            //
            case "email":
                if (!validator.isEmail(formValue[key].value)) {
                    formValue[key].errorMessage = "Email is not valid";
                    formValue[key].valid = false;
                } else {
                    formValue[key].errorMessage = undefined;
                    formValue[key].valid = true;
                }
                break;

            case "phone":
                if (!validator.isMobilePhone(formValue[key].value, ['en-IN', 'en-US']) || String(formValue[key].value).length != 10) {
                    formValue[key].errorMessage = "Phone No. is not valid";
                    formValue[key].valid = false;
                } else {
                    formValue[key].errorMessage = undefined;
                    formValue[key].valid = true;
                }
                break;
            default:
            // code block
        }
    }


    renderRightHeaderComp = () => {
        return <Pressable
            onPress={() => {
                console.log("hi")
                let valid = true
                Object.keys(this.state.formValue).map((key) => {
                    if (this.state.formValue[key].valid == false) {
                        valid = false
                    }
                })
                console.log(valid)
                if (valid == true) {
                    const { address, email, phone, userName } = this.state.formValue
                    let obj = {
                        address: address.value,
                        email: email.value,
                        phone: phone.value,
                        name: userName.value,
                        activityId: this.props.route.params.taskId,
                        activityTypeId: this.props.route.params.activityTypeId
                    }
                    customVendor(obj, this.props.navigation, this.props.route.params.eventId)
                } else {

                }
            }}
        >
            <MaterialIcons
                name="check"
                style={{
                    fontSize: verticalScale(26),
                    color: '#355D9B'
                }}
            />
        </Pressable>
    }

    renderCategoryPicker = () => {
        const { selectedCategory } = this.state


        const dataset = [
            {
                value: "Catering",
                label: "Catering",
            },
            {
                value: "Photography",
                label: "Photography",
            },
            {
                value: "Jewellery",
                label: "Jewellery",
            },
            {
                value: "Florists",
                label: "Florists",
            },
        ]

        return <View style={styles.section}>
            <Text style={styles.heading}>Add Category</Text>
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
                    <SvgIcons.DownArrow
                    />
                </View>
            </Pressable>
            {/* <ReactNativePickerModule
                ref={this.catPickerRef}
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
        </View>
    }

    buildFormInputs = () => {
        const { formValue } = this.state;

        return <View>
            {Object.keys(formValue).map((key) => {
                if (key == "address") {
                    return <View
                        key={key}
                        style={styles.section}
                    >
                        <Text style={{
                            fontSize: moderateScale(13),
                            marginVertical: verticalScale(6),
                            color: '#355D9B',
                            fontFamily: 'Mulish-ExtraBold'
                        }}>
                            Enter Address</Text>
                        <GooglePlacesAutocomplete
                            placeholder='Enter Address'
                            enablePoweredByContainer={false}
                            fetchDetails={true}
                            onPress={(data, details) => {
                                let formVal = { ...this.state.formValue }
                                formVal[key].value = data.description

                                this.setState({ formValue: formVal })

                                this.setState({ currentInputVal: data.description })
                                this.validate(key)
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
                                    minHeight: moderateScale(42),
                                    borderWidth: 0.5,
                                    marginRight: moderateScale(6),
                                },
                            }}
                            textInputProps={{
                                onChangeText: (val) => {
                                    this.setState({ currentInputVal: val })
                                },
                                value: this.state?.currentInputVal,
                                placeholderTextColor: "rgba(53, 93, 155, 1)",
                                fontFamily: 'Mulish-Light',
                                //multiline:true
                            }}
                            keyboardShouldPersistTaps="handled"
                            onFail={err => {
                                console.log('error is ', err)
                            }}
                        /></View>
                }
                return <View
                    key={key}
                    style={styles.section}
                ><AppInput
                        onChangeText={(val) => {
                            let formVal = { ...this.state.formValue }
                            formVal[key].value = val

                            this.setState({ formValue: formVal })
                            this.validate(key)
                        }}
                        value={formValue[key].value}
                        {...formValue[key].inputProps}
                        label={formValue[key].label}
                        errorMessage={formValue[key].errorMessage}
                        labelStyle={styles.heading}
                        style={{ fontFamily: 'Mulish-Light' }}
                    />
                </View>
            })}
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
                title="Add Vendor"
                rightComponent={this.renderRightHeaderComp()}
            />
            <KeyboardAwareScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                keyboardShouldPersistTaps={'handled'}
            >
                <View style={{
                    marginHorizontal: moderateScale(20)
                }}>
                    {this.buildFormInputs()}
                    {/* <Text style={[styles.heading, {
                        fontSize: verticalScale(16)
                    }]}>
                        Category
                    </Text>
                    {this.renderCategoryPicker()} */}
                </View>
            </KeyboardAwareScrollView>
        </ImageBackground >
    }
}


const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
    heading: {
        fontSize: moderateScale(13),
        marginVertical: verticalScale(6),
        color: '#355D9B',
        fontFamily: 'Mulish-ExtraBold'
    },
    section: {
        backgroundColor: '#fff',
        padding: verticalScale(15),
        borderRadius: verticalScale(10),
        marginBottom: verticalScale(10),
        paddingTop:verticalScale(5),
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
})


export default AddVendor
