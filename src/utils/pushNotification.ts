import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

import {Config} from 'react-native-config';
import {StreamChat} from 'stream-chat';
import axios from 'axios';

import {store} from '../store';

export const setupBackgroundPush = () => {
  const userState = store.getState().user;

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    const chatClient = StreamChat.getInstance(Config.GETSTREAMS_API_KEY);

    if (!userState.userData) {
      return;
    }

    const userData = userState?.userData;
    let chatBaseUrl = Config.CHAT_SERVER_URL || 'http://localhost:5000';
    let url = `${chatBaseUrl}/stream-chat/user-token`;

    const axiosData = {userId: `${userData?.id}_user`};


    let userToken = await axios
      .post(url, axiosData, {})
      .then(res => res?.data)
      .catch(err => console.log('error ', err));

    if (userToken && userToken?.token) {
      const user = {
        id: `${userData?.id}_user`,
      };

      await chatClient._setToken(user, userToken?.token);

      // handle the message
      const message = await chatClient.getMessage(remoteMessage.data.id);

      // create the android channel to send the notification to
      const channelId = await notifee.createChannel({
        id: 'chat-messages',
        name: 'Chat Messages',
      });

      // display the notification
      await notifee.displayNotification({
        title: 'New message from ' + message.message.user.name,
        body: message.message.text,
        data: remoteMessage.data,
        android: {
          smallIcon:'icon_notification',
          color: '#355D9B',
          channelId,
          // add a press action to open the app on press
          pressAction: {
            id: 'default',
          },
        },
      });
    }
  });
};