import * as React from 'react'
import {
    View,
    Image,
    ScrollView,
    TextInput,
    ViewStyle,
    StyleSheet,
    Pressable,
    Dimensions,
    ImageBackground,
    Platform,
    Keyboard
} from 'react-native';

import Text from '../../../components/UI/AppText'
import AppButton from '../../../components/UI/button'

import * as SvgIcons from '../../../assets/svg-icons'
import AuthInput from '../../../components/AuthUI/AuthInput'


import validator from 'validator'
import { TabView, TabBar, TabBarItem } from 'react-native-tab-view';
import { moderateScale } from '../../../utils/scalingUnits';
import { register } from '../../../store/actionCreators';
import { ButtonGroup } from 'react-native-elements';
import UserSignUp from './UserSignUp';
import OrganizationSignUp from './OrganizationSignUp';
import VendorSignUp from './VendorSignUp';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import instance from '../../../axios';
import Toast from 'react-native-toast-message';
import DeviceCountry, {
    TYPE_ANY,
    TYPE_TELEPHONY,
    TYPE_CONFIGURATION,
} from 'react-native-device-country';

type Styles = {
    container: ViewStyle
}

/**
 * FORM TYPE
 */

type FormItem = {
    label: string,
    value: string | undefined,
    valid: boolean,
    errorMessage: string | string[] | undefined,
    inputProps: any,
    icon: any
}

type FormState = {
    [key: string]: FormItem
}

/**
 * TAB VIEW ROUTES
 */
type RouteItem = {
    key: string,
    title: string
}

type SignUpStateType = {
    formValue: FormState,
    tabIndex: number,
    tabRoutes: Array<RouteItem>
}

type Props = {

}

class SignUpScreen extends React.Component<Props, SignUpStateType> {
    state: SignUpStateType = {
        formValue: {
            name: {
                label: "Username",
                value: undefined,
                valid: false,
                errorMessage: undefined,
                inputProps: {},
                icon: <SvgIcons.UserIcon />
            },
            email: {
                label: 'Email',
                value: undefined,
                valid: false,
                errorMessage: undefined,
                inputProps: {},
                icon: <SvgIcons.MailIcon />
            },
            phone: {
                label: 'Phone Number',
                value: undefined,
                valid: false,
                errorMessage: undefined,
                inputProps: {
                    keyboardType: "numeric",
                    returnKeyType: 'done',
                    onSubmitEditing: Keyboard.dismiss
                },
                icon: <SvgIcons.PhoneIcon />
            },
            password: {
                label: 'Password',
                value: undefined,
                valid: false,
                errorMessage: undefined,
                inputProps: {
                    secureTextEntry: true
                },
                icon: <SvgIcons.KeyIcon />
            },
            confirmPassword: {
                label: 'Confirm Password',
                value: undefined,
                valid: false,
                touched: false,
                errorMessage: undefined,
                inputProps: {
                    secureTextEntry: true
                },
                icon: <SvgIcons.KeyIcon />
            },
        },
        tabIndex: 0,
        tabRoutes: [
            { key: 'user', title: 'User' },
            { key: 'business', title: 'Business' }
        ],
        buttonIndex: 0,
        countryCodes: [],
        deviceCountryCode: "+1"
    }

    componentDidMount(): void {
        instance.get("/dashboard/getCountryCodes")
            .then(r => {
                this.setState({ countryCodes: r.data });
            }).catch(e => {
                Toast.show({
                    type: 'error',
                    text1: "Failed Service"
                })
                this.props.navigation.navigate("LoginScreen")
            })
        DeviceCountry.getCountryCode()
            .then((result) => {
                console.log(result);
                if (String(result.code).toLowerCase() == "in") {
                    this.setState({ deviceCountryCode: "+91" });
                } else {
                    this.setState({ deviceCountryCode: "+1" });
                }
                // {"code": "BY", "type": "telephony"}
            })
            .catch((e) => {
                console.log(e);
            });
    }

    componentWillUnmount() {

    }

