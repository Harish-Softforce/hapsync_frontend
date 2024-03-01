import * as React from 'react';
import { View } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../../containers/HomeScreen'
import Memories from '../../containers/Memories'
import CreateScreen from '../../containers/Events/CreateEventScreen'
import Drafts from '../../containers/Drafts'
import Account from '../../containers/Account'

import * as SvgIcons from '../../assets/svg-icons'
import EventCat from '../../containers/Events/EventCatScreen';
import Profile from '../../containers/Profile';
import VendorDashboard from '../../containers/VendorDashboard';
import VendorAlbum from '../../containers/VendorAlbum';

const Tab = createBottomTabNavigator();

function VendorMainTabs() {

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
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused }) => {
                    let iconName;

                    let width = 25
                    let height = 25
                    let style = {
                        // width,
                        // height,
                        // default fill
                        fill: '#355D9B'
                    }

                    let activeColor = "rgba(0, 173, 239, 1)"

                    if (route.name === 'VendorDashboard') {
                        return focused ? activeIconWrapper(<SvgIcons.HomeIcon {...style} fill="#00ADEF" />) : <SvgIcons.HomeIcon {...style} />;
                    } else if (route.name === 'VendorAlbum') {
                        return focused ? activeIconWrapper(<SvgIcons.GalleryIcon {...style} fill="#00ADEF" />) : <SvgIcons.GalleryIcon {...style} />;
                    } else if (route.name === 'Profile') {
                        return focused ? activeIconWrapper(<SvgIcons.AccountIcon {...style} fill="#00ADEF" />) : <SvgIcons.AccountIcon {...style} />;
                    }
                    // You can return any component that you like here!
                    return iconName;
                },
                tabBarActiveTintColor: 'rgba(0, 173, 239, 1)',
                tabBarHideOnKeyboard: true,
                tabBarInactiveTintColor: '#355D9B'

            })
            }

        >
            <Tab.Screen
                options={{ title: 'Home' }}
                name="VendorDashboard" component={VendorDashboard} />
            <Tab.Screen
                options={{ title: 'Album' }}
                name="VendorAlbum" component={VendorAlbum} />
            <Tab.Screen
                options={{ title: 'Profile' }}
                name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}

export default VendorMainTabs