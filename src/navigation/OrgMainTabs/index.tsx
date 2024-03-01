import * as React from 'react';
import { View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SvgIcons from '../../assets/svg-icons' 
import Profile from '../../containers/Profile'; 
import OrgDashboard from '../../containers/Organiztion/OrgDashboard';
import OrgMembers from '../../containers/Organiztion/OrgMembers';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const Tab = createBottomTabNavigator();

function OrgMainTabs() {

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
                    let style = { 
                        fill: '#355D9B'
                    }
                    if (route.name === 'OrgDashboard') {
                        return focused ? activeIconWrapper(<SvgIcons.HomeIcon {...style} fill="#00ADEF" />) : <SvgIcons.HomeIcon {...style} />;
                    } else if (route.name === 'OrgMembers') {
                        return focused ? activeIconWrapper(<FontAwesome5 name="users" size={24} color="#00ADEF" />) : <FontAwesome5 name="users" size={24} color="#355D9B" />;
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
                name="OrgDashboard" component={OrgDashboard} />
            <Tab.Screen
                options={{ title: 'Members' }}
                name="OrgMembers" component={OrgMembers} />
            <Tab.Screen
                options={{ title: 'Profile' }}
                name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}

export default OrgMainTabs