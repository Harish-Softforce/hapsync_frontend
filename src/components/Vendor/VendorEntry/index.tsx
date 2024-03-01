import { useNavigation } from '@react-navigation/core'
import * as React from 'react'
import {
    View,
    Image,
    StyleSheet,
    Pressable
} from 'react-native'
import { verticalScale } from '../../../utils/scalingUnits'

import Text from '../../UI/AppText'

const entry = props => {
    const navigation = useNavigation()
    const { data } = props

    const renderStatus = () => {
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
                marginTop: verticalScale(20),
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

    return <Pressable
        onPress={() => navigation.navigate("VendorDetails", {
            data
        })}
        style={styles.container}
    >
        <View style={{ flex: 0.45 }}>
            <Image
                style={{
                    flex: 1,
                    width: '100%',
                    borderRadius: verticalScale(15),
                }}
                source={require("../../../assets/images/splashscreen.png")}
            />
        </View>
        <View style={{
            flex: 0.55,
            justifyContent: 'center',
            marginLeft: verticalScale(20)
        }}>
            <Text style={{
                color: '#355D9B',
                fontFamily: 'MUlish-Bold',
                fontSize: verticalScale(13),
                marginBottom: verticalScale(3)
            }}>
                {data?.name}
            </Text>
            <Text style={{
                color: '#88879C',
                fontFamily: 'MUlish-Bold',
                fontSize: verticalScale(10)
            }}>
                At B-99 Citizen Point, Punagam, Mumbai-325480
            </Text>
            {renderStatus()}
        </View>
    </Pressable>
}

const styles = StyleSheet.create({
    container: {
        padding: verticalScale(20),
        backgroundColor: '#fff',
        elevation: 1,
        height: verticalScale(180),
        borderRadius: verticalScale(15),
        marginBottom: verticalScale(10),
        flexDirection: 'row'
    }
})

export default entry