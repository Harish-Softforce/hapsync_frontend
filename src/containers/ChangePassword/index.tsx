import { View, Text, ImageBackground, ScrollView } from 'react-native'
import React, { useState } from 'react'
import TopBar from '../../components/TopBar'
import { moderateScale, scale, verticalScale } from '../../utils/scalingUnits'
import AuthInput from '../../components/AuthUI/AuthInput'
import AppButton from '../../components/UI/button'

import validator from 'validator'
import { changePassword } from '../../store/actionCreators'
import { useSelector } from 'react-redux'

export default function ChangePassword(props) {

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [errMsg1, setErrMsg1] = useState(undefined)
    const [errMsg2, setErrMsg2] = useState(undefined)

    const data = useSelector((state) => state.user)

    const checkSubmitButtonValid = () => {
        let buttonValid = false

        if (!errMsg1 && !errMsg2 && newPassword.length >= 8) {
            buttonValid = true
        }
        return buttonValid
    }

    return (
        <ImageBackground
            source={require("../../assets/images/blurBG.png")}
            resizeMode="cover"
            imageStyle={{
                width: "100%",
                height: "100%"
            }}
            style={{
                flex: 1
            }}
        >
            <ScrollView contentContainerStyle={{
                flexGrow: 1,
            }}>
                <TopBar
                    style={{ backgroundColor: 'transparent' }}
                    title="Change Password"
                />
                <View style={{
                    flex: 1,
                    margin: moderateScale(20),
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        minHeight: verticalScale(250),
                        borderRadius: verticalScale(10),
                        padding: moderateScale(25),
                        justifyContent: 'space-around'
                    }}>
                        <AuthInput
                            //label={"New Password"}
                            containerStyle={{ paddingHorizontal: 20, }}
                            style={{
                                width: '100%',
                            }}
                            placeholder={"New Password"}
                            value={newPassword}
                            errorMessage={errMsg1}
                            icon={undefined}
                            onChangeText={(val) => {
                                setNewPassword(val)
                            }}
                        />
                        <AuthInput
                            //label={"Confirm Password"}
                            containerStyle={{ paddingHorizontal: 20, }}
                            style={{
                                width: '100%',
                            }}
                            placeholder={"Confirm Password"}
                            value={confirmPassword}
                            errorMessage={errMsg2}
                            icon={undefined}
                            onChangeText={(val) => {
                                setConfirmPassword(val)
                            }}
                        />
                        <View style={{
                            padding: moderateScale(15)//scale(30)
                        }}
                        >
                            <AppButton
                                title='Submit'
                                //disabled={!checkSubmitButtonValid()}
                                clicked={() => {
                                    let valid = true
                                    if (validator.isStrongPassword(newPassword, { minSymbols: 0 })) {
                                        setErrMsg1(undefined)
                                    } else {
                                        setErrMsg1("At least -\n8 characters long, \n1 uppercase & 1 lowercase character  \n1 number")
                                        valid = false
                                    }
                                    if (newPassword == confirmPassword) {
                                        setErrMsg2(undefined)
                                    } else {
                                        setErrMsg2("Passwords did not match")
                                        valid = false
                                    }
                                    //console.log(valid)
                                    if (valid) {
                                        let obj = {
                                            id: data.userData.id,
                                            password: newPassword
                                        }
                                        changePassword(obj, props.navigation)
                                    }
                                }}
                                style={{ marginTop: 10 }}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    )
}