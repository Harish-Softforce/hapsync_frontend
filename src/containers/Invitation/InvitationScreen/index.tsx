import * as React from 'react'
import {
    View,
    ImageBackground,
    ScrollView, StyleSheet,
    Dimensions,
    Pressable,
    Switch
} from 'react-native'

import Text from '../../../components/UI/AppText'
import TopBar from '../../../components/TopBar'
import AppButton from '../../../components/UI/button'

import { moderateScale, verticalScale } from '../../../utils/scalingUnits'



import * as SvgIcons from '../../../assets/svg-icons'

class EventGallery extends React.Component {
    state = {
        editMode: false,
        //
        currentTemplate: 1,
        templates: [
            {
                id: 1,
                source: require("../../../assets/images/invitationTemplate1.png")
            },
            {
                id: 2,
                source: require("../../../assets/images/invitationTemplate2.png")
            },
            {
                id: 3,
                source: require("../../../assets/images/invitationTemplate3.png")
            },
        ]
    }

    componentDidUpdate(prevProps) {
        if (this.props.route.params?.selectedTemplateId !== prevProps.route.params?.selectedTemplateId) {
            if (this.props?.route?.params?.selectedTemplateId) {
                this.setState({ currentTemplate: this.props?.route?.params?.selectedTemplateId })
            }
        }
    }

    renderTemplateBuilder = () => {
        const { templates, currentTemplate } = this.state

        let selectedTemplate = templates?.filter((template) => {
            return currentTemplate == template.id
        })[0]

        return <View
            style={{
                height: verticalScale(350),
                backgroundColor: '#fff',
                borderRadius: verticalScale(15),
                padding: moderateScale(20)
            }}
        >
            <ImageBackground
                source={selectedTemplate?.source
                }
                style={{
                    flex: 1,
                }}
                imageStyle={{
                    borderRadius: verticalScale(15)
                }}
            />
        </View>
    }

    renderBottomButtons = () => {
        const { editMode } = this.state

        if (editMode) {
            return <View
                style={{
                    minHeight: verticalScale(100),
                    marginHorizontal: moderateScale(20),
                    marginTop: verticalScale(100)
                }}
            >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <AppButton
                        title="Edit Text"
                        style={[styles.button,
                        {
                            marginRight: moderateScale(7),
                            backgroundColor: '#00ADEF'
                        }]}
                        labelStyle={{
                            fontSize: moderateScale(14)
                        }}
                    />
                    <AppButton
                        title="Background Color"
                        clicked={() => this.props.navigation?.navigate("InvitationTemplates")}
                        style={[styles.button, {
                            backgroundColor: '#1AA54D'
                        }]}
                        labelStyle={{
                            fontSize: moderateScale(14)
                        }}
                    />
                </View>
                <AppButton
                    title="Save"
                    clicked={() => this.setState({ editMode: false })}
                    style={[styles.button, {
                        marginTop: verticalScale(7),
                    }]}
                    labelStyle={{
                        fontSize: moderateScale(14)
                    }}
                />
            </View>
        }

        return <View style={{
            marginHorizontal: moderateScale(20),
            minHeight: verticalScale(100),
            marginTop: verticalScale(100)
        }}>
            <AppButton
                title="Edit"
                clicked={() => this.setState({ editMode: true })}
                style={[styles.button, {
                    backgroundColor: '#1AA54D',
                    marginBottom: verticalScale(7)
                }]}
                labelStyle={{
                    fontSize: moderateScale(14)
                }}
            />
            <View style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <AppButton
                    title="Select Contact"
                    clicked={() => this.props.navigation?.navigate("InvitationContacts")}
                    style={[styles.button,
                    {
                        marginRight: moderateScale(7),
                        backgroundColor: '#00ADEF'
                    }]}
                    labelStyle={{
                        fontSize: moderateScale(14)
                    }}
                />
                <AppButton
                    title="Download"
                    style={[styles.button]}
                    labelStyle={{
                        fontSize: moderateScale(14)
                    }}
                />
            </View>
        </View>
    }

    render() {
        const { editMode } = this.state

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
        ><View
            style={{
                flex: 1,
            }}
        >
                <TopBar
                    style={{ backgroundColor: 'transparent' }}
                    title={editMode ? "Edit Invitation" : "Invitation"}
                />
                <View style={{
                    flex: 1,
                    marginHorizontal: moderateScale(20)
                }}>
                    {this.renderTemplateBuilder()}
                    {this.renderBottomButtons()}
                </View>
            </View>
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
    },
    button: {
        height: verticalScale(40),
        maxHeight: verticalScale(40),
        borderRadius: verticalScale(8),
        flex: 1
    }
})


export default EventGallery
