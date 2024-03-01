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

import Text from '../../../components/UI/AppText'
import AppButton from '../../../components/UI/button'
import TopBar from '../../../components/TopBar'
import { moderateScale, verticalScale } from '../../../utils/scalingUnits'

import * as SvgIcons from '../../../assets/svg-icons'

import { CommonActions } from '@react-navigation/native';

class Templates extends React.Component {
    state = {
        selectedTemplate: undefined,
        //
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

    renderTemplates = () => {
        const { templates, selectedTemplate } = this.state;

        return <View>
            {templates?.map((template, index) => {
                return <Pressable
                    key={index}
                    onPress={() => {
                        this.setState({ selectedTemplate: template.id })
                    }}
                    style={{
                        backgroundColor: '#fff',
                        height: verticalScale(180),
                        padding: verticalScale(10),
                        borderRadius: verticalScale(15),
                        marginBottom: verticalScale(8),
                        borderColor: '#355D9B',
                        borderWidth: selectedTemplate == template.id ? verticalScale(2) : 0
                    }}
                >
                    <Image
                        source={template.source}
                        style={{
                            flex: 1,
                            width: '100%',
                            resizeMode: 'cover',
                            borderRadius: verticalScale(15)
                        }}
                    />
                </Pressable>
            })}
        </View>
    }

    saveAndgoBack = () => {
        const { selectedTemplate } = this.state
        const { navigation } = this.props

        navigation.dispatch((state) => {
            // Add the home route to the start of the stack
            let routes = [...state.routes].filter((each) => {
                return each?.name !== "InvitationTemplates"
            })
            routes = routes?.map((each) => {
                if (each?.name == "EventTabs") {
                    return {
                        ...each,
                        params: {
                            ...each?.params,
                            selectedTemplateId: selectedTemplate
                        }
                    }
                }
                return {
                    ...each
                }
            })

            return CommonActions.reset({
                ...state,
                routes,
                index: routes.length - 1,
            });
        });

        // this.props.navigation?.navigate("EventTabs", {
        //     initial: false,
        //     screen: 'Invitation',
        //     params: {
        //         selectedTemplateId: selectedTemplate
        //     }
        // })
    }

    render() {
        const { selectedTemplate } = this.state

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
            }}
        >
                <TopBar
                    style={{ backgroundColor: 'transparent' }}
                    title="Invitation"
                />
                <View style={{
                    marginHorizontal: moderateScale(20),
                    flex: 1
                }}>
                    {this.renderTemplates()}
                    <AppButton
                        title="Next"
                        clicked={this.saveAndgoBack}
                        style={{
                            backgroundColor: '#00ADEF',
                            height: verticalScale(40)
                        }}
                    />
                </View>
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


export default Templates
