import * as React from 'react'
import {
    View,
    ViewStyle,
    StyleSheet,
    ScrollView,
    TextStyle,
    ImageBackground,
    Dimensions,
    Text,
} from 'react-native';
import { connect } from 'react-redux';

import TopBar from '../../components/TopBar'
import { moderateScale, verticalScale } from '../../utils/scalingUnits';
import * as SvgIcons from '../../assets/svg-icons'

import UpcomingItem from '../../components/Events/UpcomingItem';

type Styles = {
    container: ViewStyle,
    heading: TextStyle
}

class Memories extends React.Component {

    renderMemories = () => {

        const { memories } = this.props;
        let data = memories ? [...memories] : []
        data.reverse()

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
                }}>No Memories!</Text>
                <Text style={{
                    color: '#355D9B66',
                    fontSize: verticalScale(13)
                }}>
                    All Memories will be listed here
                </Text>
            </View>
        }
        else {

            return <View style={{
                // flexDirection: 'row'
                marginHorizontal: moderateScale(20)
            }}>
                {data.map((each, index) => {
                    return <UpcomingItem
                        key={index}
                        data={each}
                        role={this.props.userData.role}
                        hideShare={true}
                        containerStyle={{
                            ...(index == 0 && { marginRight: 3 })
                        }}
                    />
                })}
            </View>
        }
    }

    render() {
        const { memories } = this.props;
        let data = memories ? [...memories] : []

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
                title={"Memories (" + data.length + ")"}
                style={{
                    backgroundColor: 'transparent'
                }}
            />
            <ScrollView
                contentContainerStyle={styles.container}
            >
                {this.renderMemories()}
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
    const { memories } = state.events;
    const { userData } = state.user

    return {
        memories,
        userData
    }
}

export default connect(mapStateToProps)(Memories)