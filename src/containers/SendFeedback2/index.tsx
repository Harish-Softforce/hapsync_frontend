import { View, Text, ImageBackground, ScrollView, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import TopBar from '../../components/TopBar'
import { moderateScale, scale, verticalScale } from '../../utils/scalingUnits'

import AntDesign from 'react-native-vector-icons/AntDesign'
import AppButton from '../../components/UI/button'
import { sendUserFeedback } from '../../store/actionCreators'
import { AirbnbRating, Rating } from 'react-native-elements'

export default function SendFeedback2(props) {

   const { index, heading } = props.route.params

   const [feedback, setFeedback] = useState("")
   const [rate, setRate] = useState(3)

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
         <TopBar
            style={{ backgroundColor: 'transparent' }}
            title="Send Feedback"
         />
         <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
         >
            <ScrollView
               keyboardShouldPersistTaps="handled"
               contentContainerStyle={{
                  flexGrow: 1,
               }}
            >
               <View style={{
                  flex: 1,
                  marginHorizontal: moderateScale(20),
                  paddingBottom: verticalScale(40)
               }}>
                  <View style={{
                     backgroundColor: '#fff',
                     minHeight: verticalScale(150),
                     borderRadius: verticalScale(15),
                     padding: moderateScale(25),
                  }}>

                     <View style={{ flex: 1 }}>
                        <View
                           style={styles.subView}>
                           <Text style={styles.subText}>Thanks for taking the time to send feedback to HapSync</Text>
                        </View>

                        <Text style={[styles.subText, { marginTop: verticalScale(15), fontWeight: '700' }]}>{heading}</Text>
                        <View style={styles.line}></View>
                     </View>

                     <View style={{ marginTop: verticalScale(30) }}>
                        <TextInput
                           style={{
                              height: 250,
                              borderWidth: 1,
                              borderColor: '#00ADEF',
                              padding: 10,
                              fontSize: scale(15),
                              borderRadius: 10,
                              textAlignVertical: 'top'
                           }}
                           onChangeText={(val) => {
                              setFeedback(val)
                           }}
                           multiline={true}

                        />
                     </View>

                     <Rating
                        startingValue={3}
                        onFinishRating={(val) => {
                           setRate(val)
                        }}
                        style={{ paddingVertical: scale(30) }}
                     />

                     <View style={{ paddingHorizontal: scale(30) }}>
                        <AppButton
                           title='Send'
                           disabled={feedback == "" ? true : false}
                           clicked={() => {
                              let obj = {
                                 mailBody: feedback,
                                 rating: rate
                              }
                              sendUserFeedback(obj, props.navigation)
                           }}
                        />
                     </View>
                  </View>
               </View>
            </ScrollView>
         </KeyboardAvoidingView>
      </ImageBackground>
   )
}

const styles = StyleSheet.create({
   subView: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   subText: {
      color: '#355D9B',
      fontFamily: 'Mulish',
      flex: 1,
      fontSize: 15
   },
   line: {
      borderBottomColor: "#00ADEF",
      opacity: 0.5,
      borderBottomWidth: 1,
      marginVertical: 4
   }
})