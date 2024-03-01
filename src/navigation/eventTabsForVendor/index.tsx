import * as React from 'react';
import { View } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import EditorEventDetails from '../../containers/Events/EditorEventDetails'
import InviteeChatList from '../../containers/Events/EventInviteeChatList'
import Invitation from '../../containers/Invitation/InvitationScreen'
import EventGallery from '../../containers/Events/EventGallery'
import EventTasks from '../../containers/Events/EventTasks'
import EventBudgetScreen from '../../containers/Events/EventBudgetScreen'
import EventDetails from '../../containers/Events/EventDetails'

//import TaskTabs from '../taskTabs';


import * as SvgIcons from '../../assets/svg-icons'
import EventCat from '../../containers/Events/EventCatScreen';
import ConfirmModal from '../../components/ConfirmModal';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromDrafts } from '../../store/draftsSlice';
import EventDetailsView from '../../containers/Events/EventDetailsView';
import VendorChat from '../../containers/VendorChat';

const Tab = createBottomTabNavigator();

function EventTabsForVendor(props) {
   const { navigation, route } = props

   const activeIconWrapper = (icon: React.ReactComponentElement,) => {
      return <View
         style={{
            alignItems: 'center'
         }}
      >
         {icon}
         <View
            style={{
               marginTop: 2,
               backgroundColor: 'rgba(0, 173, 239, 1)',
               height: 2,
               width: 2
            }}
         />
      </View>
   }

   return (
      <>
         <Tab.Navigator
            screenOptions={({ route }) => ({
               headerShown: false,
               tabBarIcon: ({ focused }) => {
                  let iconName;

                  let width = 25
                  let height = 25
                  let style = {
                     fill: '#355D9B'
                  }

                  let activeColor = "rgba(0, 173, 239, 1)"

                  if (route.name === 'EventDetailsView') {
                     return focused ? activeIconWrapper(<SvgIcons.TaskIcon {...style} fill="#00ADEF" />) : <SvgIcons.TaskIcon {...style} />;
                  } else if (route.name === 'Chat') {
                     return focused ? activeIconWrapper(<SvgIcons.ChatIcon {...style} fill="#00ADEF" />) : <SvgIcons.ChatIcon {...style} />;
                  }
                  // You can return any component that you like here!
                  return iconName;
               },
               tabBarActiveTintColor: 'rgba(0, 173, 239, 1)',
               tabBarInactiveTintColor: '#355D9B',
               tabBarHideOnKeyboard: true,
            })
            }

         >
            <Tab.Screen
               options={{ title: 'Details' }}
               name="EventDetailsView"  >
               {(tabProps) => {
                  return <EventDetailsView
                     {...tabProps}
                     route={{
                        ...tabProps.route,
                        params: props.route?.params
                     }}
                  />
               }}
            </Tab.Screen>

            <Tab.Screen
               options={{ title: 'Chat' }}
               name="Chat" >
               {(tabProps) => {
                  return <VendorChat
                  {...tabProps}
                     route={{
                        ...tabProps.route,
                        params: props.route?.params
                     }}
                  />
               }}
            </Tab.Screen>
         </Tab.Navigator>
      </>
   );
}

export default EventTabsForVendor