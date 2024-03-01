import { useNavigation } from '@react-navigation/core'
import * as React from 'react'
import {
    View,
    Image,
    StyleSheet,
    Pressable
} from 'react-native'
import { moderateScale, verticalScale } from '../../../utils/scalingUnits'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import * as SvgIcons from '../../../assets/svg-icons'
import Text from '../../UI/AppText'

const entry = props => {
    const navigation = useNavigation()
    const { data } = props

    const [checked, setChecked] = React.useState(false)

    const renderStatus = (data) => {
        const status = data?.status

        let colors = {
            textColor: 'grey',
            bgColor: '#fff'
        }

        if (status == "Evaluating") {
            colors = {
                textColor: '#1AA54D',
                bgColor: 'rgba(26, 165, 77, 0.15)'
            }
        } else if (status == "Hired") {
            colors = {
                textColor: 'rgba(37, 150, 215, 1)',
                bgColor: 'rgba(37, 150, 215, 0.15)'
            }
        } else if (status == "Discarded") {
            colors = {
                textColor: 'rgba(239, 115, 0, 1)',
                bgColor: 'rgba(239, 115, 0, 0.15)'
            }
        } else if (status == "Not Available") {
            colors = {
                textColor: 'rgba(227, 0, 0, 1)',
                bgColor: 'rgba(227, 0, 0, 0.15)'
            }
        }

        return <View
            style={{
                backgroundColor: colors.bgColor,
                height: verticalScale(20),
                width: verticalScale(80),
                borderRadius: verticalScale(4),
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Text style={{
                color: colors.textColor,
                fontSize: verticalScale(10)
            }}>{status}</Text>
        </View>
    }

    const renderUsers = () => {
        const users = data?.users;

        if (users?.length > 0) {
            return <View
                style={{
                    borderTopColor: '#88879C1A',
                    borderWidth: verticalScale(1),
                    borderColor: 'white',
                    marginTop: verticalScale(15),
                    paddingTop: verticalScale(15),
                }}
            >
                {
                    users?.map((user, index) => {
                        return <Pressable
                            onPress={() => navigation.navigate("VendorDetails", {
                                data: user
                            })}
                            key={index}
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
                            <View style={{
                                marginLeft: 'auto',
                            }}>
                                {renderStatus(user)}
                            </View>
                        </Pressable>
                    })
                }
            </View>

        }

        return <View />
    }


    return <View
        style={styles.container}
    >
        <View

            style={{
                flexDirection: 'row'
            }}
        >

            <View style={{
                flex: 0.2,
                justifyContent: 'center',
            }}>
                <View style={{
                    backgroundColor: '#00ADEF',
                    height: verticalScale(45),
                    width: verticalScale(45),
                    borderRadius: verticalScale(47),
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {data?.icon}
                </View>
            </View>
            <View style={{
                flex: 0.65,
                justifyContent: 'center',
            }}
            >
                <Text style={{
                    color: '#355D9B',
                    fontFamily: 'Mulish-Bold'
                }}>
                    {data?.title}
                </Text>
                <Text style={{
                    fontSize: verticalScale(10),
                    color: '#9F9FB9'
                }}>Browse vendors</Text>
            </View>
            <Pressable
            onPress={() => {
                setChecked(!checked)
            }}
            style={{
                flex: 0.15,
                justifyContent: 'center',
                alignItems: 'flex-end'
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
        {renderUsers()}
    </View>
}

const styles = StyleSheet.create({
    container: {
        padding: verticalScale(20),
        backgroundColor: '#fff',
        elevation: 1,
        minHeight: verticalScale(80),
        borderRadius: verticalScale(15),
        marginBottom: verticalScale(10),
    }
})

export default entry