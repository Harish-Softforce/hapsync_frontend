import { View, Text, ScrollView, ImageBackground } from 'react-native'
import React from 'react'
import TopBar from '../../../components/TopBar'
import { Button } from 'react-native-elements'

export default function Policy(props) {

   return (
      <ImageBackground
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
         <ScrollView
            contentContainerStyle={{
               flexGrow: 1,
            }}
            keyboardShouldPersistTaps='handled'
         >
            <TopBar
               style={{ backgroundColor: 'transparent' }}
               title="Policy"
               leftComponent={<></>}
            />
            <View style={{ flex: 1 }}>
               <Text>Policy</Text>
            </View>
            <Button
               onPress={() => {
                  props?.navigation.goBack()
               }}
               title="Continue"
            />
         </ScrollView>
      </ImageBackground>
   )
}