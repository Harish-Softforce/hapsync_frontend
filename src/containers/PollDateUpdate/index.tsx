import * as React from 'react'
import {
    View,
    ViewStyle,
    StyleSheet,
    Pressable,
    ImageBackground,
    Dimensions,
    ScrollView,
    FlatList
} from 'react-native';


import TopBar from '../../components/TopBar'


import PollDateItem from '../../components/PollItem'
import { moderateScale } from '../../utils/scalingUnits';

import * as SvgIcons from '../../assets/svg-icons'
import { connect } from 'react-redux';
import moment from 'moment';
import { inviteeVotingUpdate } from '../../store/actionCreators';
import { Button } from 'react-native-elements';

type Styles = {
    container: ViewStyle
}

class PollDateUpdate extends React.Component {


    handleTimingVote = (pollId, status) => {
        if (!this.props.route.params.incompleteEvent) {
            return
        }
        let obj = {
            pollingId: pollId,
            pollingType: 'TIME',
            vote: status,
            userId: this.props.userData.id
        }
        //console.log(obj)
        inviteeVotingUpdate(obj, this.props.currentEvent.id)
    }

    renderPolls = () => {
        if (!this.props.currentEvent?.timings) {
            return
        }
        const { timings } = this.props.currentEvent;
        let pollDates = []


        if (Array.isArray(timings)) {
            timings.forEach((each) => {

                if ((each.startTime && each.endTime)) {

                    pollDates.push(
                        {
                            date: moment(each.slot, "YYYY-MM-DD").toString(),
                            time: {
                                startTime: moment(each.startTime, 'hh:mm:ss').toString(),
                                endTime: moment(each.endTime, 'hh:mm:ss').toString()
                            },
                            polling: each.polling,
                            // send remaining data in each time obj, for when PollDates screen returns them
                            ...each
                        }
                    )
                } else {
                    pollDates.push(
                        {
                            date: moment(each.slot, "YYYY-MM-DD").toString(),
                            time: undefined,
                            polling: each.polling,
                            // send remaining data in each time obj, for when PollDates screen returns them
                            ...each
                        }
                    )
                }
            })
        }

        return <FlatList
            data={pollDates}
            numColumns={2}
            renderItem={({ item }) => <PollDateItem
                data={item}
                containerStyle={{
                    marginBottom: moderateScale(8),
                    flex: 0.5,
                    marginHorizontal: moderateScale(4)
                }}
                uid={this.props.userData.id}
                eventId={this.props.currentEvent.id}
                handleTimingVote={this.handleTimingVote}
                userEditAccess={this.props.route.params.userEditAccess && (pollDates?.length > 1)}
            //handleTimingVote={fromScreen == "InviteeEventDetails" ? this.handleTimingVote : undefined}
            />}
            keyExtractor={(item, index) => index}
        />
    }

    renderBackIcon = () => {

        return <Pressable
            onPress={() => this.props.navigation.goBack()}
            style={{
                position: 'absolute',
                left: moderateScale(17),
                zIndex: 20,
                padding: moderateScale(3)
                // marginLeft: moderateScale(20),
            }}
        >
            {
                <SvgIcons.BackIcon />
            }
        </Pressable>
    }


    render() {
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
                //leftComponent={this.renderBackIcon()}
                style={{ backgroundColor: 'transparent' }}
                title="Poll Dates"
            />
            <ScrollView style={{ marginHorizontal: moderateScale(16) }}>
                {this.renderPolls()}
                {this.props.route.params.editAccess && <Button
                    containerStyle={{ alignSelf: 'flex-end' }}
                    type="clear"
                    titleStyle={{ color: 'red' }}
                    title={'Suggest more'}
                    onPress={() => {

                        this.props.navigation.navigate("VoteScreen",
                            {
                                //votedDates:JSON.stringify(votedDates),
                                editingEvent: true,
                                eventData: this.props.currentEvent
                            }
                        )
                    }}
                />}
                <View
                    style={{ height: 100 }}
                ></View>
            </ScrollView>

        </ImageBackground>
    }
}

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const styles = StyleSheet.create<Styles>({
    container: {
        flexGrow: 1,
        paddingBottom: 50
    }
})

const mapStateToProps = state => {

    const { currentEvent } = state.events
    const { userData } = state.user

    return {
        currentEvent,
        userData
    }
}

export default connect(mapStateToProps)(PollDateUpdate)