    validate = (key) => {
        let formValue = this.state.formValue;

        switch (key) {
            //
            case "name":
            case "username":
                if (validator.isEmpty(formValue[key].value)) {
                    formValue[
                        key
                    ].errorMessage = `${formValue[key].label} cannot be empty`;
                    formValue[key].valid = false;
                } else {
                    formValue[key].errorMessage = undefined;
                    formValue[key].valid = true;
                }
                break;
            //
            case "email":
                if (!validator.isEmail(formValue[key].value)) {
                    formValue[key].errorMessage = "Email is not valid";
                    formValue[key].valid = false;
                } else {
                    formValue[key].errorMessage = undefined;
                    formValue[key].valid = true;
                }
                break;

            case "phone":
                if (!validator.isMobilePhone(formValue[key].value, ['en-IN', 'en-US'])) {
                    formValue[key].errorMessage = "Invalid Phone Number";
                    formValue[key].valid = false;
                } else {
                    formValue[key].errorMessage = undefined;
                    formValue[key].valid = true;
                }
                break;
            case "password":
                let error = [];
                if (!validator.matches(formValue[key].value, "[A-Za-z]")) {
                    error.push("At least one letter");
                    formValue[key].valid = false;
                }
                if (!validator.matches(formValue[key].value, "^.{6,}$")) {
                    error.push("At least 6 characters");
                    formValue[key].valid = false;
                }
                // if there are no errors in password
                if (error.length === 0) {
                    formValue[key].errorMessage = undefined;
                    formValue[key].valid = true;
                }
                formValue[key].errorMessage = error;

                // check confirm password equality if only confirm password has been touched
                if (formValue.confirmPassword.touched === true) {
                    if (
                        formValue[key].value !== formValue.confirmPassword.value
                    ) {
                        formValue.confirmPassword.errorMessage = "Passwords do not match";
                        formValue.confirmPassword.valid = false;
                    } else {
                        formValue.confirmPassword.errorMessage = undefined;
                        formValue.confirmPassword.valid = true;
                    }
                }
                break;
            case "confirmPassword":
                // set touched to true
                formValue[key].touched = true;

                if (formValue[key].value !== formValue.password.value) {
                    formValue[key].errorMessage = "Passwords do not match";
                    formValue[key].valid = false;
                } else {
                    formValue[key].errorMessage = undefined;
                    formValue[key].valid = true;
                }
                break;
            default:
            // code block
        }
    }

    buildFormInputs = (routeKey) => {
        const { formValue } = this.state

        return Object.keys(formValue).map((key, index) => {
            let label = formValue[key].label;
            if (routeKey == "business" && (key == "name" || key == "email")) {
                label = "Business " + label
            }

            return <View key={key} style={{
                width: '100%',
                minHeight: 60,
                alignSelf: 'center'
            }}>
                <AuthInput
                    // label={formValue[key].label}
                    containerStyle={{ marginBottom: 3, marginTop: 2 }}
                    placeholder={label}
                    value={formValue[key].value}
                    errorMessage={formValue[key].errorMessage}
                    icon={formValue[key].icon}
                    {...formValue[key].inputProps}

                    onChangeText={(val) => this.handleTextChange(key, val)}
                />
            </View>
        })
    }

    handleTextChange = (key, value) => {
        let formValue = { ...this.state.formValue }
        formValue[key].value = value

        this.setState({ formValue })

        this.validate(key);
    }

    checkSubmitButtonValid = () => {
        let buttonValid = true

        for (let key in this.state.formValue) {
            buttonValid = buttonValid && this.state.formValue[key].valid
        }

        return buttonValid
    }

    submit = async (tabIndex) => {

        const { formValue } = this.state;

        const data = {
            "email": formValue.email.value,
            "userName": formValue.name.value,
            "password": formValue.password.value,
            "confirmPassword": formValue.confirmPassword.value,
            "phone": formValue.phone.value,
            "role": tabIndex == 0 ? "user" : "business",
        }

        await register(data, this.props.navigation)

        // clear form
        let formVal = { ...this.state.formValue }
        for (let key in formVal) {
            formVal[key].value = undefined
            formVal[key].valid = false
            formVal[key].errorMessage = undefined
        }
        this.setState({ formValue: formVal })

    }

    renderSocialIcons = () => {
        const socials = [
            {
                type: 'facebook',
                icon: <SvgIcons.FbIcon />
            },
            {
                type: 'google',
                icon: <SvgIcons.GoogleIcon />
            },
            {
                type: 'twitter',
                icon: <SvgIcons.TwitterIcon />
            }
        ]


        return <View
            style={{
                alignSelf: 'center',
                width: '65%',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 61,
                flex: 1,
                marginVertical: 30,
            }}
        >{socials.map(social => {
            return <View
                key={social.type}
                style={{
                    height: 61,
                    width: 61,
                    borderRadius: 35,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center'
                    // marginRight: 30
                }}>
                {social.icon}
            </View>
        })}
        </View>
    }

    /**
     * TAB VIEW RENDER CODE
     */
    renderScene = ({ route, jumpTo }) => {
        return <View style={{ flex: 1 }}>{this.buildFormInputs(route.key)}</View>

    };

