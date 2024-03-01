import * as React from 'react'
import {
    View,
    ScrollView,
    ViewStyle,
    StyleSheet,
    FlatList,
    TextStyle,
    Pressable,
    Platform,
    Dimensions,
    RefreshControl,
    ActivityIndicator,
    Text,
    ImageBackground
} from 'react-native';

import Feather from 'react-native-vector-icons/Feather'
import Carousel from 'react-native-snap-carousel';
import TopBar from '../../components/TopBar'
import UpcomingItem from '../../components/Events/UpcomingItem';
import MemoryItem from '../../components/Home/MemoryItem';
import { moderateScale } from '../../utils/scalingUnits';
import { getEvents } from '../../store/actionCreators';
import { connect } from 'react-redux';
//import { eventsApi } from '../../store/rtk-query/event';
import { store } from '../../store';
import Config from 'react-native-config'

import InvitationItem from '../../components/Events/InvitationItem'
import YourEventItem from '../../components/Events/YourEventItem';
import ShareHapsync from '../../components/Home/ShareHapsync';

type Styles = {
    container: ViewStyle,
    heading: TextStyle
}

class HomeScreen extends React.Component {

    state = {
        refreshing: false
    }

    componentDidMount() {
        const { userData } = this.props
        getEvents(userData.id, true)
        this.timer = setInterval(() => getEvents(userData.id, false), parseInt(Config.TIMER));

        //this.props.getEvents(1, { track: true })
        // .then((res) => console.log('res is ', res))
        // .catch((err) => console.log('get event err ', err))
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    onRefresh = () => {
        const { userData } = this.props
        getEvents(userData.id, true)

        /* this.setState({ refreshing: true })

        setTimeout(() => {
            this.setState({ refreshing: false })
        }, 300) */
    }

    renderInvitations = () => {
        const { invitations, isLoading, userData } = this.props

        let data = invitations ? [...invitations] : []

        return <><View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: moderateScale(0),
        }}>
            <Text style={styles.heading} >Invitation ({invitations.length})</Text>

        </View>
            {/* {isLoading && <ActivityIndicator
                color="#355D9B"
            />} */}
            <View >
                {data.reverse().slice(0, 2).map((each, index) => {
                    return <InvitationItem key={index} data={each} userId={userData.id} />
                })}
                <Pressable onPress={() => this.props.navigation.navigate("MyInvitationsScreen")} >
                    {data.length > 2 && <Text style={[styles.heading, { fontSize: 14, alignSelf: "flex-end" }]}>See all</Text>}
                </Pressable>
            </View>
        </>
    }

    renderUpcomingEvents = () => {

        const { upcomingEvents, } = this.props;

        //let myEvents = eventsState?.data?.filter(each => each.owner == id)

        let data = upcomingEvents ? [...upcomingEvents] : []

        return <View style={{
            // flexDirection: 'row'
        }}>
            {/* {isLoading && <ActivityIndicator
                color="#355D9B"
            />} */}
            {data.slice(0, 5).map((each, index) => {
                return <View
                    key={each.id}
                >
                    <UpcomingItem
                        key={index}
                        data={each}
                        containerStyle={{
                            ...(index == 0 && { marginRight: 3 })
                        }}
                    />
                    {index == 4 &&
                        <Pressable
                            onPress={() => this.props.navigation.navigate("UpcomingEventsScreen")
                                //this.props.navigation.navigate("MyEventsScreen")
                            }
                            style={{
                                marginLeft: 'auto'
                            }}>
                            <Text style={[styles.heading, { fontSize: 14 }]}>See all</Text>
                        </Pressable>
                    }
                </View>
            })}
        </View>
    }

    renderMemories = () => {
        return <MemoryItem length={this.props?.memories.length} />
    }


    renderRightHeader = () => {
        return <Pressable
            onPress={() => this.props.navigation.navigate("EventCatScreen")}
            style={{
                padding: 5,
            }}>
            <Feather
                name="plus"
                style={{
                    fontSize: 26,
                    color: 'rgba(53, 93, 155, 1)'
                }}
            />
        </Pressable>
    }

    render() {

        const { myEvents, } = this.props

        return <ImageBackground
            source={require("../../assets/images/blurBG.png")}
            resizeMode="cover"
            imageStyle={{
                width: "100%",
                height: "100%"
            }}
            style={{
                flex: 1,
                minWidth: "100%",
                minHeight: "100%"
            }}
        >
            <TopBar
                title="Home"
                leftComponent={<></>}
                rightComponent={this.renderRightHeader()}
                style={{
                    backgroundColor: 'transparent'
                }}
            />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={this.props.isLoading}
                        onRefresh={this.onRefresh}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                <View style={{ marginHorizontal: moderateScale(20) }}>
                    <Text
                        style={[styles.heading, { marginTop: 0 }]}
                    >Your Events ({myEvents.length})</Text>
                    {/* {isLoading && <ActivityIndicator
                    color="#355D9B"
                />} */}
                    <Carousel
                        ref={(c) => { this._carousel = c; }}
                        data={myEvents ? myEvents : []}
                        renderItem={({ item }) => <YourEventItem
                            data={item}
                            containerStyle={{ marginRight: moderateScale(6),marginBottom:moderateScale(10) }}
                        />}
                        sliderWidth={deviceWidth}
                        itemWidth={deviceWidth / 2}
                        //contentContainerCustomStyle={{ paddingBottom: moderateScale(10) }}
                        activeSlideAlignment="start"
                        inactiveSlideScale={1}
                        inactiveSlideOpacity={1}
                    />

                    {this.renderInvitations()}

                    <Text
                        style={styles.heading}
                    >Upcoming Events ({this.props.upcomingEvents.length})</Text>
                    {this.renderUpcomingEvents()}

                    {this.renderMemories()}
                    <ShareHapsync />
                </View>
            </ScrollView>
        </ImageBackground>
    }
}

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const styles = StyleSheet.create<Styles>({
    container: {
        flexGrow: 1,
        //backgroundColor: '#FFFBFB',
        paddingBottom: 10
    },
    heading: {
        fontSize: moderateScale(18),
        fontFamily: 'Mulish-ExtraBold',
        color: '#355D9B',
        marginBottom: moderateScale(11)
    }
})

/* const { getEvents } = eventsApi.endpoints

const mapDispatchToProps = {
    getEvents: getEvents.initiate,
} */

const mapStateToProps = state => {
    const { myEvents,
        upcomingEvents,
        invitations,
        memories,
        isLoading } = state.events;

    const { userData } = state.user

    return {
        myEvents,
        upcomingEvents,
        memories,
        isLoading,
        userData,
        invitations
        //eventsState: getEvents.select(1)(state)
    }
}

export default connect(mapStateToProps)(HomeScreen)