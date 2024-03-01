import {  ImageBackground, ScrollView, View } from 'react-native'
import React from 'react'
import TopBar from '../../components/TopBar'
import * as SvgIcons from '../../assets/svg-icons'
import AppText from '../../components/UI/AppText'
import { verticalScale } from '../../utils/scalingUnits'

export default function PageNotFound() {

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
         <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

            <TopBar
               style={{ backgroundColor: 'transparent' }}
               title=" "
            />
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {/* <SvgIcons.EmptyDraftsImage
                    style={{
                        marginBottom: verticalScale(10)
                    }}
                /> */}
                {/* <AppText style={{
                    color: '#355D9B',
                    fontWeight: 'bold'
                }}>Failed to Load!</AppText> */}
                {/* <AppText style={{
                    color: '#355D9B66',
                    fontSize: verticalScale(13)
                }}>
                    Unsaved Hapsync will be listed here
                </AppText> */}
            </View>
         </ScrollView>
      </ImageBackground>
   )
}