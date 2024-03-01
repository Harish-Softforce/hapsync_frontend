import * as React from 'react'
import {
    View,
    ScrollView,
    ViewStyle,
    StyleSheet,
    TextStyle,
    Dimensions,
    RefreshControl,
    ImageBackground
} from 'react-native';


import TopBar from '../../../components/TopBar'

import { moderateScale } from '../../../utils/scalingUnits';
import { getEvents } from '../../../store/actionCreators';
import { connect } from 'react-redux';
import UpcomingItem from '../../../components/Events/UpcomingItem';

type Styles = {
    container: ViewStyle,
    heading: TextStyle
}

class HomeScreen extends React.Component {
    state = {
        refreshing: false
    }


    onRefresh = () => {
        //this.props.getEvents(1, { track: true })
        getEvents(this.props.userData.id, true)
        this.setState({ refreshing: true })

        setTimeout(() => {
            this.setState({ refreshing: false })
        }, 300)
    }

    renderYourEvents = () => {
        let id = 1

        const {
            //eventsState
            myEvents
        } = this.props;

        //let myEvents = eventsState?.data?.filter(each => each.owner == id)

        let data = myEvents ? [...myEvents] : []
        data.reverse()

        return <View style={{
            // flexDirection: 'row'
        }}>
            {data.reverse().map((each, index) => {
                return <UpcomingItem
                    key={index}
                    data={each}
                    containerStyle={{
                        ...(index == 0 && { marginRight: 3 })
                    }}
                />
            })}
        </View>
    }


    render() {
        let len = 0
        let data = this.props.myEvents ? [...this.props.myEvents] : []
        len = data.length

        return <ImageBackground
            source={require("../../../assets/images/blurBG.png")}
            resizeMode="cover"
            imageStyle={{
                width: "100%",
                height: "100%"
            }}
            style={{
                // flex: 1,
                minWidth: "100%",
                minHeight: "100%"
            }}
        ><ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                />
            }
        >
                <TopBar
                    title={"My Events (" + len + ")"}
                    style={{
                        backgroundColor: 'transparent'
                    }}
                />
                <View style={{ marginHorizontal: moderateScale(20) }}>

                    {this.renderYourEvents()}


                </View>
            </ScrollView>
        </ImageBackground>
    }
}

const deviceWidth = Dimensions.get("window").width

const styles = StyleSheet.create<Styles>({
    container: {
        flexGrow: 1,
        //backgroundColor: '#FFFBFB',
        paddingBottom: 30
    },
    heading: {
        fontSize: moderateScale(16),
        fontFamily: 'Mulish-ExtraBold',
        color: '#355D9B',
        marginBottom: moderateScale(11)
    }
})

//const { getEvents } = eventsApi.endpoints

const mapStateToProps = state => {
    const { myEvents, } = state.events;
    const { userData } = state.user

    return {
        myEvents,
        userData,
        //eventsState: getEvents.select(1)(state)
    }
}

/* const mapDispatchToProps = {
    getEvents: getEvents.initiate
} */

export default connect(mapStateToProps)(HomeScreen)