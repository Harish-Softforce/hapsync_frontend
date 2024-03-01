import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import Onboarding from '../../containers/Onboarding';
import TourScreen from '../../containers/TourScreen'
import LoginScreen from '../../containers/Authentication/LoginScreen'
import SignUpScreen from '../../containers/Authentication/SignUpScreen'


import EventEditTabs from '../eventEditTabs';
import TaskTabs from '../taskTabs';
//
import EventCatScreen from '../../containers/Events/EventCatScreen'
import EventDetails from '../../containers/Events/EventDetails'
import InviteeEventDetails from '../../containers/Events/InviteeEventDetails'
import CreateEventScreen from '../../containers/Events/CreateEventScreen'
import VoteScreen from '../../containers/VoteScreen'
import PollDates from '../../containers/PollDates'
import InviteFriend from '../../containers/InviteFriend'
import HostEventConfirm from '../../containers/Events/HostEventConfirm'
import MyEventsScreen from '../../containers/Events/MyEventsScreen'
import EventOptions from '../../containers/Events/EventOptions'
import EventGuests from '../../containers/Events/EventGuestsScreen'
import EventVendorScreen from '../../containers/Vendor/EventVendorsScreen'


//
import AddTask from '../../containers/Task/AddTask'
import AssigneesScreen from '../../containers/AssigneesScreen'
import AddVendor from '../../containers/Vendor/AddVendor';
import VendorManager from '../../containers/Vendor/VendorManager'
import VendorDetails from '../../containers/Vendor/VendorDetails'

//
import InvitationContacts from '../../containers/Invitation/InvitationContacts';
import InvitationScreen from '../../containers/Invitation/InvitationScreen';
import InvitationTemplates from '../../containers/Invitation/InvitationTemplates'

import { userState } from '../../store/userSlice'
import ImageGalleryDisplay from '../../components/Album/imageGalleryDisplay';
import VideoDisplay from '../../components/Album/videoDisplay';
import MyInvitationsScreen from '../../containers/Invitation/MyInvitationsScreen';
import PollDateUpdate from '../../containers/PollDateUpdate';
import EndLocationPolling from '../../containers/Events/EndLocationPolling';
import EndDatePolling from '../../containers/Events/EndDatePolling';
import SuggestLocation from '../../containers/Events/EventDetails/SuggestLocation';
import OtpValidate from '../../containers/Authentication/LoginScreen/OtpValidate';
import UpcomingEventsScreen from '../../containers/Events/UpcomingEventsScreen';
import Account from '../../containers/Account';
import ChangePassword from '../../containers/ChangePassword';
import NotificationSetting from '../../containers/NotificationSetting';
import SendFeedback from '../../containers/SendFeedback';
import SendFeedback2 from '../../containers/SendFeedback2';

import ChatScreen from '../../containers/Chat'
import UserMainTabs from '../UserMainTabs';
import VendorMainTabs from '../VendorMainTabs';
import EventDetailsView from '../../containers/Events/EventDetailsView';
import EventTabsForVendor from '../eventTabsForVendor';
import InterestedEventsScreen from '../../containers/Events/InterestedEventsScreen';
import OrgMainTabs from '../OrgMainTabs';
import Memories from '../../containers/Memories';
import PageNotFound from '../../containers/PageNotFound';
import VendorGallery from '../../containers/Vendor/VendorGallery';
import Policy from '../../containers/Authentication/SignUpScreen/Policy';

