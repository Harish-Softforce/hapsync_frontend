import { View, Text, Image, Pressable, StyleSheet, Linking, Platform } from 'react-native'
import React from 'react'
import { moderateScale, verticalScale } from '../../../utils/scalingUnits'
import { useNavigation } from '@react-navigation/native'
import { Button } from 'react-native-elements'
import { showLocation } from 'react-native-map-link'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

function capitalizeFirstLetter(string) 
{
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export default function VendorItem(props) {

   const navigation =useNavigation()

   const { data } = props
   /* let address1=(data.addressLine1?data.addressLine1+" ":"")+
               (data.addressLine2?data.addressLine2+" ":"")+
               (data.city?data.city+" ":"")+
               (data.state?data.state+" ":"")+
               (data.zipcode?data.zipcode+" ":"") */
   const hashmap = new Map([
      ["EVALUATING", { bg: "rgba(26, 165, 77, 0.15)", c: "#1AA54D" }],
      ["HIRED", { bg: "rgba(37, 150, 215, 0.15)", c: "#2596D7" }],
      ["NOTAVAILABLE", { bg: "rgba(227, 0, 0, 0.15)", c: "#E30000" }],
      ["REJECTED", { bg: "rgba(239, 115, 0, 0.15)", c: "#EF7300" }]
   ]);
   let bgColor = hashmap.get(data.status)

   return (
      <>
         <Pressable
            onPress={() => {
               if (props.handleItemClick) {
                  props.handleItemClick(data)
               }
            }}
            style={{
               backgroundColor: 'white',
               borderRadius: verticalScale(6),
               marginTop: 10,
               padding: 10,
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
            }}>
            <View style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
               alignItems: 'center',
               padding: moderateScale(5),
               backgroundColor: 'rgba(238, 215, 255, 0.27)'
            }}>
               <Text style={{ fontFamily: 'Mulish-Bold', fontSize: verticalScale(14), color: '#355D9B' }}>
                  {data?.name}
               </Text>
            </View>
            <View style={{ flexDirection: 'row',marginTop:moderateScale(10) }}>
               <View style={{ marginRight: 10, alignItems:"center" }}>
                  <Image
                     style={{ height: 100, width: 100, borderRadius: verticalScale(6), //borderWidth:0.5,borderColor:"grey" 
                  }}
                     source={
                        data.url
                        ? { uri: data.url }
                        : require("../../../assets/images/no-img.png")
                     }
                  />
               </View>
               <View style={{ flex: 1, alignItems: 'flex-start' }}>
                  <View style={{ paddingTop: 0 }}>
                     <Text style={{ color: '#88879C', fontFamily: 'Mulish', alignSelf: 'flex-start', fontSize: verticalScale(11), fontWeight: '600' }}>
                        {data.address ? data.address : ''}
                     </Text>
                  </View>
                  {data.status ?
                     <>
                        <View style={{ marginVertical: moderateScale(10) }}>
                           <Pressable
                              onPress={() => {
                                 if (props.handleUpdateStatus) {
                                    props.handleUpdateStatus(data)
                                 }
                              }}
                           >
                              <View
                                 style={{
                                    borderRadius: verticalScale(4),
                                    //backgroundColor: bgColor.bg,
                                    borderWidth:0.5,
                                    borderColor:bgColor.c,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 9,
                                    
                                 }}>
                                 <Text style={{
                                    fontSize: verticalScale(10),
                                    color: bgColor.c,
                                    fontFamily: 'Mulish-Bold'
                                 }}>
                                    {capitalizeFirstLetter(data.status)}
                                 </Text>
                              </View>
                           </Pressable>

                        </View>
                     </>
                     :
                     <>
                        <View style={{ marginVertical: moderateScale(10) }}>
                           <Pressable
                              onPress={() => {
                                 if (props.handleEvaluate) {
                                    props.handleEvaluate(data)
                                 }
                              }}
                           >
                              <View
                                 style={{
                                    borderRadius: verticalScale(4),
                                    backgroundColor: "#56CCF2",
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 9,
                                    //alignSelf: 'flex-start'
                                 }}>
                                 <Text style={{
                                    fontSize: verticalScale(10),
                                    //color: "#1B0C36",
                                    color:'white',
                                    fontFamily: 'Mulish-Bold'
                                 }}>
                                    {capitalizeFirstLetter("EVALUATE")}
                                 </Text>
                              </View>
                           </Pressable>
                        </View>
                     </>
                  }

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start" }}>

                     <Pressable
                        onPress={() => {
                           showLocation({
                              latitude: data.latitude,
                              longitude: data.longitude,
                              googlePlaceId: data.placeId,
                              title: data?.address
                           }).catch(e => {
                              console.log(e)
                           })
                        }}
                        style={[styles.iconStyle, { alignSelf: 'flex-start' }]}>
                        <MaterialCommunityIcons name="directions" size={25} color="#00ADEF" />
                     </Pressable>

                     {data.website && <Pressable
                        onPress={() => {
                           Linking.canOpenURL(data.website).then(supported => {
                              console.log(supported)
                              if (supported) {
                                 Linking.openURL(data.website).catch(e => {
                                    alert("Unable to open link")
                                 })
                              } else {
                                 console.log("Don't know how to open URI: " + data.website);
                              }
                           }).catch(e => {
                              console.log(e)
                           });
                        }}
                        style={styles.iconStyle}>
                        <SimpleLineIcons name="globe" size={25} color="#00ADEF" />
                     </Pressable>}

                     {data.phone && <Pressable
                        onPress={() => {
                           Linking.openURL(`tel:${data.phone}`).catch(e => {
                              console.log(e)
                           })
                        }}
                        style={styles.iconStyle}>
                        <MaterialIcons name="call" size={25} color="#00ADEF" />
                     </Pressable>}
                     <Pressable
                        onPress={() => {
                           navigation.navigate("VendorGallery",{vid:data.userId, name:data.name, clear:true })
                        }}
                        style={styles.iconStyle}>
                        <Ionicons name='ios-images-sharp' size={25} color="#00ADEF" />
                     </Pressable>
                  </View>


               </View>
            </View>
         </Pressable>
      </>
   )
}

const styles = StyleSheet.create({
   iconStyle: {
      //flex: 1,
      marginRight:10,
      padding: 5,
   }
})