    renderTabBar = props => (
        <TabBar
            tabStyle={{
                paddingTop: 0,
                justifyContent: 'center',
            }}
            {...props}
            indicatorStyle={{
                backgroundColor: 'rgba(0, 173, 239, 1)',
            }}
            style={{ backgroundColor: '#fff', marginVertical: 7, elevation: 0, paddingHorizontal: 11 }}

            renderLabel={({ route, focused }) => <Text style={{
                fontSize: 14,
                color: 'rgba(53, 93, 155, 1)',
                fontWeight: focused ? 'bold' : 'normal',
                textAlign: 'center'
            }}
            >{route.title} </Text>

            }
        />
    );

    renderFieldsComponent = () => {

        let index = 0
        index = this.state.buttonIndex

        let element = <></>

        switch (index) {
            case 0:
                element = <UserSignUp countryCodes={this.state.countryCodes} deviceCountryCode={this.state.deviceCountryCode} />
                break
            case 1:
                element = <OrganizationSignUp countryCodes={this.state.countryCodes} deviceCountryCode={this.state.deviceCountryCode} />
                break
            case 2:
                element = <VendorSignUp countryCodes={this.state.countryCodes} deviceCountryCode={this.state.deviceCountryCode} />
                break
            default:
                element = <></>
        }
        return element
    }


    render() {
        const { tabRoutes, tabIndex } = this.state
        if (this.state.countryCodes.length < 1) {
            return <></>
        }

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
        ><KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            style={styles.container}
        >
                <View style={{
                    alignSelf: 'center'
                }}>
                    <SvgIcons.AppLogo />
                </View>
                <Text
                    style={{
                        fontFamily: 'BellMT',
                        marginTop: "auto",
                        marginBottom: 15,
                        fontSize: 23,
                        color: 'rgba(53, 93, 155, 1)',
                        alignSelf: 'center',
                        fontWeight: 'bold'
                    }}
                >SIGNUP</Text>

                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 15,
                    marginHorizontal: 25,
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.2,
                            shadowRadius: 1
                        },
                        android: {
                            elevation: 1
                        }
                    }),
                }}>
                    <View style={{ height: 8, padding: 0 }}></View>
                    <ButtonGroup
                        buttons={[
                            'User',
                            'Organization',
                            'Vendor'
                        ]}
                        selectedIndex={this.state.buttonIndex}
                        onPress={(value) => {
                            this.setState({ buttonIndex: value })
                        }}
                        buttonStyle={{
                            alignContent: 'center', borderRadius: 7, backgroundColor: 'white',
                            borderColor: '#355D9B', borderWidth: 1,
                        }}
                        textStyle={{
                            textAlign: 'center', color: '#355D9B', fontFamily: 'Mulish-Bold',
                            fontSize: moderateScale(12),
                        }}

                        innerBorderStyle={{ color: 'white', width: 5 }}
                        containerStyle={{ marginBottom: 0, height: 40, borderColor: 'white' }}

                        selectedButtonStyle={{ backgroundColor: "#00ADEF", borderColor: '#00ADEF', }}
                        selectedTextStyle={{ fontFamily: 'Mulish-Bold', fontSize: moderateScale(13) }}
                    />

                    {this.renderFieldsComponent()}

                    {/* <AppButton
                    style={{
                        marginTop: 22
                    }}
                    title="SIGNUP"
                    clicked={() => this.submit(this.state.tabIndex)}
                    disabled={!this.checkSubmitButtonValid()}
                /> */}
                </View>
                {/* <View style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 30,
                flexDirection: 'row',
                marginHorizontal: 50
            }}>
                <View
                    style={styles.horizontalLine}
                />
                <Text style={{
                    marginHorizontal: 4,
                    color: 'rgba(53, 93, 155, 1)'
                }}>OR</Text>
                <View
                    style={styles.horizontalLine}
                />
            </View>
            {this.renderSocialIcons()} */}
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    alignSelf: 'center',
                    marginVertical: 25
                }}>
                    <Text style={{ color: 'rgba(53, 93, 155, 1)' }}>Already have account?</Text>
                    <Pressable
                        onPress={() => this.props.navigation.navigate("LoginScreen")}
                    ><Text style={{
                        marginLeft: moderateScale(3), color: 'rgba(0, 173, 239, 1)'
                    }}>Login</Text></Pressable>
                </View>
            </KeyboardAwareScrollView>
        </ImageBackground>
    }
}

const deviceWidth = Dimensions.get("window").width

const styles = StyleSheet.create<Styles>({
    container: {
        flexGrow: 1,
        //backgroundColor: '#FFFBFB',
    },
    horizontalLine: {
        height: 1,
        backgroundColor: 'rgba(53, 93, 155, 1)',
        flex: 1
    }
})

export default SignUpScreen