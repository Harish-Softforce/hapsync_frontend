import { View, Text, ImageBackground, ScrollView, Pressable } from 'react-native'
import React, { useState } from 'react'
import TopBar from '../../../components/TopBar'
import { moderateScale } from '../../../utils/scalingUnits'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import * as SvgImage from '../../../assets/svg-icons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AppButton from '../../../components/UI/button'
import { updateEvent } from '../../../store/actionCreators'
import Config from 'react-native-config'
import { store } from '../../../store'
import { showErrorModalFunc } from '../../../store/utilsSlice'

export default function SuggestLocation({ route, navigation }) {

   const { eventData } = route.params;

   const [suggestedLocations, setSuggestedLocations] = useState([])
   const [currentInputVal, setCurrentInputVal] = useState("")

   return (
      <ImageBackground
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
            title="Vote for best Location"
            style={{
               backgroundColor: 'transparent'
            }}
         />
         <ScrollView
            contentContainerStyle={{ flexGrow: 1, }}
            keyboardShouldPersistTaps='handled'
         >

            <View style={{ marginHorizontal: moderateScale(20), padding: 10 }}>
               <MaterialCommunityIcons
                  name="map-outline"
                  style={{
                     fontSize: moderateScale(30),
                     color: '#00ADEF',
                     marginLeft: moderateScale(4),
                     margin: moderateScale(12)
                  }}
               />
               <GooglePlacesAutocomplete
                  placeholder='SEARCH ON GOOGLE'
                  enablePoweredByContainer={false}
                  fetchDetails={true}
                  onPress={(data, details) => {
                     // 'details' is provided when fetchDetails = true
                     // console.log(data, details);
                     let arr = suggestedLocations
                     if (suggestedLocations.find(i => i.name == data.description)) {

                     } else {
                        arr.push({
                           "name": data.description,
                           "preference": 1,
                           "vote": "PENDING",
                           "latitude": details?.geometry.location.lat,
                           "longitude": details?.geometry.location.lng,
                           "status": "ADD"
                        })
                        setSuggestedLocations(arr)
                        setCurrentInputVal("")
                     }
                  }}
                  query={{
                     key: Config.GOOGLE_PLACE_API_KEY,
                     language: 'en',
                  }}
                  styles={{
                     textInput: {
                        //color: '#000',
                        borderRadius: moderateScale(6),
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
               <View style={{
               }}>
                  {suggestedLocations.map((i, j) => {
                     return <View
                        key={j}
                        style={{
                           flexDirection: 'row',
                           minHeight: moderateScale(50),
                           alignItems: 'center',
                           borderWidth: 0.5,
                           borderRadius: moderateScale(6),
                           borderColor: "#ccc",
                           padding: 10,
                           marginTop: 6,
                           backgroundColor: "white"
                        }}>
                        <Text style={{ flex: 1, fontSize: moderateScale(14), fontFamily: "Mulish", fontWeight: "600", color: 'grey' }}>
                           {i.name}
                        </Text>
                        <Pressable
                           onPress={() => {
                              let arr = [...suggestedLocations]
                              arr.splice(j, 1)
                              setSuggestedLocations(arr)
                           }}
                           style={{
                              marginLeft: 'auto',
                              padding: moderateScale(9),
                              transform: [{ scale: moderateScale(1.03) }]
                           }}>
                           <SvgImage.DeleteIcon
                           />
                        </Pressable>
                     </View>
                  })
                  }
               </View>
               <View
                  style={{
                     flexDirection: 'row',
                     alignItems: 'center',
                     marginVertical: 20
                  }}
               >
                  <AppButton
                     title="Cancel"
                     style={{ height: moderateScale(40), flex: 1, marginRight: 10 }}
                     clicked={() => {
                        navigation.pop()
                     }}
                  />
                  <AppButton
                     title="Save"
                     style={{ height: moderateScale(40), flex: 1, marginLeft: 10 }}
                     clicked={() => {
                        if (suggestedLocations.length != 0) {
                           let obj = { ...eventData }
                           obj.eventId = obj.id
                           obj.locations = [...obj.locations, ...suggestedLocations]
                           if (obj.locations.length > 5) {
                              store.dispatch(showErrorModalFunc("Cannot add more than 5 polls"))
                              return
                           }
                           updateEvent(obj)
                           navigation.pop()
                        }
                     }}
                  />
               </View>
            </View>
         </ScrollView>
      </ImageBackground>
   )
}