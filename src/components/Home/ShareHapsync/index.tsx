import { View, Text, Pressable, Platform } from 'react-native'
import React from 'react'
import { ShareHapSyncImage } from '../../../assets/svg-icons'
import { moderateScale } from '../../../utils/scalingUnits'
import Share from 'react-native-share';

export default function ShareHapsync() {
   return (
      <View>
         <Pressable
            onPress={() => {
               const options = {
                  message:  'Check out Hapsync application in store \nfor IOS: https://apps.apple.com/us/app/hapsync/id1558313626 \nfor Android: https://play.google.com/store/apps/details?id=com.hapsync'
               }

               Share.open(options)
                  .then((res) => {
                     console.log(res);
                  })
                  .catch((err) => {
                     err && console.log(err);
                  });

            }}
         >
            <View >
               <Text style={{
                  fontSize: moderateScale(18),
                  color: 'rgba(53, 93, 155, 1)',
                  fontFamily: 'Mulish-ExtraBold',
                  marginTop: moderateScale(15)
               }}>Share HapSync</Text>
            </View>

            <View style={{
               backgroundColor: '#fff',
               borderRadius: moderateScale(10),
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
               padding: moderateScale(10),
               marginTop: moderateScale(11)
            }}>
               <Text style={{
                  fontSize: moderateScale(12),
                  flex: 1,
                  color: 'rgba(136, 135, 156, 1)',
                  marginVertical: 3,
                  //lineHeight: 22
               }}>Oops! None of your friends are in Hapsync. Invite your friends and families now!</Text>
               <ShareHapSyncImage />

            </View>

         </Pressable>
      </View>
   )
}