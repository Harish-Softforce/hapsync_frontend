import { View, Text, Pressable, Keyboard, Linking } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import * as SvgIcons from '../../../assets/svg-icons'
import validator from 'validator'
import AuthInput from '../../../components/AuthUI/AuthInput'
import AppButton from '../../../components/UI/button'
import { getAllActivityTypes, register } from '../../../store/actionCreators'

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'
import MultiSelectDropdown from '../../../components/MultiSelectDropdown'
import { moderateScale, verticalScale } from '../../../utils/scalingUnits'
import { useSelector } from 'react-redux'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import Config from 'react-native-config'

import { Button, CheckBox } from 'react-native-elements'
import instance from '../../../axios'
import Toast from 'react-native-toast-message'
import ReactNativeModal from 'react-native-modal'
import ModalSelector from 'react-native-modal-selector'

export default function VendorSignUp(props) {

   const navigation = useNavigation();

   const [loading, setloading] = useState(false)
   const [showOTPModal, setShowOTPModal] = useState(false)
   const [otp, setotp] = useState("")
   const [errOtpMsg, setErrOtpMsg] = useState("")
   const [validateOtp, setValidateOtp] = useState(false)
   const [checkbox, setcheckbox] = useState(false)

   const [formValues, setFormValues] = useState({
      name: {
         label: "Vendor Name",
         value: undefined,
         valid: false,
         errorMessage: undefined,
         inputProps: {},
         icon: <SvgIcons.UserIcon />
      },
      email: {
         label: 'Email',
         value: undefined,
         valid: false,
         errorMessage: undefined,
         inputProps: {},
         icon: <SvgIcons.MailIcon />
      },
      phone: {
         label: 'Mobile Number',
         value: undefined,
         valid: false,
         errorMessage: undefined,
         inputProps: {
            keyboardType: "numeric",
            returnKeyType: 'done',
            onSubmitEditing: Keyboard.dismiss
         },
         icon: <MaterialIcons name="call" size={20} color="#00ADEF" />
      },
      password: {
         label: 'Password',
         value: undefined,
         valid: false,
         errorMessage: undefined,
         inputProps: {
            secureTextEntry: true,
            textContentType: 'oneTimeCode'
         },
         icon: <SvgIcons.KeyIcon />
      },
      confirmPassword: {
         label: 'Confirm Password',
         value: undefined,
         valid: false,
         touched: false,
         errorMessage: undefined,
         inputProps: {
            secureTextEntry: true
         },
         icon: <SvgIcons.KeyIcon />
      },
      website: {
         label: 'Vendor Website',
         value: undefined,
         valid: false,
         errorMessage: undefined,
         inputProps: {},
         icon: <SimpleLineIcons name="globe" size={20} color="#00ADEF" />
      },
   })

   const validate = (key) => {
      let formValue = { ...formValues };

      switch (key) {
         //
         case "name":
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
               formValue[key].errorMessage = "Invalid Phone Number";
               formValue[key].valid = false;
            } else {
               formValue[key].errorMessage = undefined;
               formValue[key].valid = true;
            }
            break;
         case "password":
            let error = [];
            if (!validator.matches(formValue[key].value, "[A-Za-z]")) {
               error.push("At least one letter");
               formValue[key].valid = false;
            }
            if (!validator.matches(formValue[key].value, "^.{6,}$")) {
               error.push("At least 6 characters");
               formValue[key].valid = false;
            }
            // if there are no errors in password
            if (error.length === 0) {
               formValue[key].errorMessage = undefined;
               formValue[key].valid = true;
            }
            formValue[key].errorMessage = error;

            // check confirm password equality if only confirm password has been touched
            if (formValue.confirmPassword.touched === true) {
               if (
                  formValue[key].value !== formValue.confirmPassword.value
               ) {
                  formValue.confirmPassword.errorMessage = "Passwords do not match";
                  formValue.confirmPassword.valid = false;
               } else {
                  formValue.confirmPassword.errorMessage = undefined;
                  formValue.confirmPassword.valid = true;
               }
            }
            break;
         case "confirmPassword":
            // set touched to true
            formValue[key].touched = true;

            if (formValue[key].value !== formValue.password.value) {
               formValue[key].errorMessage = "Passwords do not match";
               formValue[key].valid = false;
            } else {
               formValue[key].errorMessage = undefined;
               formValue[key].valid = true;
            }
            break;
         case "website":
            if (!validator.isURL(formValue[key].value, { protocols: ['http', 'https'], require_protocol: true })) {
               formValue[
                  key
               ].errorMessage = `Enter a valid url`;
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
         default:
         // code block
      }
   }

   const handleTextChange = (key, value) => {
      let formValue = { ...formValues }
      formValue[key].value = value

      setFormValues(formValue)

      validate(key);
   }

   const checkSubmitButtonValid = () => {
      let buttonValid = true
      let formValue = { ...formValues }

      if (!validateOtp || !checkbox) {
         return false
      }

      for (let key in formValue) {
         buttonValid = buttonValid && formValue[key].valid
      }
      if (selectedTypes.length && currentInputVal == location?.address && buttonValid) {
         buttonValid = true
      } else {
         buttonValid = false
      }

      return buttonValid
   }

   const submit = async () => {

      let formValue = { ...formValues }

      let arr = [...selectedTypes].map(i => {
         return {
            activityTypeId: i.id
         }
      })

      const data = {
         "email": formValue.email.value,
         "userName": formValue.name.value,
         "password": formValue.password.value,
         "confirmPassword": formValue.confirmPassword.value,
         "phone": formValue.phone.value,
         "role": "VENDOR",
         "website": formValue.website.value,
         "address": location.address,
         "latitude": location.latitude,
         "longitude": location.longitude,
         "placeId": location.placeId,
         "vendorActivityTypes": arr,
         countryCode: countryCode
      }

      await register(data, navigation)

      // clear form
      let formVal = { ...formValue }
      for (let key in formVal) {
         formVal[key].value = undefined
         formVal[key].valid = false
         formVal[key].errorMessage = undefined
      }
      setFormValues(formVal)
      setLocation(null)
      setCurrentInputVal("")
      setSelectedTypes([])
      setkey(key + 1)
   }

   const [selectedTypes, setSelectedTypes] = useState([])

   const [location, setLocation] = useState(null)
   const [currentInputVal, setCurrentInputVal] = useState("")
   const [key, setkey] = useState(1)


   useEffect(() => {
      getAllActivityTypes()
   }, [])

   const activityTypes = useSelector(state => state.events.activityTypes)

   let items = []
   activityTypes.map(i => {
      items.push({
         name: i.activityTypeName,
         id: i.id
      })
   })

   const modal = () => {
      return <ReactNativeModal isVisible={showOTPModal}>
         <View style={{ backgroundColor: "#fff", borderRadius: moderateScale(5), padding: moderateScale(10), marginBottom: verticalScale(40) }}>
            <Text style={{ fontSize: moderateScale(16), alignSelf: "center", fontFamily: "Mulish-Bold", }}>
               Mobile Verification</Text>

            {validateOtp ?
               <View style={{}}>
                  <View style={{ flexDirection: "row", marginVertical: moderateScale(10), justifyContent: "center" }}>
                     <MaterialIcons name='verified' color={"#00ff0b"} size={moderateScale(35)} />
                     <Text style={{ color: "green", fontSize: moderateScale(15), fontFamily: "Mulish-Regular", marginTop: moderateScale(10) }}>
                        {" Verified Successfully"}
                     </Text>
                  </View>
                  <Button
                     title="Done"
                     containerStyle={{ marginTop: moderateScale(5) }}
                     buttonStyle={{ backgroundColor: "grey" }}
                     onPress={() => {
                        Keyboard.dismiss()
                        setShowOTPModal(false)
                     }}
                  />
               </View>
               : <>
                  <Text style={{ fontSize: moderateScale(14), alignSelf: "center", fontFamily: "Mulish-Regular", marginTop: moderateScale(10) }}>
                     {"Please Enter the OTP Sent to - " + formValues["phone"].value}
                  </Text>
                  <View style={{ paddingHorizontal: moderateScale(10) }}>
                     <AuthInput
                        placeholder={"Enter OTP"}
                        value={otp}
                        style={{ fontSize: moderateScale(17) }}
                        errorMessage={errOtpMsg}
                        icon={undefined}
                        keyboardType="numeric"
                        returnKeyType='done'
                        onSubmitEditing={Keyboard.dismiss}
                        onChangeText={(val) => {
                           setotp(val)
                        }}
                     />
                  </View>
                  <View style={{ height: moderateScale(10) }}></View>
                  <View style={{ flexDirection: 'row' }}>
                     <Button
                        title="Cancel"
                        containerStyle={{ flex: 1, }}
                        buttonStyle={{ backgroundColor: "grey" }}
                        onPress={() => {
                           setShowOTPModal(false)
                        }}
                     />
                     <View style={{ width: moderateScale(10) }}></View>
                     <Button
                        title="Validate"
                        loading={loading}
                        containerStyle={{ flex: 1 }}
                        buttonStyle={{ backgroundColor: "#00ADEF" }}
                        onPress={() => {
                           if (otp.length > 0) {
                              setloading(true)
                              instance.post(
                                 "/sms/validateOtp",
                                 {
                                    otpType: "SIGNUP",
                                    mobileNumber: formValues["phone"].value,
                                    otp: otp
                                 }
                              ).then(r => {
                                 //console.log(r.data.status)
                                 if (r.data.status == "success") {
                                    //setShowOTPModal(false)
                                    setValidateOtp(true)
                                 } else {
                                    setErrOtpMsg('Incorrect OTP')
                                 }
                                 setloading(false)
                              }).catch(e => {
                                 console.log(e)
                                 setErrOtpMsg("Service Failed")
                                 setloading(false)
                              })
                           } else {
                              setErrOtpMsg("OTP cannot be Empty")
                           }
                        }}
                     />
                  </View>
               </>
            }
         </View>

      </ReactNativeModal>
   }

   const [countryCode, setcountryCode] = useState(props.deviceCountryCode)


   let dataset = props.countryCodes?.map((i, j) => {
      return {
         label: i.code + "  " + i.description,
         value: i.code,
         key: j
      }
   })

   const ref = useRef(null);

   return (
      <View style={{ padding: 15 }}>
         {modal()}
         {
            Object.keys(formValues).map((key, index) => {
               let formValue = { ...formValues }
               let label = formValue[key].label;

               if (key == "phone") {
                  return <View key={key} style={{
                  }}>
                     <View style={{ flexDirection: "row", alignItems: "center", }}>
                        <AuthInput
                           // label={formValue[key].label}
                           containerStyle={{ marginBottom: 3, marginTop: 2, flex: 1 }}
                           placeholder={label}
                           value={formValue[key].value}
                           errorMessage={formValue[key].errorMessage}
                           icon={formValue[key].icon}
                           {...formValue[key].inputProps}
                           countryCode={<View>
                              <ModalSelector
                                 data={dataset}
                                 header={
                                    <View style={{ padding: 5, alignItems: 'center', }}>
                                       <Text style={{ fontSize: moderateScale(15), color: 'black', fontFamily:"Mulish" }}>Select Country Code</Text>
                                    </View>
                                 }
                                 optionTextStyle={{fontFamily:"Mulish"}}
                                 cancelTextStyle={{fontFamily:"Mulish"}}
                                 cancelText="Close"
                                 initValue={countryCode}
                                 onChange={(option) => {
                                    setValidateOtp(false)
                                    setcountryCode(option.value)
                                 }} >
                                 <View
                                    style={{
                                       borderWidth: 0.5, borderRadius: 2,
                                       padding: moderateScale(5), borderColor: "#00ADEF", marginRight: 2, marginLeft: -5,
                                       flexDirection: "row",
                                       alignItems: 'center'
                                    }}
                                 >
                                    <Text>{countryCode}</Text>
                                    <FontAwesome name='angle-down' style={{ fontSize: moderateScale(15), color: "#00ADEF", marginLeft: 5 }} />
                                 </View>
                              </ModalSelector>
                           </View>}

                           onChangeText={(val) => {
                              setValidateOtp(false)
                              handleTextChange(key, val)
                           }}
                        />
                        {validateOtp ? <MaterialIcons name='verified' color={"#32CD32"} size={moderateScale(29)} /> : <>
                           {formValue[key].valid && <Button
                              title={"VERIFY"}
                              style={{}}
                              titleStyle={{ fontFamily: "Mulish-Bold", color: "#00ADEF" }}
                              type="clear"
                              onPress={() => {
                                 Keyboard.dismiss()
                                 setloading(true)
                                 setValidateOtp(false)
                                 setotp("")
                                 setErrOtpMsg("")
                                 instance.post(
                                    "/sms/sendOtp",
                                    {
                                       otpType: "SIGNUP",
                                       phoneNumber: formValue[key].value,
                                       countryCode: countryCode
                                    }
                                 ).then(r => {
                                    //console.log(r.data.status)
                                    if (r.data.status == "success") {
                                       setShowOTPModal(true)
                                    } else {
                                       Toast.show({
                                          type: 'error',
                                          text1: r.data.status
                                       })
                                    }
                                    setloading(false)
                                 }).catch(e => {
                                    console.log(e)
                                    Toast.show({
                                       type: 'error',
                                       text1: 'Failed Service'
                                    })
                                    setloading(false)
                                 })
                              }}
                              loading={loading}
                           />}
                        </>
                        }
                     </View>
                  </View>
               }

               return <View key={key} style={{
                  width: '100%',
                  minHeight: 60,
                  alignSelf: 'center'
               }}>
                  <AuthInput
                     // label={formValue[key].label}
                     containerStyle={{ marginBottom: 3, marginTop: 2 }}
                     placeholder={label}
                     value={formValue[key].value}
                     errorMessage={formValue[key].errorMessage}
                     icon={formValue[key].icon}
                     {...formValue[key].inputProps}

                     onChangeText={(val) => handleTextChange(key, val)}
                  />
               </View>
            })
         }
         <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ marginRight: 16, marginTop: 10 }}>
               <MaterialCommunityIcons name="map-marker-radius" size={20} color="#00ADEF" />
            </View>
            <View style={{ flex: 1 }}>

               <GooglePlacesAutocomplete
                  placeholder='Vendor Address'
                  enablePoweredByContainer={false}
                  fetchDetails={true}
                  onPress={(data, details) => {
                     // 'details' is provided when fetchDetails = true
                     //console.log(data, details);
                     let l = {
                        "address": data.description,
                        "latitude": details?.geometry.location.lat,
                        "longitude": details?.geometry.location.lng,
                        "placeId": data.place_id
                     }
                     setLocation(l)
                     setCurrentInputVal(data.description)
                  }}
                  query={{
                     key: Config.GOOGLE_PLACE_API_KEY,
                     language: 'en',
                  }}
                  styles={{
                     textInput: {
                        //color: '#000',
                        borderRadius: moderateScale(10),
                        borderColor: 'rgba(53, 93, 155, 1)',
                        color: 'rgba(53, 93, 155, 1)',
                        padding: 6,
                        height: moderateScale(42),
                        borderWidth: 0.5,
                        //margin: moderateScale(6)
                     },
                  }}
                  textInputProps={{
                     onChangeText: (val) => setCurrentInputVal(val),
                     value: currentInputVal // undefined value
                  }}
               //keyboardShouldPersistTaps="handled"
               />
            </View>
         </View>

         <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <View style={{ marginRight: 16 }}>
               <Feather name="type" size={20} color="#00ADEF" />
            </View>
            <View key={key} style={{ flex: 1 }}>
               <MultiSelectDropdown
                  data={items}
                  onConfirm={(selected) => {
                     setSelectedTypes(selected)
                  }}
               />
            </View>
         </View>

         <Text
            style={{
               marginVertical: moderateScale(12),
               fontFamily: "Mulish-Regular"
            }}
         >Note: Click on Verify (Mobile Number) to enable the signup.</Text>
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CheckBox
               //title='Click Here'
               checked={checkbox}
               onPress={() => {
                  setcheckbox(!checkbox)
               }}
            />
            <View style={{ flexDirection: "row", flexWrap: "wrap", flex: 1 }}>
               <Text style={{ fontFamily: "Mulish-Regular" }}>By clicking the checkbox, agreeing to </Text>
               <Text
                  style={{
                     color: "blue",
                     fontFamily: "Mulish-Regular",
                     textDecorationLine: 'underline',
                  }}
                  onPress={() => {
                     //navigation.navigate("Terms")
                     Linking.canOpenURL('http://hapsync.com/terms.html').then(supported => {
                        if (supported) {
                           Linking.openURL('http://hapsync.com/terms.html').catch(e => {
                              alert("Unable to open link")
                           })
                        } else {
                           console.log("Don't know how to open URI: " + 'http://hapsync.com/terms.html');
                        }
                     })
                  }}
               >
                  {"Terms & Conditions"}
               </Text>
            </View>
         </View>
         <AppButton
            title="SIGNUP"
            clicked={() => submit()}
            disabled={!checkSubmitButtonValid()}
         />
      </View>
   )
}