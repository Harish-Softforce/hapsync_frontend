import { View, Text, Keyboard } from 'react-native'
import React, { useState } from 'react'
import ReactNativeModal from 'react-native-modal'
import { moderateScale, verticalScale } from '../../utils/scalingUnits'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Button } from 'react-native-elements'
import AuthInput from '../AuthUI/AuthInput'
import validator from 'validator';

export default function GuestCountModal(props) {
   const [count, setCount] = useState()

   const [errMsg, setErrMsg] = useState("")

   return (
      <ReactNativeModal isVisible={props?.showCountModal}>
         <View style={{ backgroundColor: "#fff", borderRadius: moderateScale(5), padding: moderateScale(10), marginBottom: verticalScale(50) }}>
            <Text style={{ fontSize: moderateScale(16), alignSelf: "center", fontFamily: "Mulish-Bold", }}>
               Total Count </Text>

            <Text style={{ fontSize: moderateScale(14), alignSelf: "center", fontFamily: "Mulish-Regular", marginTop: moderateScale(10) }}>
               {"Please Enter the Total guests (including you)"}
            </Text>
            <View style={{ paddingHorizontal: moderateScale(10) }}>
               <AuthInput
                  placeholder={"Enter Total Count"}
                  value={count}
                  style={{ fontSize: moderateScale(17) }}
                  errorMessage={errMsg}
                  icon={undefined}
                  keyboardType="numeric"
                  returnKeyType='done'
                  onSubmitEditing={Keyboard.dismiss}
                  onChangeText={(val) => {
                     setCount(val)
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
                     setCount(undefined)
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

                     let valid = false

                     if (count == "" || count == undefined) {
                        setErrMsg("Empty value is not allowed")
                     } else if (!validator.isInt(String(count))) {
                        setErrMsg("Invalid value")
                     } else if (String(count).length > 2) {
                        setErrMsg("Value should not be more than 99")
                     } else if (count == 0) {
                        setErrMsg("Zero is not allowed")
                     } else {
                        valid = true
                        setErrMsg("")
                     }
                     if (valid) {
                        setCount(undefined)
                        props?.hideModal(false)
                        setTimeout(() => {
                           props?.onConfirm(count)
                        }, 1000)
                     }
                  }}
               />
            </View>
         </View>
      </ReactNativeModal>
   )
}