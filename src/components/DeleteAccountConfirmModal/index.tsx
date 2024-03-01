import { View, Text, Keyboard } from 'react-native'
import React, { useState } from 'react'
import ReactNativeModal from 'react-native-modal'
import { moderateScale } from '../../utils/scalingUnits'
import { Button } from 'react-native-elements'

import AuthInput from '../AuthUI/AuthInput'

/* function captchaGenrator(length) {
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
} */

export default function DeleteAccountConfirmModal(props) {
   const [text, setText] = useState()

   const [errMsg, setErrMsg] = useState("")
   const [captchatext, setcaptchatext] = useState("DELETE")

   return (
      <ReactNativeModal isVisible={props?.showCountModal}>
         <View style={{ backgroundColor: "#fff", marginTop: -moderateScale(80), borderRadius: moderateScale(5), padding: moderateScale(10) }}>
            <Text style={{ fontSize: moderateScale(16), alignSelf: "center", fontFamily: "Mulish-Bold", }}>
               Confirmation </Text>

            <Text style={{ fontSize: moderateScale(14), alignSelf: "center", fontFamily: "Mulish-Regular", marginTop: moderateScale(10) }}>
               {`Are you sure you want to delete? \nPlease enter "DELETE" in the textbox below for the confirmation.`}
            </Text>

            <View style={{ paddingHorizontal: moderateScale(10) }}>
               {/* <Text

                  style={{
                     fontSize: moderateScale(15), fontFamily: "Mulish-Regular",
                     marginBottom: -7, marginTop: moderateScale(10),
                  }}>
                  {"Code : " + "DELETE"}</Text> */}
               <AuthInput
                  placeholder={"Enter DELETE"}
                  //label={"Enter the code"}
                  value={text}
                  style={{ fontSize: moderateScale(17) }}
                  errorMessage={errMsg}
                  icon={undefined}
                  onChangeText={(val) => {
                     setText(val)
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
                     setErrMsg("")
                     setText(undefined)
                     props?.hideModal(false)
                  }}
               />
               <View style={{ width: moderateScale(10) }}></View>
               <Button
                  title="Confirm"
                  //loading={loading}
                  containerStyle={{ flex: 1 }}
                  buttonStyle={{ backgroundColor: "#00ADEF" }}
                  onPress={() => {
                     //console.log(text+" "+captchatext)
                     if (text == captchatext) {
                        setErrMsg("")
                        setText(undefined)
                        props?.hideModal(false)
                        setTimeout(() => {
                           props?.onConfirm(text)
                        }, 1000)
                     } else {
                        setErrMsg("Invalid Code")
                     }
                  }}
               />
            </View>
         </View>
      </ReactNativeModal>
   )
}