/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging'
import Config from 'react-native-config';
import {StreamChat} from 'stream-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {AndroidImportance, AndroidVisibility, EventType} from '@notifee/react-native';
import axios from 'axios'

const onMessageReceived = async (remoteMessage) => {
   console.log("recived fcm Msg in background")
   console.log(remoteMessage)
   return
   let chatBaseUrl = Config.CHAT_SERVER_URL;
   let url = `${chatBaseUrl}/stream-chat/user-token`

   const client = new StreamChat(Config.GETSTREAMS_API_KEY);
   const user_token = await AsyncStorage.getItem('@stream_push_token');

   const user_id = await AsyncStorage.getItem('@user_id');
   console.log(user_id)

   const axiosData = { userId: user_id }

   let userToken = await axios.post(url, axiosData, {}).then((res) => res?.data).catch((err) => console.log('error ', err))
   console.log(userToken)

   await client._setToken({
      id: user_id
   }, userToken?.token).catch(e => {
      console.log("setTokenError " + e)
   });

   if (remoteMessage.data ?. id) { // handle the message
      const message = await client.getMessage(remoteMessage.data.id).catch(e => {
         console.log("getMessageError " + e)
      });
      console.log("Message")
      // create the android channel to send the notification to
      const channelId = await notifee.createChannel({id: 'default', name: 'default', sound: "default", importance: AndroidImportance.HIGH});


      await notifee.displayNotification({
         title: 'New message from ' + message.message.user.name,
         body: message.message.text,
         data: remoteMessage.data,
         android: {
            channelId,
            color:"red",
            clickAction: "OPEN_ACTIVITY_1",
            importance: AndroidImportance.HIGH,
            // visibility: AndroidVisibility.PUBLIC,
            sound: "default",
            showTimestamp: true,
            timestamp: message.sentTime
         }
      });
      
   }
}
messaging().setBackgroundMessageHandler(onMessageReceived)

AppRegistry.registerComponent(appName, () => App);
