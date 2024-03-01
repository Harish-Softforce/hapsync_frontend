import * as React from 'react'
import {
    View,
    ImageBackground,
    ScrollView, StyleSheet,
    Dimensions,
    Pressable,
    Switch,
    Image
} from 'react-native'

import AppButton from '../../../components/UI/button'
import Text from '../../../components/UI/AppText'
import TopBar from '../../../components/TopBar'

import { moderateScale, verticalScale } from '../../../utils/scalingUnits'

import * as SvgIcons from '../../../assets/svg-icons'

class InvitationContacts extends React.Component {
    state = {

    }

    renderContacts = () => {
        const contacts = "123458".split("")

        return contacts?.map((contact, index) => {
            return <ContactItem
                key={index}
                data={contact}
            />
        })
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
                // flex: 1,
                minWidth: "100%",
                minHeight: "100%"
            }}
        ><ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: verticalScale(30)
            }}
        >
                <TopBar
                    style={{ backgroundColor: 'transparent' }}
                    title="Select Contact"
                />
                <View style={{
                    marginHorizontal: moderateScale(20),
                    flex: 1
                }}>
                    {this.renderContacts()}
                    <AppButton
                        title="Invite"
                        style={{
                            backgroundColor: '#00ADEF',
                            height: verticalScale(40),
                            marginTop: 'auto'
                        }}
                    />
                </View>
            </ScrollView>
        </ImageBackground >
    }
}

const ContactItem = () => {
    const [checked, setChecked] = React.useState(false)

    return <View
        style={{
            flexDirection: 'row',
            height: moderateScale(65),
            alignItems: 'center',
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
            <Text style={{
                fontSize: moderateScale(13),
                fontWeight: 'bold',
                color: '#355D9B'
            }}>
                John Smith
            </Text>
            <Text style={{
                fontSize: moderateScale(10),
                color: '#88879C'
            }}>
                +01 123580 45795
            </Text>
        </View>
        <Pressable
            onPress={() => {
                setChecked(!checked)
            }}
            style={{
                flex: 0.15,
                justifyContent: 'center',
                alignItems: 'flex-end',
                marginLeft: 'auto'
            }}>
            {checked ?
                <SvgIcons.CheckedIcon
                    style={{ transform: [{ scale: moderateScale(0.9) }] }}
                /> :

                <SvgIcons.UncheckedIcon
                    style={{ transform: [{ scale: moderateScale(0.9) }] }}
                />
            }
        </Pressable>
    </View>
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


export default InvitationContacts
