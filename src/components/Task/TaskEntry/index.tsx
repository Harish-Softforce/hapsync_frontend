import * as React from 'react';
import {
    View,
    StyleSheet,
    Pressable,
    Animated,
    Platform,
    Image,
} from 'react-native';

import Text from '../../UI/AppText';
import * as SvgIcons from '../../../assets/svg-icons';

import { moderateScale, verticalScale } from '../../../utils/scalingUnits';
import { useNavigation } from '@react-navigation/core';
import moment from 'moment';
import { Swipeable } from 'react-native-gesture-handler';
import { deleteActivity } from '../../../store/actionCreators';

const taskEntry = props => {
    const { status, name, activityTypeName, date, id } = props.data;

    const navigation = useNavigation();

    const renderRightIcon = () => {

        return (
            <Animated.View
                style={{
                    backgroundColor: 'transparent',
                    // paddingRight: moderateScale(20),
                    width: '20%',
                    // alignItems: 'center',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    paddingRight: moderateScale(20),
                }}>
                <Pressable
                    onPress={() => {
                        deleteActivity(id, props.eventId);
                    }}
                    style={{
                        backgroundColor: '#E14F50',
                        width: verticalScale(33),
                        height: verticalScale(33),
                        borderRadius: verticalScale(20),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <SvgIcons.DeleteIcon
                        style={{
                            transform: [{ scale: 0.95 }],
                        }}
                        stroke="#fff"
                    />
                </Pressable>
            </Animated.View>
        );
    };

    return (
        <Swipeable
            renderRightActions={props.editAccess ? renderRightIcon : undefined}
            rightThreshold={-20}
            onSwipeableRightOpen={() => { }}
            onSwipeableLeftOpen={() => { }}>
            <Pressable
                onLongPress={() =>
                    navigation.navigate('TaskTabs', {
                        data: props.data,
                    })
                }
                style={styles.container}>
                <View
                    style={{
                        flex: 0.65,
                        marginRight:5
                    }}>
                    <Text style={[{ color: '#355D9B', fontFamily: 'Mulish-Bold' }]}>
                        {name}
                    </Text>
                    <Text
                        style={{
                            color: '#88879C',
                            marginVertical: verticalScale(3),
                            fontSize: verticalScale(10),
                        }}>
                        {activityTypeName}
                    </Text>
                    <Text
                        style={{
                            fontSize: verticalScale(10),
                            color: '#88879C',
                        }}>
                        {
                            //moment(date).format('DD MMM[,] YYYY [-] hh:mm A')
                            moment(date).format('DD MMM[,] YYYY')
                        }
                    </Text>
                </View>
                <Pressable
                    onPress={() => {
                        props.handleStatus(status, id);
                    }}
                    style={{

                        borderRadius: verticalScale(4),
                        borderWidth: 1,
                        borderColor:
                            status == 'COMPLETED'
                                ? '#1AA54D'
                                : '#EF7300',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10,
                        marginLeft: 10
                    }}>
                    <Text
                        style={{
                            fontSize: verticalScale(10),

                            color: status == 'COMPLETED' ? '#1AA54D' : '#EF7300',
                            fontFamily: 'Mulish-Bold',
                            textTransform: 'capitalize',
                        }}>
                        {status}

                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                        navigation.navigate('TaskTabs', {
                            data: props.data,
                        });
                    }}
                    style={{ marginLeft: 0, marginRight: 5 }}
                >
                    <Image
                        style={{ height: 24, width: 24, marginRight: 4 }}
                        source={require('../../../assets/images/open-eye.png')}
                    />
                    {/*  <SvgIcons.GoButton
            /> */}
                </Pressable>
            </Pressable>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        minHeight: verticalScale(65),
        borderRadius: verticalScale(6),
        marginBottom: verticalScale(8),
        flexDirection: 'row',
        // padding: verticalScale(8),
        alignItems: 'center',
        justifyContent: 'space-around',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1,
            },
            android: {
                elevation: 1,
            },
        }),
    },
});

export default taskEntry;