type RootStackParamList = {
  Onboarding: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();


const rootNav = () => {

  const userReducer: userState = useSelector(state => state.user)

  const vendorStack = () => {
    return <>
      <RootStack.Screen name="Main" component={VendorMainTabs} />
      <RootStack.Screen name="EventTabsForVendor" component={EventTabsForVendor} />
      <RootStack.Screen name='EventDetailsView' component={EventDetailsView} />

      <RootStack.Screen name="ImageGalleryDisplay" component={ImageGalleryDisplay} />
      <RootStack.Screen name="VideoDisplay" component={VideoDisplay} />
      <RootStack.Screen name="InterestedEventsScreen" component={InterestedEventsScreen} />
      
    </>
  }

  const orgStack = () => {
    return <>
      <RootStack.Screen name="Main" component={OrgMainTabs} />
      <RootStack.Screen name='EventDetailsView' component={EventDetailsView} />
      <RootStack.Screen name='Memories' component={Memories} />
    </>
  }

  const userStack = () => {
    return <>
      {/* <RootStack.Screen name="InvitationScreen" component={InvitationScreen} /> */}

      <RootStack.Screen name="Main" component={UserMainTabs} />
      <RootStack.Screen name="EventTabs" component={EventEditTabs} />
      <RootStack.Screen name="TaskTabs" component={TaskTabs} />

      <RootStack.Screen name="EventCatScreen" component={EventCatScreen} />
      <RootStack.Screen name="CreateEventScreen" component={CreateEventScreen} />
      {/* <RootStack.Screen name="EventDetails" component={EventDetails} /> */}
      <RootStack.Screen name="InviteeEventDetails" component={InviteeEventDetails} />
      <RootStack.Screen name="PollDates" component={PollDates} />
      <RootStack.Screen name="PollDateUpdate" component={PollDateUpdate} />
      <RootStack.Screen name='SuggestLocation' component={SuggestLocation} />
      <RootStack.Screen name="VoteScreen" component={VoteScreen} />
      <RootStack.Screen name="InviteFriend" component={InviteFriend} />
      <RootStack.Screen name="HostEventConfirm" component={HostEventConfirm} />
      <RootStack.Screen name="MyEventsScreen" component={MyEventsScreen} />
      <RootStack.Screen name='UpcomingEventsScreen' component={UpcomingEventsScreen} />
      <RootStack.Screen name="MyInvitationsScreen" component={MyInvitationsScreen} />
      <RootStack.Screen name="EventOptions" component={EventOptions} />

      <RootStack.Screen name="AddTask" component={AddTask} />
      <RootStack.Screen name="AssigneesScreen" component={AssigneesScreen} />
      <RootStack.Screen name="AddVendor" component={AddVendor} />
      <RootStack.Screen name="VendorDetails" component={VendorDetails} />
      <RootStack.Screen name="VendorManager" component={VendorManager} />

      <RootStack.Screen name="InvitationTemplates" component={InvitationTemplates} />
      <RootStack.Screen name="InvitationContacts" component={InvitationContacts} />

      <RootStack.Screen name="EventGuests" component={EventGuests} />
      <RootStack.Screen name="EventVendorScreen" component={EventVendorScreen} />

      <RootStack.Screen name="ImageGalleryDisplay" component={ImageGalleryDisplay} />
      <RootStack.Screen name="VideoDisplay" component={VideoDisplay} />

      <RootStack.Screen name="EndLocationPolling" component={EndLocationPolling} />
      <RootStack.Screen name="EndDatePolling" component={EndDatePolling} />
      <RootStack.Screen name="VendorGallery" component={VendorGallery} />
    </>
  }

  const renderLoggedInStacks = () => {

    let roleStack = null

    switch (userReducer.userData.role) {
      case "USER":
        roleStack = userStack()
        break;
      case "VENDOR":
        roleStack = vendorStack()
        break;
      case "ORGANIZATION":
        roleStack = orgStack()
        break;
      default:
        roleStack = null
    }

    return <>
      {roleStack}
      <RootStack.Screen name="PageNotFound" component={PageNotFound} />
      <RootStack.Screen name="Account" component={Account} />
      <RootStack.Screen name="ChangePassword" component={ChangePassword} />
      <RootStack.Screen name="NotificationSetting" component={NotificationSetting} />
      <RootStack.Screen name="SendFeedback" component={SendFeedback} />
      <RootStack.Screen name="SendFeedback2" component={SendFeedback2} />

      <RootStack.Screen name="ChatScreen" component={ChatScreen} />
    </>
  }

  return <RootStack.Navigator
    screenOptions={{
      headerShown: false
    }}
    initialRouteName="Onboarding">
    {userReducer.loggedIn ? renderLoggedInStacks() :
      <>
        {userReducer.showTourScreen &&
          <>
            <RootStack.Screen name="Onboarding" component={Onboarding} />
            <RootStack.Screen name="TourScreen" component={TourScreen} />
          </>
        }
        <RootStack.Screen name="LoginScreen" component={LoginScreen} />
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
        <RootStack.Screen name="OtpValidate" component={OtpValidate} />
        <RootStack.Screen name="Policy" component={Policy} />
      </>
    }

  </RootStack.Navigator>

};

export default rootNav;
