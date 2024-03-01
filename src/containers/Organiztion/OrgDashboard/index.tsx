import * as React from 'react'
import {
    View,
    ScrollView,
    ViewStyle,
    StyleSheet,
    TextStyle,
    Pressable,
    Platform,
    RefreshControl,
    Text,
    ImageBackground
} from 'react-native';
import TopBar from '../../../components/TopBar'
import UpcomingItem from '../../../components/Events/UpcomingItem';
import MemoryItem from '../../../components/Home/MemoryItem';
import { moderateScale } from '../../../utils/scalingUnits';
import { getEvents } from '../../../store/actionCreators';
import { connect } from 'react-redux';
import Config from 'react-native-config'
import ShareHapsync from '../../../components/Home/ShareHapsync';

type Styles = {
    container: ViewStyle,
    heading: TextStyle
}

class OrgDashboard extends React.Component {

    state = {
        refreshing: false
    }

    componentDidMount() {
        const { userData } = this.props
        getEvents(userData.id, true)
        this.timer = setInterval(() => getEvents(userData.id, false), parseInt(Config.TIMER));
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    onRefresh = () => {
        const { userData } = this.props
        getEvents(userData.id, true)
    }

    renderUpcomingEvents = () => {

        const { upcomingEvents, } = this.props;
        let data = upcomingEvents ? [...upcomingEvents] : []

        return <View>
            {data.slice(0, 5).map((each, index) => {
                return <View
                    key={each.id}
                >
                    <UpcomingItem
                        key={index}
                        data={each}
                        role={"ORGANIZATION"}
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

    render() {
        return <ImageBackground
            source={require("../../../assets/images/blurBG.png")}
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
                //rightComponent={this.renderRightHeader()}
                style={{
                    backgroundColor: 'transparent'
                }}
            />
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={this.props.isLoading}
                        onRefresh={this.onRefresh}
                    />
                }
            >
                <View style={{ marginHorizontal: moderateScale(20) }}>
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

const styles = StyleSheet.create<Styles>({
    container: {
        //flexGrow: 1,
        paddingBottom: 20
    },
    heading: {
        fontSize: moderateScale(18),
        fontFamily: 'Mulish-ExtraBold',
        color: '#355D9B',
        marginBottom: moderateScale(11)
    }
})

const mapStateToProps = state => {
    const { upcomingEvents, memories, isLoading } = state.events;
    const { userData } = state.user

    return {
        upcomingEvents,
        memories,
        isLoading,
        userData,
    }
}

export default connect(mapStateToProps)(OrgDashboard)