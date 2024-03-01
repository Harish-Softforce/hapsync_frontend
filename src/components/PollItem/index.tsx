import * as React from 'react'
import {
    View, Text,
    Pressable,
    ViewStyle, StyleSheet, Platform, Alert
} from 'react-native'

import { moderateScale } from '../../utils/scalingUnits'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { deleteDateforCustomEvent } from '../../store/actionCreators'

type Styles = {
    container: ViewStyle
}

type PollItemProps = {
    containerStyle: ViewStyle
}

const pollItem = (props: PollItemProps) => {
    const { containerStyle, data, handleTimingVote, uid } = props

    const calculatePollNo = (data: Array) => {
        if (Array.isArray(data)) {
            let trueNo = data.filter((each) => each.vote == "LIKE").length
            let falseNo = data.filter((each) => each.vote == "DISLIKE").length
            return {
                trueNo,
                falseNo
            }
        } else {
            return {
                trueNo: 0,
                falseNo: 0
            }
        }
    }

    const prevStatus = () => {
        let a = null
        if (data.polling) {
            data.polling.map(each => {
                if (each.userId == uid) {
                    a = each.vote
                }
            })
        }
        return a
    }

    return <View style={[
        styles.container, containerStyle, handleTimingVote ? {} : { height: moderateScale(117) }
    ]}>
        <View style={{ flex: handleTimingVote ? 0.66 : 1, alignItems: 'center', justifyContent: 'center' }}>
            {props?.userEditAccess && <Pressable
                onPress={() => {
                    //alert(data.id)
                    Alert.alert('Alert!', 'Are you sure you want to remove?', [
                        {
                            text: 'Cancel',
                            onPress: () => { },
                            style: 'cancel',
                        },
                        {
                            text: 'Yes',
                            onPress: () => {
                                deleteDateforCustomEvent(data.id,props.eventId)
                            },
                            style:'destructive'
                        },
                    ])
                }}
                style={{
                    padding: moderateScale(5),
                    alignItems: 'center',
                    position:'absolute',
                    top:0,
                    right:0
                }}>
                <MaterialIcons
                name='auto-delete'
                style={{
                    color: '#E14F50',
                    // '#355D9B',
                    fontSize: moderateScale(24),
                }}
                />
            </Pressable>}
            {data?.time && <Text style={{ color: '#00ADEF',marginTop:moderateScale(10) }}>{data?.time?.startTime !== undefined && moment(new Date(data.time.startTime)).format("hh:mm A")} - {moment(new Date(data.time.endTime)).format("hh:mm A")}</Text>}
            <Text style={{ fontSize: 32, color: '#88879C', fontWeight: 'bold' }}>{data?.date !== undefined && moment(new Date(data.date)).format("DD")}</Text>
            <Text style={{ fontSize: 9, color: '#88879C', fontWeight: 'bold' }}>
                {data?.date !== undefined && moment(new Date(data.date)).format("MMM[,] YYYY")}</Text>

        </View>
        {handleTimingVote && <View style={{
            flex: 0.33,
            flexDirection: 'row',
            borderTopWidth: 0.5, borderTopColor: '#355D9B'
        }}>
            <Pressable
                onPress={() => {
                    if (handleTimingVote) {
                        if (prevStatus() == "PENDING") {
                            handleTimingVote(data.id, "DISLIKE")
                        } else if (prevStatus() == "DISLIKE") {
                            handleTimingVote(data.id, "PENDING")
                        }
                    }
                }}
                style={{
                    flex: 1,
                    borderRightColor: '#355D9B',
                    borderRightWidth: 0.5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // transform: [{rotate}]
                }}>
                <View style={{ transform: [{ rotateY: '180deg' }], }}>
                    <MaterialCommunityIcons
                        name="thumb-down"
                        style={{
                            color: prevStatus() == "LIKE" ? '#C0C0C0' : '#E14F50',

                            fontSize: moderateScale(18)
                        }}
                    />
                </View>
                <Text style={{
                    color: '#E14F50',
                    fontFamily: 'Mulish-ExtraBold'
                }}>{calculatePollNo(data.polling).falseNo}</Text>
            </Pressable>
            <Pressable
                onPress={() => {
                    if (handleTimingVote) {
                        if (prevStatus() == "PENDING") {
                            handleTimingVote(data.id, "LIKE")
                        } else if (prevStatus() == "LIKE") {
                            handleTimingVote(data.id, "PENDING")
                        }
                    }
                }}
                style={{
                    flex: 1, justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <MaterialCommunityIcons
                    name="thumb-up"
                    style={{
                        color: prevStatus() == "DISLIKE" ? '#C0C0C0' : '#355D9B',
                        fontSize: moderateScale(18)
                    }}
                />
                <Text style={{
                    color: '#355D9B',
                    fontFamily: 'Mulish-ExtraBold'
                }}>{calculatePollNo(data.polling).trueNo}</Text>
            </Pressable>
        </View>
        }
    </View>
}

const styles = StyleSheet.create<Styles>({
    container: {
        height: moderateScale(176),
        backgroundColor: '#fff',
        flex: 1,
        borderRadius: moderateScale(10),
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
    }
})

export default pollItem;