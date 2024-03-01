import { View, Text, ImageBackground, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import ListGalleryItems from '../../../components/Album/listGalleryItems'
import * as SvgIcons from '../../../assets/svg-icons'
import {  clearVendorAlbum, getVendorAlbum } from '../../../store/actionCreators'
import { useSelector } from 'react-redux'
import { moderateScale, verticalScale } from '../../../utils/scalingUnits'
import TopBar from '../../../components/TopBar'

export default function VendorGallery({ route, navigation }) {

   const { vid, name, clear } = route.params

   useEffect(() => {
      getVendorAlbum(vid)
      return () => {
         if (clear) {
            clearVendorAlbum()
         }
      }
   }, [])

   const { vendorAlbum } = useSelector(state => state.events)

   const renderPhotos = () => {
      if (vendorAlbum?.length < 1) {

         return <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
         }}>
            <SvgIcons.GalleryEmptyImage
               fill='#355D9B'
               style={{
                  transform: [{ scale: moderateScale(1) }]
               }}
            />
            <Text
               style={{
                  fontWeight: 'bold',
                  fontSize: verticalScale(16),
                  color: '#355D9B',
                  marginTop: verticalScale(11)
               }}
            >No Photos!</Text>
         </View>
      }
      return <ListGalleryItems DATA={vendorAlbum} hideReportOption={true} />
   }
   return <ImageBackground
      source={require("../../../assets/images/blurBG.png")}
      resizeMode="cover"
      imageStyle={{
         width: "100%",
         height: "100%"
      }}
      style={{
         flex: 1,
         width: "100%",
         height: "100%"
      }}
   >
      <TopBar
         style={{ backgroundColor: 'transparent' }}
         title="Vendor Gallery"
      />
      {/*  <Text style={{
         paddingLeft: 20, justifyContent: "center", color: "rgba(53, 93, 155, 1)",
         fontFamily: 'Mulish-Bold', fontSize: moderateScale(15)
      }}>
         Vendor : {name}
      </Text> */}
      <ScrollView
         contentContainerStyle={{
            flexGrow: 1,
         }}
      >
         {renderPhotos()}
      </ScrollView>
   </ImageBackground>
}