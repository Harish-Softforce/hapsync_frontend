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
import { getCurrentEventDetails } from '../../store/actionCreators';
import PageNotFound from '../../containers/PageNotFound';

const Tab = createBottomTabNavigator();

function EventEditTabs(props) {
    const { navigation, route } = props

    const utils = useSelector(state => state.utils)
    const { drafts } = useSelector(state => state.drafts)
    const events = useSelector(state => state.events)

    const dispatch = useDispatch()

    // React.useLayoutEffect(() => {
    //     const routeName = getFocusedRouteNameFromRoute(route);
    //     if (routeName === "TasksParent") {
    //         navigation.setOptions({ tabBarStyle: { display: 'none' } });
    //     } else {
    //         navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    //     }
    // }, [navigation, route]);

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

    const [showConfirmModal, setShowConfirmModal] = React.useState(false)

    React.useEffect(() => {
        if (props.route?.params) {

            getCurrentEventDetails(props.route?.params.data.id, true).then(() => {
                setTimeout(() => {
                    checkConfirmModel()
                }, 1000);
            }).catch(e => {
                console.log(e)
            })
        }
    }, [])

    const checkConfirmModel = () => {
        if (props.route.params.showConfirmModal) {
            setShowConfirmModal(true)
            if (drafts) {
                const obj = drafts
                const draftid = Object.keys(obj)[Object.keys(obj).length - 1]
                //console.log("found Draft" + draftid)
                if (draftid) {
                    dispatch(removeFromDrafts({ id: draftid }))
                }
            }
        }
    }

    const handleRes = (res) => {
        if (res == "YES") {
            navigation.navigate("TasksParent")
        }
        setShowConfirmModal(false)
    }

    if (!events?.currentEvent) {
        return <PageNotFound />
    } else {
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
                                // width,
                                // height,
                                // default fill
                                fill: '#355D9B'
                            }

                            let activeColor = "rgba(0, 173, 239, 1)"

                            if (route.name === 'MyEventDetails') {
                                return focused ? activeIconWrapper(<SvgIcons.EventDetailsIcon {...style} fill="#00ADEF" />) : <SvgIcons.EventDetailsIcon {...style} />;
                            } else if (route.name === 'TasksParent') {
                                return focused ? activeIconWrapper(<SvgIcons.TaskIcon {...style} fill="#00ADEF" />) : <SvgIcons.TaskIcon {...style} />;
                            } else if (route.name === 'Gallery') {
                                return focused ? activeIconWrapper(<SvgIcons.GalleryIcon {...style} fill="#00ADEF" />) : <SvgIcons.GalleryIcon {...style} />;
                            } else if (route.name === 'Chat') {
                                return focused ? activeIconWrapper(<SvgIcons.ChatIcon {...style} fill="#00ADEF" />) : <SvgIcons.ChatIcon {...style} />;
                            }
                            /*  else if (route.name === 'Invitation') {
                                 return focused ? activeIconWrapper(<SvgIcons.InvitationIcon {...style} fill="#00ADEF" />) : <SvgIcons.InvitationIcon {...style} />;
                             } */
                            else if (route.name === 'Budget') {
                                return focused ? activeIconWrapper(<SvgIcons.BudgetTabIcon {...style} fill="#00ADEF" />) : <SvgIcons.BudgetTabIcon {...style} />;
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
                        name="MyEventDetails"  >
                        {(tabProps) => {
                            // use this same tab to render both for edit and for normal event details view
                            // let screenAction = props?.route?.params?.screenAction

                            // if (screenAction == "edit") {
                            //     return <EditorEventDetails
                            //         {...tabProps}
                            //         route={{
                            //             ...tabProps.route,
                            //             params: props.route?.params
                            //         }}
                            //     />
                            // }

                            return <EventDetails
                                {...tabProps}
                                route={{
                                    ...tabProps.route,
                                    params: props.route?.params
                                }}
                            />
                        }}
                    </Tab.Screen>
                    {events.currentEvent.tabAccess
                        && <Tab.Screen
                            options={{
                                title: 'Tasks'
                            }}
                            name="TasksParent" >
                            {(tabProps) => {
                                return <EventTasks
                                    {...tabProps}
                                    route={{
                                        ...tabProps.route,
                                        params: props.route?.params
                                    }}
                                />
                            }}
                        </Tab.Screen>
                    }
                    <Tab.Screen
                        options={{ title: 'Album' }}
                        name="Gallery" >
                        {(tabProps) => {
                            return <EventGallery
                                {...tabProps}
                                route={{
                                    ...tabProps.route,
                                    params: { eventId: props.route?.params.data.id }
                                }}
                            />
                        }}
                    </Tab.Screen>
                    <Tab.Screen
                        options={{ title: 'Chat' }}
                        name="Chat" >
                        {(tabProps) => {
                            return <InviteeChatList
                                {...tabProps}
                                route={{
                                    ...tabProps.route,
                                    params: props.route?.params
                                }}
                            />
                        }}
                    </Tab.Screen>
                    {/* <Tab.Screen
                options={{ title: 'Invitation' }}
                name="Invitation">
                {(tabProps) => {
                    return <Invitation
                        {...tabProps}
                        route={{
                            ...tabProps.route,
                            params: props.route?.params
                        }}
                    />
                }}
            </Tab.Screen> */}
                    {events.currentEvent.userAccess
                        && <Tab.Screen
                            options={{ title: 'Budget' }}
                            name="Budget"  >
                            {(tabProps) => <EventBudgetScreen
                                {...tabProps}
                                route={{
                                    ...tabProps.route,
                                    params: props.route?.params
                                }}
                            />}
                        </Tab.Screen>
                    }
                </Tab.Navigator>
                <ConfirmModal showConfirmModal={showConfirmModal && utils.showSuccessModal == false && utils.showLoadingModal == false}
                    confirmMessage={"Event created Successfully\nDo you want to add tasks ?"}
                    handleRes={handleRes} />
            </>
        );
    }
}

export default EventEditTabs