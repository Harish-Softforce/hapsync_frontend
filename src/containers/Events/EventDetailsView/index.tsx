import { View, Text, ImageBackground, ScrollView, StyleSheet, Pressable, Modal, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import TopBar from '../../../components/TopBar'
import Feather from 'react-native-vector-icons/Feather'

import { moderateScale, verticalScale } from '../../../utils/scalingUnits'
import moment from 'moment'
import { useSelector } from 'react-redux'
import AppText from '../../../components/UI/AppText'
import * as SvgIcons from '../../../assets/svg-icons'
import validator from 'validator'
import AppButton from '../../../components/UI/button'
import AppInput from '../../../components/UI/Input'
import { addVendorInvoice, clearCurrentEvent, getCurrentEventDetails, updateVendorInvoice } from '../../../store/actionCreators'


let modalValues = [
   {
      title: 'Paid',
      value: 'Paid'
   },
   {
      title: 'Pending',
      value: 'Pending'
   },
]

export default function EventDetailsView(props) {

   useEffect(() => {
      if (props.route.params.recommended || props.route.params.orgview) {
         getCurrentEventDetails(props.route?.params.data.id, true)
      } else {
         getCurrentEventDetails(props.route?.params.data.event.id, true)
      }

      return () => {
         clearCurrentEvent()
      }
   }, [])

   const { userData } = useSelector(state => state.user)
   const { currentEvent } = useSelector(state => state.events)
   let data = currentEvent
   //const [data, setData] = useState(props.route?.params.data)

   const { recommended, orgview } = props.route.params

   let vendorView = !(recommended || orgview)
   //console.log(data)
   const task = data?.activities.find(i => i.id == props.route.params.data.id)
   let payments = task?.vendorInvoices

   const [modalShow, setModalShow] = useState(false)
   //const [payments, setPayments] = useState()

   const renderInvoices = () => {

      return <View style={styles.section}>
         <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
         }}>
            <Text style={styles.heading}>Invoices</Text>
            <Pressable
               style={{
                  marginRight: -moderateScale(4)
               }}
               onPress={() => {
                  setModalShow(true)
               }}
            >
               <Feather
                  name="plus"
                  style={{
                     color: '#355D9B',
                     fontSize: verticalScale(28)
                  }}
               />
            </Pressable>
         </View>
         <View style={{ marginTop: 10 }}></View>
         {
            payments?.map((each, index) => {
               return <View
                  key={index}
                  style={{
                     //height: verticalScale(83),
                     borderRadius: verticalScale(10),
                     backgroundColor: '#fff',
                     borderColor: 'grey',
                     borderWidth: 1,
                     elevation: 2,
                     flexDirection: 'row',
                     alignItems: 'center',
                     //justifyContent: 'space-between',
                     padding: verticalScale(15),
                     marginBottom: 10,
                  }}
               >
                  <View style={{
                     width: "40%",
                  }}>
                     <Text style={{
                        color: 'black',
                        fontFamily: 'Mulish'
                     }}>
                        {each.description}
                     </Text>
                  </View>
                  <View style={{
                     flexDirection: 'row',
                     alignItems: 'center',
                     justifyContent: "space-between"
                  }}>
                     <AppText style={{
                        color: '#00ADEF',
                        fontSize: verticalScale(14)
                     }}>
                        {each.amount + "$"}
                     </AppText>
                     {/* <SvgIcons.AssignedIcon
                        fill="#355D9B"
                        style={{
                           transform: [{ scale: moderateScale(0.85) }],
                           marginLeft: moderateScale(4)
                        }}
                     /> */}
                     <Pressable onPress={() => {
                        setsShowStatusModel(true)
                        let status = each.status ? each.status : "PAID"
                        setInvoiceStatus(status)
                        setselectedInvoice(each)
                     }} style={{ width: "40%", }}>
                        <AppText style={{ color: "#88879C", fontSize: 13 }}>{each.status ? each.status : "Paid"}</AppText>
                     </Pressable>
                  </View>


               </View>
            })
         }
      </View>
   }

   const [paymentAmount, setPaymentAmount] = useState("")
   const [paymentName, setPaymentName] = useState("")
   const [validPayment, setValidPayment] = useState(false)

   const renderPaymentModal = () => {

      return <Modal visible={modalShow} animationType="slide"
         transparent={true}
      >
         <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
         >
            <Pressable
               onPress={() => setModalShow(false)}
               style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  justifyContent: 'flex-end',
               }}>
               <Pressable
                  //onPress={()=>{}}
                  style={{
                     marginHorizontal: moderateScale(11),
                     backgroundColor: '#fff',
                     minHeight: verticalScale(100),
                     paddingVertical: verticalScale(11),
                     borderRadius: verticalScale(10)
                  }}>
                  <View style={{ paddingHorizontal: 20 }}>
                     <View style={{ alignSelf: 'center' }}>
                        <AppText style={{ color: '#355D9B' }}>Add Payment</AppText>
                     </View>
                     <View>
                        <AppInput
                           onChangeText={(val) => {
                              if (val !== "" && validator.isNumeric(paymentAmount)) {
                                 setValidPayment(true)
                              } else {
                                 setValidPayment(false)
                              }
                              setPaymentName(val)
                           }}
                           value={paymentName}
                           label={"Name"}
                           placeholder="Enter Name"
                           labelStyle={styles.heading}
                           style={{ fontFamily: 'Mulish-Light' }}
                        />
                     </View>
                     <View>
                        <AppInput
                           onChangeText={(val) => {
                              if (paymentName !== "" && validator.isNumeric(val)) {
                                 setValidPayment(true)
                              } else {
                                 setValidPayment(false)
                              }
                              setPaymentAmount(val)
                           }}
                           value={paymentAmount}
                           label={"Amount"}
                           labelStyle={styles.heading}
                           keyboardType='number-pad'
                           returnKeyType='done'
                           onSubmitEditing={Keyboard.dismiss}
                           placeholder="Enter Amount"
                           style={{ fontFamily: 'Mulish-Light', }}
                        />
                     </View>
                     {/* <View>
                              {this.renderDateSelector()}
                          </View> */}

                  </View>
                  <View style={{
                     flexDirection: 'row',
                     marginTop: moderateScale(12),
                     marginHorizontal: moderateScale(11)
                  }}>
                     <AppButton
                        clicked={() => setModalShow(false)}
                        title="Cancel"
                        style={[styles.button, {
                           backgroundColor: '#00ADEF',
                           marginRight: verticalScale(7)
                        }]}
                     />
                     <AppButton
                        clicked={() => {
                           if (validPayment) {
                              setModalShow(false)
                              /* let val = [...payments]
                              val.push({
                                 amount: paymentAmount,
                                 //date: moment(this.state.selectedDate).format("YYYY-MM-DD"),
                                 name: paymentName
                              }) */

                              let taskVendor = task.vendors.find(vendor => vendor.userId == userData.id)
                              if (taskVendor) {

                                 let obj = {
                                    "activityId": task.id,
                                    "amount": paymentAmount,
                                    "description": paymentName,
                                    "vendorId": taskVendor.vendorId
                                 }
                                 addVendorInvoice(obj, data.id)
                              }

                              //setPayments(val)
                              setPaymentName("")
                              setPaymentAmount("")
                              setValidPayment(false)
                              //this.handleTextAndEditableUpdate("payments", val, true)
                           }
                        }}
                        title="OK"
                        style={[{ backgroundColor: validPayment ? '#355D9B' : 'grey' }, styles.button]}
                     />
                  </View>
               </Pressable>
            </Pressable>
         </KeyboardAvoidingView>
      </Modal>
   }

   const [showStatusModel, setsShowStatusModel] = useState(false)
   const [invoiceStatus, setInvoiceStatus] = useState(undefined)
   const [selectedInvoice, setselectedInvoice] = useState(undefined)

   const renderUpdateStatusModal = () => {
      return <Modal visible={showStatusModel} animationType="slide"
         transparent={true}
      >
         <Pressable
            onPress={() => {
               setsShowStatusModel(false)
               setInvoiceStatus(undefined)
               setselectedInvoice(undefined)
            }}
            style={{
               flex: 1,
               backgroundColor: 'rgba(0,0,0,0.8)',
               justifyContent: 'flex-end',
            }}>
            <View style={{
               marginHorizontal: moderateScale(11),
               backgroundColor: '#fff',
               minHeight: verticalScale(100),
               paddingVertical: verticalScale(11),
               borderRadius: verticalScale(10)
            }}>
               {modalValues.map((each) => {
                  let match = invoiceStatus == each.value;
                  if (invoiceStatus) {
                     match = invoiceStatus == each.value
                  }

                  return <Pressable
                     onPress={() => setInvoiceStatus(each.value)}
                     key={each.value}
                     style={{
                        height: verticalScale(40),
                        justifyContent: 'center',
                        backgroundColor: match ? '#F8F7FA' : '#fff',
                        elevation: match ? 1 : 0,
                        paddingHorizontal: moderateScale(13)
                     }}>
                     <Text
                        style={{
                           fontSize: verticalScale(18),
                           color: match ? '#355D9B' : '#88879C',
                           fontFamily: match ? 'Mulish-Bold' : 'Mulish-Regular'
                        }}
                     >
                        {each.title}
                     </Text>
                  </Pressable>
               })}
               <View style={{
                  flexDirection: 'row',
                  marginTop: moderateScale(12),
                  marginHorizontal: moderateScale(11)
               }}>
                  <AppButton
                     clicked={() => {
                        setsShowStatusModel(false)
                        setInvoiceStatus(undefined)
                        setselectedInvoice(undefined)
                     }}
                     title="Cancel"
                     style={[styles.button, {
                        backgroundColor: '#00ADEF',
                        marginRight: verticalScale(7)
                     }]}
                  />
                  <AppButton
                     clicked={() => {
                        if (selectedInvoice) {
                           let obj = {
                              "id": selectedInvoice.id,
                              "status": invoiceStatus
                           }
                           updateVendorInvoice(obj, data.id)
                        }
                        setsShowStatusModel(false)
                        setInvoiceStatus(undefined)
                        setselectedInvoice(undefined)
                     }}
                     title="OK"
                     style={[styles.button]}
                  />
               </View>
            </View>
         </Pressable>
      </Modal>
   }

   if (!currentEvent) {
      return <>
         <TopBar
            style={{ backgroundColor: 'transparent' }}
            title={data?.name}
         />
      </>
   }

   return (
      <View>
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
               style={{ backgroundColor: 'transparent' }}
               title={data?.name}
            />
            <ScrollView
               contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: moderateScale(50)
               }}
               keyboardShouldPersistTaps='handled'
            >

               <View style={{ marginHorizontal: moderateScale(15) }}>

                  <View style={styles.section}>
                     <Text style={styles.heading}>Event Name</Text>
                     <Text style={styles.value}>{data.name}</Text>
                  </View>

                  <View style={styles.section}>
                     <Text style={styles.heading}>Contact Name</Text>
                     <Text style={styles.value}>{data.hostName}</Text>
                  </View>

                  {data.timings.length > 0 && <View style={styles.section}>
                     <Text style={styles.heading}>{"Date & Time"}</Text>
                     <Text style={styles.value}>
                        {moment(data.timings[0].slot).format("DD MMM[,] YYYY") + (data.timings[0].startTime == null ? "" : moment(data.timings[0].startTime, "hh:mm").format(" - LT"))}
                     </Text>
                  </View>}

                  <View style={styles.section}>
                     <Text style={styles.heading}>Location</Text>
                     <Text style={styles.value}>{data?.locations[0]?.name}</Text>
                  </View>

                  {vendorView 
                  && 
                  <>
                  <View style={styles.section}>
                     <Text style={styles.heading}>Task Name</Text>
                     <Text style={styles.value}>{task.name}</Text>
                  </View>
                  <View style={styles.section}>
                     <Text style={styles.heading}>Task Date</Text>
                     <Text style={styles.value}>{task.date}</Text>
                  </View>
                  <View style={styles.section}>
                     <Text style={styles.heading}>Task Notes</Text>
                     <Text style={styles.value}>{task.notes}</Text>
                  </View>
                  </>}

                  {validator.isNumeric(String(task?.budget)) && <View style={styles.section}>
                     <Text style={styles.heading}>Price</Text>
                     <Text style={styles.value}>{task?.budget}</Text>
                  </View>}
                  {recommended || orgview ? <></>
                     : <>
                        {renderInvoices()}
                        {renderPaymentModal()}
                        {renderUpdateStatusModal()}
                     </>
                  }
               </View>
            </ScrollView>
         </ImageBackground>
      </View>
   )
}

const styles = StyleSheet.create({
   heading: {
      fontSize: moderateScale(16),
      marginVertical: verticalScale(5),
      color: '#355D9B',
      fontFamily: 'Mulish-Bold',
      marginBottom: 1
   },
   value: {
      color: '#88879C',
      fontFamily: 'Mulish',
   },
   section: {
      backgroundColor: '#fff',
      padding: verticalScale(10),
      borderRadius: verticalScale(10),
      marginBottom: verticalScale(10),
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
   },
   button: {
      height: verticalScale(40),
      flex: 1
   }
})