import React, { useEffect, useState } from "react";
import { Keyboard, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import axios from '../../../axios'

import OTPInputView from "@twotalltotems/react-native-otp-input";
import { Button } from "react-native-elements";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../store/userSlice";
import * as SvgIcons from '../../../assets/svg-icons'
import { moderateScale, verticalScale } from "../../../utils/scalingUnits";
import AppButton from "../../../components/UI/button";
import AuthInput from "../../../components/AuthUI/AuthInput";
import { navigationRef } from "../../../navigation/navigationRef";
import messaging from '@react-native-firebase/messaging';

const OtpValidate = ({ route, navigation }) => {

   const { phoneNumber } = route.params;
   const [otp, setOtp] = useState("")

   const [displayMsg, setDisplayMsg] = useState("")
   const [otpLoading, setOtpLoading] = useState(false)

   const [errMsg, setErrMsg] = useState("");

   const dispatch = useDispatch()

   useEffect(() => {
      setDisplayMsg(`OTP Sent to Your phone  ${phoneNumber} `)
   }, [])

   const handleValidate = async (otp) => {
      console.log(otp)
      if (otp.length > 0) {
         const token = await messaging().getToken();
         axios.post(
            "/sms/validateOtp",
            {
               otpType: "LOGIN",
               mobileNumber: phoneNumber,
               otp: otp,
               currentDeviceId: token
            }
         ).then(r => {

            if (r.data.status == "success") {
               dispatch(loginSuccess(r.data))
               /* setTimeout(() => {
                  navigationRef.navigate("ChangePassword")
               }, 1500) */
            } else {
               setErrMsg('Incorrect OTP')
            }
         }).catch(e => {
            console.log(e)
            setErrMsg("Service Failed")
         })
      } else {
         setErrMsg("OTP cannot be Empty")
      }
   }

   return (<>
      <ScrollView
         contentContainerStyle={styles.container}
         keyboardShouldPersistTaps='handled'
      >
         <View style={{
            alignSelf: 'center'
         }}>
            <SvgIcons.AppLogo />
            <Text style={styles.message}>
               {displayMsg}
            </Text>
            <Button
               title="Edit Phone Number"
               type="clear"
               onPress={() => navigation.pop()}
            />
         </View>
         <View
            style={{ height: 30 }}
         >

         </View>
         <View style={{
            backgroundColor: '#fff',
            borderRadius: moderateScale(15),
            marginHorizontal: moderateScale(40),
            minHeight: verticalScale(10),
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
            //padding: moderateScale(35)
         }}>
            <AuthInput
               // label={formValue[key].label}
               containerStyle={{ paddingHorizontal: 30, }}
               style={{
                  width: '100%',
               }}
               placeholder={"Enter OTP"}
               value={otp}
               errorMessage={errMsg}
               icon={undefined}
               keyboardType="number-pad"
               returnKeyType='done'
               onSubmitEditing={Keyboard.dismiss}
               onChangeText={(val) => {
                  setOtp(val)
                  if (String(val).length == 6) {
                     handleValidate(val)
                  }
               }}
            />
            <Button
               containerStyle={{ alignSelf: 'flex-end', padding: 10 }}
               title="RESEND OTP"
               type="clear"
               disabled={otpLoading}
               onPress={() => {
                  setOtpLoading(true)
                  axios.post(
                     "/sms/sendOtp",
                     {
                        otpType: "LOGIN",
                        phoneNumber: phoneNumber
                     }
                  ).then(r => {
                     console.log(r.data.status)
                     setOtpLoading(false)
                     if (r.data.status == "success") {
                        setDisplayMsg(`OTP Resent to Your phone  ${phoneNumber} `)
                     } else {
                        setDisplayMsg(`Failed - Resent OTP to Your phone  ${phoneNumber} `)
                     }
                  }).catch(e => {
                     console.log(e)
                     setOtpLoading(false)
                     setDisplayMsg(`Failed - Resent OTP to Your phone  ${phoneNumber} `)
                  })
               }}
            />
         </View>

         <View style={{
            // backgroundColor: '#fff',
            // borderRadius: moderateScale(15),
            marginHorizontal: moderateScale(40),
            //minHeight: verticalScale(200),
            padding: moderateScale(35),
         }}>

            <AppButton
               title="Validate"
               disabled={false}
               clicked={() => {
                  handleValidate(otp)
               }}
            />
         </View>
      </ScrollView>
   </>

   );
};

const styles = StyleSheet.create({
   container: {
      flexGrow: 1,
      backgroundColor: '#FFFBFB',
      // alignItems: 'center'
   },
   wrapper: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
   },

   underlineStyleBase: {
      width: 30,
      height: 45,
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: 'black',
      color: "black",
      fontSize: 20,
   },

   underlineStyleHighLighted: {
      borderColor: "#03DAC6",
   },

   prompt: {
      fontSize: 24,
      paddingHorizontal: 30,
      paddingBottom: 20,
   },

   message: {
      fontSize: 16,
      paddingHorizontal: 30,
   },

   error: {
      color: "red",
      fontSize: 20
   },
});

export default OtpValidate;