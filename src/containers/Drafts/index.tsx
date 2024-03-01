import * as React from 'react'
import {
    View,
    ViewStyle,
    ScrollView,
    ImageBackground,
    StyleSheet,
    Dimensions
} from 'react-native';

import TopBar from '../../components/TopBar'

import Text from '../../components/UI/AppText'
import DraftEntry from '../../components/Drafts/Entry'
import { moderateScale, verticalScale } from '../../utils/scalingUnits';

import * as SvgIcons from '../../assets/svg-icons'
import { removeFromDrafts } from '../../store/draftsSlice';
import { connect } from 'react-redux';

import Toast from 'react-native-toast-message'

type Styles = {
    container: ViewStyle
}

class Drafts extends React.Component {
    state = {
        showDrafts: true,
        drafts: "123456".split("")
    }

    deleteFromDrafts = async (draftID) => {
        await this.props.removeFromDrafts({
            id: draftID
        })
        Toast.show({
            type: 'success',
            text1: 'Draft removed'
        })
    }

    componentDidMount() {
        // setTimeout(() => { this.setState({ showDrafts: true }) })
    }

    continueToCreateEvent = (draftsID: number, data) => {
        this.props.navigation.navigate("CreateEventScreen", {
            draftData: data,
            eventUUID: draftsID
        })
    }

    renderDrafts = () => {
        const { showDrafts } = this.state;
        const { drafts } = this.props

        if (drafts == undefined || Object.keys(drafts)?.length == 0) {
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
                }}>No Drafts!</Text>
                <Text style={{
                    color: '#355D9B66',
                    marginTop:moderateScale(10),
                    fontSize: verticalScale(13)
                }}>
                    Unsaved Hapsync will be listed here
                </Text>
            </View>
        }
        else {

            return <View>
                {
                    drafts && Object.keys(drafts)?.map((draftID, index) => {
                        return <DraftEntry
                            key={draftID}
                            data={drafts[draftID]}
                            deleteDraft={() => this.deleteFromDrafts(draftID)}
                            onEditDraft={() => this.continueToCreateEvent(draftID, drafts[draftID])}
                        />
                    })
                }
            </View>
        }
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
                flex: 1
            }}
        >
            <TopBar
                style={{ backgroundColor: 'transparent' }}
                title="Drafts"
            />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {this.renderDrafts()}

            </ScrollView>
        </ImageBackground>
    }
}

const deviceHeight = Dimensions.get("window").height
const deviceWidth = Dimensions.get("window").width

const styles = StyleSheet.create<Styles>({
    container: {

    }
})

const mapStateToProps = state => {
    const { drafts } = state.drafts

    return {
        drafts
    }
}

const mapDispatchToProps = dispatch => {
    return {
        removeFromDrafts: (data) => dispatch(removeFromDrafts(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Drafts)