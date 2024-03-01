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

type Styles = {
    container: ViewStyle
}

class PollDateScreen extends React.Component {
    state = {
        datesWithUniqueTimes: undefined,
        timings: []
    }

    componentDidMount() {
        const { datesWithUniqueTimes } = this.props.route.params

        if (datesWithUniqueTimes) {
            this.setState({ timings: datesWithUniqueTimes })
        }
    }

    componentDidUpdate(prevProps) {
        //
        const { datesWithUniqueTimes } = this.props.route.params

        if (this.props.route.params.datesWithUniqueTimes != prevProps.route.params.datesWithUniqueTimes) {

            if (datesWithUniqueTimes) {
                this.setState({ timings: datesWithUniqueTimes })
            }
        }
    }

    handleTimingVote = (timingId, value) => {
        let timings = [...this.state.timings]

        let timeObjTochange = timings.filter((each) => each.id == timingId)[0]

        let pollings = [...timeObjTochange.polling]
        let prevId = timeObjTochange.polling[timeObjTochange.polling.length - 1].id

        pollings.push({
            "id": prevId + 1,
            "userId": 1,
            "userName": "test",
            "vote": value
        })


        timings = [
            ...timings.filter((each) => each.id != timingId),
            {
                ...timeObjTochange,
                polling: pollings
            }
        ]

        // sort
        timings.sort((a, b) => (a.id > b.id) ? 1 : -1)

        this.setState({ timings })
    }

    renderPolls = () => {
        const { timings } = this.state;
        const { fromScreen } = this.props.route.params;

        return <FlatList
            data={timings}
            numColumns={2}
            renderItem={({ item }) => <PollDateItem
                data={item}
                containerStyle={{
                    marginBottom: moderateScale(8),
                    flex: 0.5,
                    marginHorizontal: moderateScale(4)
                }}
                //handleTimingVote={fromScreen == "InviteeEventDetails" ? this.handleTimingVote : undefined}
            />}
            keyExtractor={(item, index) => index}
        />
    }

    renderBackIcon = () => {
        const { fromScreen } = this.props.route.params;
        let screen = fromScreen ? fromScreen : "EventDetails"

        return <Pressable
            /* onPress={() => this.props.navigation.navigate(screen, {
                ...this.props.route.params,
                data: {
                    ...this.props.route.params.data,
                    timings: this.state.timings
                },
            })} */
            onPress={()=> this.props.navigation.goBack() }
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
            <View style={{ marginHorizontal: moderateScale(16) }}>
                {this.renderPolls()}
            </View>
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

export default PollDateScreen