import * as React from 'react'
import {
    View,
    ScrollView,
    ViewStyle,
    StyleSheet,
    TextStyle,
    Dimensions,
    RefreshControl,
    ActivityIndicator,
    ImageBackground,
    Text
} from 'react-native';

import TopBar from '../../../components/TopBar'

import { moderateScale, verticalScale } from '../../../utils/scalingUnits';

import { getEvents } from '../../../store/actionCreators';
import { connect } from 'react-redux';
import InvitationItem from '../../../components/Events/InvitationItem';
import * as SvgIcons from '../../../assets/svg-icons'

type Styles = {
    container: ViewStyle,
    heading: TextStyle
}

class MyInvitationsScreen extends React.Component {
    state = {
        refreshing: false
    }


    onRefresh = async () => {

        this.setState({ refreshing: true })
        await getEvents(this.props.userData.id, true)
        this.setState({ refreshing: false })
    }

    renderInvitations = () => {

        const { invitations, userData } = this.props

        let data = invitations ? [...invitations] : []

        if (data.length == 0) {
            return <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <SvgIcons.EmptyDraftsImage
                    style={{
                        marginBottom: verticalScale(10)
                    }}
                />
                <Text style={{
                    color: '#355D9B',
                    fontWeight: 'bold'
                }}>No Invitations!</Text>
                <Text style={{
                    color: '#355D9B66',
                    fontSize: verticalScale(13)
                }}>
                    All Invitations will be listed here
                </Text>
            </View>
        }
        else {
            return <View style={{ marginHorizontal: moderateScale(20) }}>
                {data.reverse().map((each, index) => {
                    return <InvitationItem key={index} data={each} userId={userData.id} />
                })}
            </View>
        }
    }

    render() {
        const { invitations, isLoading, } = this.props

        let data = invitations ? [...invitations] : []
        let title = "Invitations (" + data.length + ")"

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
                title={title}
                style={{
                    backgroundColor: 'transparent'
                }}
            />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />
                }
            >
                {isLoading && <ActivityIndicator
                    color="#355D9B"
                />}
                {this.renderInvitations()}
            </ScrollView>
        </ImageBackground>
    }
}

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

const mapStateToProps = state => {
    const { invitations, isLoading } = state.events;
    const { userData } = state.user

    return {
        invitations,
        userData,
        isLoading
    }
}

export default connect(mapStateToProps)(MyInvitationsScreen)