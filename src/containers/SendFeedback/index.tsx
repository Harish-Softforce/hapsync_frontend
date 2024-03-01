import { View, Text, ImageBackground, ScrollView, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import TopBar from '../../components/TopBar'
import { moderateScale, verticalScale } from '../../utils/scalingUnits'

import AntDesign from 'react-native-vector-icons/AntDesign'

export default function SendFeedback(props) {
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
         <ScrollView contentContainerStyle={{
            flexGrow: 1,

         }}>
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
                  marginTop: 20
               }}>

                  <View style={{ flex: 1 }}>
                     <Pressable
                        onPress={() => {
                           props.navigation.navigate("SendFeedback2",
                              {
                                 index: 1,
                                 heading: "Tell us What you like"
                              }
                           )
                        }}
                        style={styles.subView}>
                        <Text style={styles.subText}>Tell us What you like</Text>
                        <AntDesign name="rightcircleo" size={20} color="#00ADEF" />
                        
                     </Pressable>
                     <View style={styles.line}></View>
                  </View>

                  <View style={{ flex: 1 }}>
                     <Pressable
                        onPress={() => {
                           props.navigation.navigate("SendFeedback2",
                              {
                                 index: 2,
                                 heading: "Tell us What could be better"
                              }
                           )
                        }}
                        style={styles.subView}>
                        <Text style={styles.subText}>Tell us What could be better</Text>
                        <AntDesign name="rightcircleo" size={20} color="#00ADEF" />
                     </Pressable>
                     <View style={styles.line}></View>
                  </View>

               </View>
            </View>
         </ScrollView>
      </ImageBackground>
   )
}

const styles = StyleSheet.create({
   subView: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 5,
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