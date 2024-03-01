import * as React from 'react'
import {
    View,
    Animated,
    Pressable,
    PanResponder,
    StyleSheet,
    Platform,
    Text as RNText,
    Image
} from 'react-native'

import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';

import Text from '../../UI/AppText'
import { moderateScale, verticalScale } from '../../../utils/scalingUnits';

import * as SvgIcons from '../../../assets/svg-icons'
import moment from 'moment';

const draftsEntry = (props) => {
    const { data, deleteDraft, onEditDraft } = props

    const [animating, setAnimating] = React.useState(false)
    const swipeableRef = React.useRef()
    const animateHeight = React.useRef(new Animated.Value(1))

    const deleteDraftAnimation = () => {
        setAnimating(true)

        Animated.timing(animateHeight.current, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start(() => {
            deleteDraft(data)
        });
    }

    const renderLeftIcon = (progress, dragX) => {

        return (
            <Animated.View style={{
                backgroundColor: 'transparent', width: "20%",
                paddingLeft: moderateScale(20),
                justifyContent: 'center'
            }}>
                <Pressable
                    onPress={() => {
                        onEditDraft()
                        swipeableRef.current?.close();
                    }}
                    style={{
                        backgroundColor: '#1AA54D',
                        width: verticalScale(33),
                        height: verticalScale(33),
                        borderRadius: verticalScale(20),
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <SvgIcons.EditIcon
                        style={{
                            transform: [{ scale: 0.8 }]
                        }}
                        stroke="#fff"
                    />
                </Pressable>
            </Animated.View>
        )
    }

    const renderRightIcon = (progress, dragX) => {

        return (
            <Animated.View style={{
                backgroundColor: 'transparent',
                // paddingRight: moderateScale(20),
                width: "20%",
                // alignItems: 'center',
                justifyContent: 'center',
                alignItems: 'flex-end',
                paddingRight: moderateScale(20),
            }}>
                <Pressable
                    onPress={() => {
                        deleteDraftAnimation()
                    }}
                    style={{
                        backgroundColor: '#E14F50',
                        width: verticalScale(33),
                        height: verticalScale(33),
                        borderRadius: verticalScale(20),
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <SvgIcons.DeleteIcon
                        style={{
                            transform: [{ scale: 0.95 }]
                        }}
                        stroke="#fff"
                    />
                </Pressable>
            </Animated.View>
        )
    }

    if (animating) {
        const scale = animateHeight.current.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        })

        const translateY = animateHeight.current.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, 0]
        })

        const height = animateHeight.current.interpolate({
            inputRange: [0, 1],
            outputRange: [0, verticalScale(73)]
        })

        return <Animated.View
            style={{
                height,
            }}
        >

        </Animated.View>
    }

    return <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightIcon}
        renderLeftActions={renderLeftIcon}
        rightThreshold={-20}
        onSwipeableRightOpen={(direction) => {
            //deleteDraftAnimation()
        }}
        onSwipeableLeftOpen={(direction) => {
            // onEditDraft()
            // swipeableRef.current?.close();
        }}
    >
        <Pressable
            onLongPress={() => {
                onEditDraft()
                swipeableRef.current?.close();
            }}
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                minHeight: verticalScale(70),
                marginBottom: verticalScale(7),
                borderRadius: verticalScale(10),
                alignItems: 'center',
                paddingHorizontal: moderateScale(20),
                marginHorizontal: moderateScale(20),
                backgroundColor: 'white',
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
            }}
        >
            <View>
                <RNText style={{
                    color: '#355D9B',
                    fontSize: verticalScale(13),
                    fontFamily: 'Mulish-Bold'
                }}>
                    {data?.eventName}
                </RNText>
                <View style={{ height: 5 }}></View>
                <Text style={{
                    color: '#88879C',
                    fontSize: verticalScale(10)
                }}>
                    {data?.selectedDate !== undefined && moment(data?.selectedDate).format("hh:mm A [-] DD MMM[,] YYYY")
                    }
                </Text>
            </View>
            <Pressable
                onPress={() => {
                    onEditDraft()
                    swipeableRef.current?.close();
                }}
            >
                {/* <SvgIcons.GoButton
                    style={{
                        transform: [{ scale: 0.9 }]
                    }}
                /> */}
                <Image style={{ height: 22, width: 22 }} source={require("../../../assets/images/open-eye.png")} />
            </Pressable>
        </Pressable>
    </Swipeable>
}

const styles = StyleSheet.create({

})

export default draftsEntry