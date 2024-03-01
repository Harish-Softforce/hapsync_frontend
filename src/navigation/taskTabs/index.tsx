import * as React from 'react';
import { View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EditorEventDetails from '../../containers/Events/EditorEventDetails'
import Chat from '../../containers/Chat'
import TaskBudgetScreen from '../../containers/Task/TaskBudgetScreen'
import VendorsScreen from '../../containers/Vendor/TaskVendorsScreen'
import EventTasks from '../../containers/Events/EventTasks'
import TaskDetails from '../../containers/Task/TaskDetails'
import * as SvgIcons from '../../assets/svg-icons'
import EventCat from '../../containers/Events/EventCatScreen';
import VendorManager from '../../containers/Vendor/VendorManager';
import { useNavigation } from '@react-navigation/native';
import TasksVendorChatlist from '../../containers/Vendor/TaskVendorChatList';
import { clearCurrentTask, getCurrentTask } from '../../store/actionCreators';
import PageNotFound from '../../containers/PageNotFound';
import { useSelector } from 'react-redux';
import { navigationRef } from '../navigationRef';
const Tab = createBottomTabNavigator();
const Gotohome = (props) => {
    React.useEffect(() => {
        props.navigation.popToTop()
    }, [])
    return <></>
}
function TaskTabs(props) {
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

    const events = useSelector(state => state.events)

    React.useEffect(async () => {
        await getCurrentTask(props.route.params.data.id)
        return () => {
            clearCurrentTask()
        }
    }, [])

    if (!events?.currentTask) {
        return <PageNotFound />
    } else {
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
                        if (route.name === 'Details') {
                            return focused ? activeIconWrapper(<SvgIcons.TaskIcon {...style} fill="#00ADEF" />) : <SvgIcons.TaskIcon {...style} />;
                        } else if (route.name === 'Vendors') {
                            return focused ? activeIconWrapper(<SvgIcons.VendorTabIcon {...style} fill="#00ADEF" />) : <SvgIcons.VendorTabIcon {...style} />;
                        } else if (route.name === 'TasksVendorChatlist') {
                            return focused ? activeIconWrapper(<SvgIcons.ChatIcon {...style} fill="#00ADEF" />) : <SvgIcons.ChatIcon {...style} />;
                        }
                        else if (route.name === 'TaskBudgetScreen') {
                            return focused ? activeIconWrapper(<SvgIcons.BudgetTabIcon {...style} fill="#00ADEF" />) : <SvgIcons.BudgetTabIcon {...style} />;
                        } else if (route.name === 'HomeScreen') {
                            return focused ? activeIconWrapper(<SvgIcons.HomeIcon {...style} fill="#00ADEF" />) : <SvgIcons.HomeIcon {...style} />;
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
                    name="Details" >
                    {(tabProps) => <TaskDetails
                        {...tabProps}
                        route={{
                            ...tabProps.route,
                            params: props.route?.params
                        }}
                    />}
                </Tab.Screen>
                <Tab.Screen
                    options={{ title: 'Vendors' }}
                    name="Vendors">
                    {(tabProps) => <VendorManager
                        {...tabProps}
                        route={{
                            ...tabProps.route,
                            params: props.route?.params
                        }}
                    />}
                </Tab.Screen>
                <Tab.Screen
                    options={{ title: 'Chat' }}
                    name="TasksVendorChatlist">
                    {(tabProps) => <TasksVendorChatlist
                        {...tabProps}
                        route={{
                            ...tabProps.route,
                            params: props.route?.params
                        }}
                    />}
                </Tab.Screen>
                <Tab.Screen
                    options={{ title: 'Budget' }}
                    name="TaskBudgetScreen">
                    {(tabProps) => <TaskBudgetScreen
                        {...tabProps}
                        route={{
                            ...tabProps.route,
                            params: props.route?.params
                        }}
                    />}
                </Tab.Screen>
                {/* <Tab.Screen
                options={{ title: 'Home' }}
                name="HomeScreen"  >
                {(tabProps) => <Gotohome
                    {...tabProps}
                />}
            </Tab.Screen> */}
            </Tab.Navigator>
        );
    }
}
export default TaskTabs