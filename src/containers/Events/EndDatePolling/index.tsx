import { View, Text, ImageBackground, Dimensions, Pressable, ScrollView, StyleSheet, FlatList, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import TopBar from '../../../components/TopBar';
import * as SvgIcons from '../../../assets/svg-icons'
import { moderateScale, verticalScale } from '../../../utils/scalingUnits';
import moment from 'moment';
import { each } from 'immer/dist/internal';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppButton from '../../../components/UI/button';
import ReactNativeModal from 'react-native-modal';

export default function EndDatePolling({ route, navigation }) {

   const { pollDates, pollLocations, eventId } = route.params;

   const [selectedDate, setSelectedDate] = useState(null)
   const [selectedPoll, setSelectedPoll] = useState(null)
   const [selectedType, setSelectedType] = useState(null)

   //console.log(pollDates)
   const renderBackIcon = () => {
      return <>
         <Pressable
            onPress={() => navigation.goBack()}
            style={{
               position: 'absolute',
               left: moderateScale(10),
               zIndex: 20,
               padding: moderateScale(10),
               paddingRight: moderateScale(15),
               // marginLeft: moderateScale(20),
            }}
         >
            <Ionicons name="ios-arrow-back-circle-outline" size={36} color="rgba(53, 93, 155, 1)" />

         </Pressable>
         {/* <Pressable
            onPress={() => navigation.goBack()}
            style={{
               position: 'absolute',
               left: moderateScale(17),
               zIndex: 20,
               padding: moderateScale(3)
               // marginLeft: moderateScale(20),
            }}
         >
            {
               <SvgIcons.BackIcon />
            }
         </Pressable> */}
      </>
   }

   const RightHeader = () => {
      return <Pressable
         onPress={() => {
            if (selectedDate == null) {

            } else {
               navigation.navigate('EndLocationPolling', {
                  finalDate: selectedDate,
                  pollLocations: pollLocations,
                  eventId: eventId
               })
            }
         }}
         style={{ padding: 5, }}>
         <Text style={{
            color: selectedDate == null ? 'grey' : 'rgba(53, 93, 155, 1)',
            fontSize: moderateScale(20),
            fontFamily: 'Mulish-ExtraBold'
         }}>Next</Text>
      </Pressable>
   }

   const Block = ({ each }) => {
      let yes = 0
      let no = 0
      let maybe = 0

      let yeslist = []
      let nolist = []
      let maybelist = []

      each.polling.map(item => {
         console.log(item.vote)
         if (item.vote == 'LIKE') {
            yes = yes + 1
            yeslist.push(item.userName)
         } else if (item.vote == 'DISLIKE') {
            no = no + 1
            nolist.push(item.userName)
         } else if (item.vote == 'PENDING') {
            maybe = maybe + 1
            maybelist.push(item.userName)
         }
      })
      return <Pressable style={[styles.block, selectedDate ? each.id == selectedDate.id ? { backgroundColor: '#A7ECC1' } : {} : {}]}
         onPress={() => {
            setSelectedDate(each)
         }}>
         <View style={{ justifyContent: 'center', padding: 10, margin: 5 }}>
            <Text style={{ color: '#00ADEF', fontFamily: 'Mulish-Bold', fontSize: 13 }}>
               {moment(each.slot).format("DD MMM YYYY").toUpperCase()}
               {each.startTime ? moment(each.startTime, "hh:mm").format(" , LT") : ''}
            </Text>
         </View>
         <View style={styles.hline}></View>
         <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={styles.innerBlock}>
               <Pressable
                  onPress={() => {
                     setshowTemplate(true)
                     setshowList(yeslist)
                     setSelectedPoll(each)
                     setSelectedType("YES (" + yes + ")")
                  }}
                  style={{ paddingHorizontal: 10 }}>
                  <Text style={styles.text1}>{yes}</Text>
                  <Text style={styles.text2}>YES</Text>
               </Pressable>
            </View>
            <View style={styles.innerBlock}>
               <Pressable
                  onPress={() => {
                     setshowTemplate(true)
                     setshowList(nolist)
                     setSelectedPoll(each)
                     setSelectedType("NO (" + no + ")")
                  }}
                  style={{ paddingHorizontal: 10 }}>
                  <Text style={styles.text1}>{no}</Text>
                  <Text style={styles.text2}>NO</Text>
               </Pressable>
            </View>
            <View style={styles.innerBlock}>
               <Pressable
                  onPress={() => {
                     setshowTemplate(true)
                     setshowList(maybelist)
                     setSelectedPoll(each)
                     setSelectedType("MAY BE (" + maybe + ")")
                  }}
                  style={{ paddingHorizontal: 10 }}>
                  <Text style={styles.text1}>{maybe}</Text>
                  <Text style={styles.text2}>MAY BE</Text>
               </Pressable>
            </View>
         </View>

      </Pressable>
   }

   const [showTemplate, setshowTemplate] = useState(false)
   const [showList, setshowList] = useState([])

   const RenderTemplateModal = () => {
      return <ReactNativeModal
         isVisible={showTemplate}
         style={{ justifyContent: 'flex-end', margin: 0, }}
         onBackdropPress={() => setshowTemplate(false)}
      >
         <View
            style={{
               marginHorizontal: moderateScale(11),
               backgroundColor: '#fff',
               padding: verticalScale(15),
               borderRadius: verticalScale(8),
               marginBottom: 10,
               height: "60%"
            }}>
            <View style={{ alignItems: 'center', padding: 10, flexDirection: "row", }}>
               <Text style={{ color: '#355D9B', fontFamily: 'Mulish-Bold', fontSize: 15 }}>{selectedType} :  </Text>
               <Text style={{ color: '#00ADEF', fontFamily: 'Mulish-Bold', fontSize: 15,flex:1 }}>
                  {moment(selectedPoll?.slot).format("DD MMM YYYY").toUpperCase()}
                  {selectedPoll?.startTime ? moment(selectedPoll?.startTime, "hh:mm").format(" , LT") : ''}
               </Text>
            </View>
            <View style={{ borderColor: "grey", borderBottomWidth: 1, }}></View>

            <FlatList
               data={showList}
               nestedScrollEnabled
               renderItem={({ item }) => {
                  return <>
                     <View style={{ padding: 14, borderWidth: 1, marginTop: 10, borderRadius: 8 }}>
                        <Text style={{ fontFamily: "Mulish-Bold", fontSize: moderateScale(15), color: '#355D9B' }}>{item}</Text>
                     </View>
                  </>
               }}
               contentContainerStyle={{ padding: 2, }}
               keyExtractor={(item, index) => index}
            />
            <View style={{
               flexDirection: 'row',
               marginTop: 10
            }}>
               <AppButton
                  clicked={() => {
                     setshowTemplate(false)
                     setshowList([])
                  }}
                  style={{ flex: 1 }}
                  title="Close"
               />
            </View>
         </View>
      </ReactNativeModal>
   }

   return (
      <View style={{ flex: 1 }}>
         <ImageBackground
            source={require("../../../assets/images/blurBG.png")}
            resizeMode="cover"
            imageStyle={{
               width: "100%",
               height: "100%"
            }}
            style={{
               // flex: 1,
               minWidth: "100%",
               minHeight: "100%"
            }}
         >

            <TopBar
               //leftComponent={renderBackIcon()}
               style={{ backgroundColor: 'transparent' }}
               title="Choose Time"
               rightComponent={<RightHeader />}
            />
            <ScrollView
               style={{ flex: 1, marginHorizontal: moderateScale(15) }}
               showsVerticalScrollIndicator={false}
            >
               {pollDates.map((each, i) => <Block each={each} key={i} />)}

               <View style={{ margin: 5 }}></View>
            </ScrollView>
         </ImageBackground>
         <RenderTemplateModal />
      </View>
   )
}

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
   container: {
      marginTop: 50,
   },
   text1: {
      fontFamily: 'Mulish-Bold', fontSize: 24, color: '#88879C'
   },
   text2: {
      fontFamily: 'Mulish-Bold', fontSize: 9, color: '#355D9B'
   },
   innerBlock: {
      justifyContent: 'center', alignItems: 'center', flex: 1
   },
   hline: {
      width: '90%', height: 1, backgroundColor: '#355D9B', margin: 7
   },
   block: {
      flex: 1, borderRadius: moderateScale(10), backgroundColor: 'white',
      height: 'auto', marginTop: 15, padding: 10, alignItems: 'center',
   },
   heading: {
      fontFamily: 'Mulish-ExtraBold',
      color: '#355D9B',
      fontSize: moderateScale(15.5)
   },
})