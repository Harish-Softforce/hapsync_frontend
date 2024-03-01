import { View, Text, FlatList, Pressable, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Modal from 'react-native-modal'
import { Button, Divider } from 'react-native-elements'
import { moderateScale } from '../../utils/scalingUnits'
import * as SvgIcons from '../../assets/svg-icons'
import Feather from 'react-native-vector-icons/Feather'
import Fontisto from 'react-native-vector-icons/Fontisto'

export default function MultiSelectDropdown(props) {

   const [show, setshow] = useState(false)
   const [data, setdata] = useState(props.data)
   const [selected, setSelected] = useState([])

   useEffect(() => {
      if (props.data.length != data.length) {
         setdata(props.data)
      }
   }, [props.data])

   const renderItem = ({ item }) => {
      return <>
         <Pressable
            onPress={() => {

               let renderData = [...data];
               //console.log(renderData)
               for (let data of renderData) {
                  if (data.id == item.id) {
                     data.selected = (data.selected == null) ? true : !data.selected;
                     break;
                  }
               }
               setdata(renderData)
            }}
            style={{ backgroundColor: item.selected == true ? "#A7ECC1" : 'white', paddingVertical: 10, borderColor: "grey", }}
         >
            <Text style={{ padding: 5, marginLeft: 10, fontFamily: 'Mulish-Regular' }}>{item.name}</Text>

         </Pressable>
         <Divider color='black' />
      </>
   }

   return (
      <SafeAreaView style={{ flex: 1 }}>

         <Pressable
            onPress={() => setshow(true)}
            style={{
               borderRadius: moderateScale(10),
               borderColor: 'rgba(53, 93, 155, 1)',
               minHeight: moderateScale(42),
               borderWidth: 0.5,
               flexDirection: 'row',
               alignItems: 'center',
               paddingHorizontal: moderateScale(8)
            }}>
            <Text style={{
               color: 'rgba(53, 93, 155, 1)',
               fontFamily: 'Mulish-Regular',
               fontSize: 16
            }}>{selected.length ? " Selected ( " + selected.length + " )" : "Choose Items"}</Text>
            <View
               style={{ transform: [{ scale: moderateScale(0.8) }], marginLeft: 'auto' }}
            >
               <SvgIcons.DownArrow
               />
            </View>
         </Pressable>

         <Modal
            isVisible={show}
            style={{ padding: 20, paddingVertical: 100 }}
         >
            <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 10 }}>
               {
                  data.length == 0
                     ? <Text style={{ fontFamily: 'Mulish-Regular', }}>Failed to load, Try again</Text>
                     :
                     <>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                           <View style={{ padding: 10, marginTop: 10, }}>
                              <Text style={{ fontWeight: 'bold', fontFamily: 'Mulish-Regular', color: "grey" }}>Select ...</Text>
                           </View>
                           <Pressable
                              onPress={() => {
                                 setshow(false)
                                 setdata(props.data)
                                 setSelected([])
                                 props.onConfirm([])
                              }}
                              style={{ padding: 10 }}
                           >
                              <Fontisto name="close-a" size={20} color="black" />
                           </Pressable>
                        </View>
                        <FlatList
                           nestedScrollEnabled
                           data={data}
                           renderItem={renderItem}
                           keyExtractor={(item, index) => String(index)}
                           style={{ margin: 10 }}
                        />
                     </>
               }
               <Button title={data.filter(i => i.selected).length == 0 ? "Close" : "Confirm"}
                  buttonStyle={{
                     backgroundColor: data.filter(i => i.selected).length == 0 ? "grey" : '#355D9B',
                     borderRadius: 10,
                     paddingVertical: 13,
                     margin: 5
                  }}
                  titleStyle={{ fontWeight: 'bold', fontSize: 23, fontFamily: 'Mulish-Regular', }}
                  onPress={() => {
                     const selecteditems = data.filter(i => i.selected)
                     setSelected(selecteditems)
                     setshow(false)
                     props.onConfirm(selecteditems)
                  }}

               />

            </View>
         </Modal>

      </SafeAreaView>
   )
}