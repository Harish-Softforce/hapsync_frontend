import { View, Text, ScrollView, Image, Pressable, ImageBackground, TextInput, Modal, KeyboardAvoidingView, Platform, StyleSheet, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import TopBar from '../../components/TopBar'
import { moderateScale, verticalScale } from '../../utils/scalingUnits'
import { useDispatch, useSelector } from 'react-redux'

import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Octicons from 'react-native-vector-icons/Octicons'

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Feather from 'react-native-vector-icons/Feather'

import validator from 'validator'
import ImageCropPicker from 'react-native-image-crop-picker'
import { v4 as uuidv4 } from 'uuid';
import { addUserToOrg, removeUserFromOrg, updateUser } from '../../store/actionCreators'
import AppText from '../../components/UI/AppText'
import AppInput from '../../components/UI/Input'
import AppButton from '../../components/UI/button'

export default function Account(props) {

    const { userData } = useSelector((state) => state.user)

    const [photo, setPhoto] = useState({
        value: {
            path: userData.imageUrl
        },
        errorMsg: "",
        inEditMode: false,
    })

    const [name, setName] = useState({
        label: 'name',
        value: userData.name,
        imgIcon: <MaterialCommunityIcons name="account" size={28} color="#00ADEF" />,
        errorMsg: "",
        inEditMode: false,
        props: {

        }
    })
    const [email, setEmail] = useState({
        label: "email",
        value: userData.email,
        imgIcon: <Ionicons name="ios-mail" size={28} color="#00ADEF" />,
        errorMsg: "",
        inEditMode: false,
        props: {

        }
    })

    const [phone, setPhone] = useState({
        label: "phone",
        value: userData.phone,
        imgIcon: <MaterialIcons name="call" size={28} color="#00ADEF" />,
        errorMsg: "",
        inEditMode: false,
        props: {
            keyboardType: 'numeric',
            returnKeyType:'done',
            onSubmitEditing:Keyboard.dismiss
        }
    })
    const [org, setOrg] = useState({
        value: "Associated Organizations",
        associatedOrgs: userData.userOrgAssocList || [],
        imgIcon: <SimpleLineIcons name="globe" size={28} color="#00ADEF" />,
        errorMsg: "",
        inEditMode: false
    })

    useEffect(() => {
        setPhoto({
            value: {
                path: userData.imageUrl
            },
            errorMsg: "",
            inEditMode: false,
        })
        setName({
            label: 'name',
            value: userData.name,
            imgIcon: <MaterialCommunityIcons name="account" size={28} color="#00ADEF" />,
            errorMsg: "",
            inEditMode: false,
            props: {

            }
        })
        setEmail({
            label: "email",
            value: userData.email,
            imgIcon: <Ionicons name="ios-mail" size={28} color="#00ADEF" />,
            errorMsg: "",
            inEditMode: false,
            props: {

            }
        })
        setPhone({
            label: "phone",
            value: userData.phone,
            imgIcon: <MaterialIcons name="call" size={28} color="#00ADEF" />,
            errorMsg: "",
            inEditMode: false,
            props: {
                keyboardType: 'numeric',
                returnKeyType:'done',
                onSubmitEditing:Keyboard.dismiss
            }
        })
    }, [userData])

    const [modalShow, setModalShow] = useState(false)
    const [orgkey, setOrgkey] = useState("")
    const [validkey, setValidkey] = useState(false)

    const renderModal = () => {

        return <Modal visible={modalShow} animationType="slide"
            transparent={true}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <Pressable
                    onPress={() => setModalShow(false)}
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        justifyContent: 'flex-end',
                    }}>
                    <Pressable
                        //onPress={()=>{}}
                        style={{
                            marginHorizontal: moderateScale(11),
                            backgroundColor: '#fff',
                            minHeight: verticalScale(100),
                            paddingVertical: verticalScale(11),
                            borderRadius: verticalScale(10)
                        }}>
                        <View style={{ paddingHorizontal: 20 }}>
                            <View style={{ alignSelf: 'center' }}>
                                <AppText style={{ color: '#355D9B' }}>Add Organization</AppText>
                            </View>
                            <View>
                                <AppInput
                                    onChangeText={(val) => {
                                        if (val !== "" && validator.isAlphanumeric(orgkey)) {
                                            setValidkey(true)
                                        } else {
                                            setValidkey(false)
                                        }
                                        setOrgkey(val)
                                    }}
                                    value={orgkey}
                                    label={"Enter Organization key"}
                                    placeholder="Enter Organization key"
                                    labelStyle={styles.heading}
                                    style={{ fontFamily: 'Mulish-Light' }}
                                />
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginTop: moderateScale(12),
                            marginHorizontal: moderateScale(11)
                        }}>
                            <AppButton
                                clicked={() => setModalShow(false)}
                                title="Cancel"
                                style={[styles.button, {
                                    backgroundColor: '#00ADEF',
                                    marginRight: verticalScale(7)
                                }]}
                            />
                            <AppButton
                                clicked={() => {
                                    if (validkey) {
                                        setModalShow(false)
                                        if (orgkey) {

                                            let obj = {
                                                "orgId": orgkey,
                                                "userId": userData.id,
                                            }
                                            addUserToOrg(obj)
                                        }
                                        setOrgkey("")
                                        setValidkey(false)
                                    }
                                }}
                                title="OK"
                                style={[{ backgroundColor: validkey ? '#355D9B' : 'grey' }, styles.button]}
                            />
                        </View>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    }

    const enableEditMode = (l) => {
        switch (l.label) {
            case "name":
                setName({
                    ...name,
                    inEditMode: true
                })
                break
            case "email":
                setEmail({
                    ...email,
                    inEditMode: true
                })
                break
            case "phone": null
                break
            default:
        }
    }

    const editValue = (l, val) => {
        switch (l.label) {
            case "name":
                if (!validator.isAlphanumeric(val)) {
                    setName({
                        ...name,
                        errorMsg: "Invalid Username",
                        value: val
                    })
                } else {
                    setName({
                        ...name,
                        errorMsg: "",
                        value: val
                    })
                }
                break
            case "email":
                if (validator.isEmail(val)) {
                    setEmail({
                        ...email,
                        value: val,
                        errorMsg: "",
                    })
                } else {
                    setEmail({
                        ...email,
                        value: val,
                        errorMsg: "Invalid Email"
                    })
                }
                break
            case "phone":
                /* if (val.length == 10 && validator.isMobilePhone(val, ['en-US', 'en-IN'])) {
                    setPhone({
                        ...phone,
                        value: val,
                        errorMsg: "",
                    })
                } else {
                    setPhone({
                        ...phone,
                        value: val,
                        errorMsg: "Invalid Phone"
                    })
                } */
                break
            default:
        }
    }


    const renderPersonalDetails = () => {
        let list = [name, email, phone]

        return <>
            <View style={{ marginTop: 30 }}>
                <View style={{
                    alignSelf: 'center',
                    alignItems: 'center',
                    //marginVertical: 20,
                    zIndex: 1
                }}>
                    <Image
                        source={
                            photo.value.path
                                ? { uri: photo.value.path }
                                : require("../../assets/images/splashscreen.png")
                        }
                        style={{
                            height: verticalScale(126),
                            width: verticalScale(126),
                            // marginBottom: verticalScale(10),
                            borderRadius: verticalScale(80),


                        }} >
                    </Image>
                    <View style={{ marginTop: 100, zIndex: 1, justifyContent: 'flex-end', position: "absolute" }}>
                        <Pressable
                            onPress={async () => {
                                await ImageCropPicker.openPicker({
                                    cropping: true,
                                    freeStyleCropEnabled: true,
                                    mediaType: 'photo',
                                }).then(img => {
                                    console.log(img)
                                    let obj = { ...img }
                                    obj.fileName = uuidv4()
                                    setPhoto({
                                        ...photo,
                                        value: obj,
                                        inEditMode: true
                                    })
                                }).catch(e => {
                                    console.log(e)
                                })
                            }}
                            style={{ padding:20, justifyContent: 'center', alignItems: 'center',  }}>

                            <FontAwesome5 name="camera" size={22} color="white" />
                        </Pressable>
                    </View>

                </View>

                <View style={{
                    backgroundColor: '#fff',
                    minHeight: verticalScale(250),
                    borderRadius: verticalScale(15),
                    padding: moderateScale(25),
                    justifyContent: 'space-around',
                    position: 'relative',
                    width: "100%",
                    marginTop:-70,
                    zIndex:0
                }}>

                    <View style={{ marginTop: 80 }}>
                        {
                            list.map((l, i) => (
                                <View key={i}>
                                    <Pressable
                                        onLongPress={() => {
                                            enableEditMode(l)
                                        }}
                                        style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}
                                    >
                                        <View>
                                            {l.imgIcon}
                                        </View>
                                        <View style={{ marginLeft: 15, flex: 1 }}>
                                            {l.inEditMode
                                                ? <>
                                                    <TextInput
                                                        //multiline={true}
                                                        {...l.props}
                                                        value={l.value}
                                                        onChangeText={(val) => {
                                                            editValue(l, val)
                                                        }}
                                                    />
                                                </>
                                                : <Text
                                                    style={{
                                                        fontFamily: 'Mulish',
                                                        color: "#355D9B",
                                                        fontSize: 15
                                                    }}
                                                >{l.value}</Text>
                                            }
                                        </View>
                                    </Pressable>
                                    <View
                                        style={{
                                            borderBottomColor: "#00ADEF", opacity: 0.5, borderBottomWidth: 1,
                                        }}
                                    ></View>
                                    {l.errorMsg != "" &&
                                        <Text style={{ color: "red", alignSelf: 'flex-end', marginBottom: 7 }}>{l.errorMsg}</Text>
                                    }
                                </View>
                            ))
                        }
                        {userData?.role == "USER" &&
                            <>
                                <View
                                    style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}
                                >
                                    <View>
                                        {<SimpleLineIcons name="globe" size={28} color="#00ADEF" />}
                                    </View>
                                    <View style={{ marginLeft: 15, flex: 1 }}>
                                        <Text
                                            style={{
                                                fontFamily: 'Mulish',
                                                color: "#355D9B",
                                                fontSize: 15
                                            }}
                                        >Associated Organizations</Text>
                                    </View>
                                    <Pressable
                                        style={{
                                            marginRight: -moderateScale(4)
                                        }}
                                        onPress={() => {
                                            setModalShow(true)
                                        }}
                                    >
                                        <Feather
                                            name="plus"
                                            style={{
                                                color: '#00ADEF',
                                                fontSize: verticalScale(28)
                                            }}
                                        />
                                    </Pressable>
                                </View>
                                <View>
                                    {userData.userOrgAssocList?.map((l, i) => (
                                        <View key={i}>
                                            <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                                                <View style={{ marginLeft: 15, flex: 1 }}>
                                                    <Text
                                                        style={{
                                                            fontFamily: 'Mulish',
                                                            color: "#355D9B",
                                                            fontSize: 15
                                                        }}
                                                    >{l.orgName}</Text>
                                                </View>
                                                <View>
                                                    <Pressable
                                                        style={{
                                                            marginLeft: 'auto'
                                                        }}
                                                        onPress={() => {
                                                            removeUserFromOrg(l.id)
                                                        }}>
                                                        <MaterialCommunityIcons
                                                            name="minus"
                                                            style={{
                                                                color: '#E14F50',
                                                                fontSize: moderateScale(23),
                                                            }}
                                                        />
                                                    </Pressable>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    borderBottomColor: "grey", opacity: 0.5, borderBottomWidth: 1, paddingHorizontal: 7
                                                }}
                                            ></View>
                                        </View>
                                    ))}
                                </View>
                                {renderModal()}

                            </>
                        }
                        {userData?.role == "VENDOR" &&
                            <>
                                <View
                                    style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}
                                >
                                    <View>
                                        {<Octicons name="list-unordered" size={25} color="#00ADEF" />}
                                    </View>
                                    <View style={{ marginLeft: 15, flex: 1 }}>
                                        <Text
                                            style={{
                                                fontFamily: 'Mulish',
                                                color: "#355D9B",
                                                fontSize: 15
                                            }}
                                        >Vendor Types</Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: "#00ADEF", opacity: 0.5, borderBottomWidth: 1, paddingHorizontal: 7
                                    }}
                                ></View>

                                <View>
                                    {userData.vendorActivityTypes?.map((l, i) => (
                                        <View key={i}>
                                            <View style={{ flexDirection: 'row', padding:13, alignItems: 'center' }}>
                                                <View style={{ marginLeft: 15, flex: 1 }}>
                                                    <Text
                                                        style={{
                                                            fontFamily: 'Mulish',
                                                            color: "#355D9B",
                                                            fontSize: 15
                                                        }}
                                                        
                                                    >{l.activityTypeName}</Text>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    borderBottomColor: "#00ADEF", opacity: 0.5, borderBottomWidth: 1, paddingHorizontal: 0
                                                }}
                                            ></View>
                                        </View>
                                    ))}
                                </View>
                            </>
                        }
                    </View>
                </View>
            </View>
        </>
    }

    const renderRightHeader = () => {
        const list = [photo, name, email, phone]
        let valid = true
        let edited = false
        list.map(i => {
            if (i.errorMsg != "") {
                valid = false
            }
            if (i.inEditMode) {
                edited = true
            }
        })
        return <>
            {edited && valid && <Pressable
                onPress={() => {
                    let obj = {
                        ...userData,
                        userName: name.value,
                        email: email.value,
                        phone: phone.value,
                    }
                    updateUser(obj, photo.value, true,null)
                }}
            >
                <Feather
                    name="check"
                    style={{
                        fontSize: verticalScale(27),
                        color: '#355D9B'
                    }}
                />
            </Pressable>
            }
        </>
    }

    return (
        <ImageBackground
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
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                keyboardShouldPersistTaps='always'
            >
                <TopBar
                    style={{ backgroundColor: 'transparent' }}
                    title="Account"
                    rightComponent={renderRightHeader()}
                />
                <View style={{
                    flex: 1,
                    marginHorizontal: moderateScale(20),
                    paddingBottom: verticalScale(40)
                }}>
                    {renderPersonalDetails()}
                </View>
            </ScrollView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    heading: {
        fontSize: moderateScale(16),
        marginVertical: verticalScale(6),
        color: '#355D9B',
        fontFamily: 'Mulish-Bold',
    },
    value: {
        color: '#88879C',
        fontFamily: 'Mulish',
    },
    section: {
        backgroundColor: '#fff',
        padding: verticalScale(17),
        borderRadius: verticalScale(15),
        marginBottom: verticalScale(15),
        elevation: 1
    },
    button: {
        height: verticalScale(40),
        flex: 1
    }
})