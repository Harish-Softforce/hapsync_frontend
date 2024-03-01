import * as React from 'react'
import {
    View,
    ImageBackground,
    ScrollView, StyleSheet,
    Dimensions,
    Pressable,
    Switch,
    Modal,
    Image
} from 'react-native'

import Text from '../../../components/UI/AppText'
import TopBar from '../../../components/TopBar'
import { moderateScale, verticalScale } from '../../../utils/scalingUnits'

import * as SvgIcons from '../../../assets/svg-icons'

class EventGallery extends React.Component {
    state = {
    }

    renderGuests = () => {
        const guestsData = "1234567890".split("")

        return <View
            style={{
                marginHorizontal: moderateScale(20)
            }}
        >
            {guestsData.map((each, index) => {
                return <View
                    key={each}
                    style={{
                        flexDirection: 'row',
                        height: moderateScale(65),
                        alignItems: 'center',
                        borderBottomWidth: 0.5,
                        borderColor: '#355D9B',
                        marginBottom: verticalScale(9)
                    }}>

                    <Image
                        style={{
                            width: moderateScale(54),
                            height: moderateScale(54),
                            borderRadius: moderateScale(27)
                        }}

                        source={require("../../../assets/images/event.png")}
                    />
                    <View
                        style={{
                            flex: 0.6,
                            paddingLeft: moderateScale(10)
                        }}
                    >
                        <Text style={{ fontSize: moderateScale(13), color: '#355D9B' }}>
                            John Doe
                        </Text>
                        <Text style={{
                            fontSize: moderateScale(10),
                            color: '#88879C'
                        }}>
                            +12345678
                        </Text>
                    </View>

                </View>
            })
            }
        </View>
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
            }}
        ><ScrollView
            contentContainerStyle={{
                flexGrow: 1,
            }}
        >
                <TopBar
                    style={{ backgroundColor: 'transparent' }}
                    title="Event Guests"
                />
                {this.renderGuests()}
            </ScrollView>
        </ImageBackground >
    }
}


const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
    heading: {
        fontSize: moderateScale(22),
        marginVertical: verticalScale(20),
        marginHorizontal: moderateScale(11),
        color: '#355D9B',
        fontFamily: 'Mulish-ExtraBold'
    }
})


export default EventGallery
