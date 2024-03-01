import * as React from 'react'
import {
    View,
    ImageBackground,
    ScrollView, StyleSheet,
    Dimensions,
    Pressable,
    Switch,
    Text,
    ActivityIndicator,
    Platform,
    Linking,
    Keyboard
} from 'react-native'

import AppText from '../../../components/UI/AppText'
import TopBar from '../../../components/TopBar'
import { moderateScale, verticalScale } from '../../../utils/scalingUnits'

import * as SvgIcons from '../../../assets/svg-icons'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

import Carousel from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';
import { clearVendorAlbum, getVendorAlbum, updateActivityVendor } from '../../../store/actionCreators'
import { connect } from 'react-redux'

import { FlatList, TextInput } from 'react-native-gesture-handler'
import validator from 'validator';
import { Button, Image } from 'react-native-elements'
import { showLocation } from 'react-native-map-link'

class VendorDetails extends React.Component {
    state = {
        status: this.props.route.params?.data.status,
        statusEdited: false,
        budget: this.props.route.params?.data.budget,
        budgetEdited: false,
        budgetErrorMsg: "",
    }

    componentDidMount(): void {
        let data = this.props.currentTask?.vendors.find(i => i.id == this.props.route.params?.data.id)
        if (data) {
            this.props.navigation.setParams({
                data: data
            })
            getVendorAlbum(data.userId)
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.currentTask.vendors !== this.props.currentTask.vendors) {
            let data = this.props.currentTask.vendors.find(i => i.id == this.props.route.params?.data.id)
            if (data) {
                this.props.navigation.setParams({
                    data: data
                })

            }
        }
    }

    componentWillUnmount() {
        clearVendorAlbum()
    }


    renderRightHeaderComp = () => {
        let edited = false
        if (this.state.statusEdited || this.state.budgetEdited) {
            edited = true
        }

        return <>{edited && <Pressable
            onPress={() => {

                if (validator.isNumeric(String(this.state.budget))) {
                    let obj = {
                        eventId:this.props.currentEvent.id,
                        budget: this.state.budget,
                        activityId: this.props.currentTask.id,
                        status: this.state.status,
                        id: this.props.route.params?.data.id,
                        vendorId: this.props.route.params?.data.vendorId,
                        vendorRank: this.props.route.params?.data.vendorRank
                    }
                    updateActivityVendor(obj, this.props.currentEvent.id)
                    this.setState({ budgetErrorMsg: "", statusEdited: false, budgetEdited: false, })
                } else {
                    this.setState({ budgetErrorMsg: "Please Enter Valid Amount" })
                }

            }}
        >
            <MaterialIcons
                name="check"
                style={{
                    fontSize: verticalScale(26),
                    color: '#355D9B'
                }}
            />
        </Pressable>}
        </>
    }

    renderStatusCarousel = () => {
        //const data = this.props.route.params?.data

        const entries = [
            {
                title: 'EVALUATING',
                icon: (color) => <Feather
                    name="clock"
                    style={{ fontSize: 22, color }}
                />
            },
            {
                title: 'HIRED',
                icon: (color) => <SvgIcons.AssignedIcon
                    fill={color}
                    style={{
                        transform: [{ scale: moderateScale(0.85) }],
                        marginLeft: moderateScale(4)
                    }}
                />
            },
            {
                title: 'NOTAVAILABLE',
                icon: (color) => <MaterialCommunityIcons
                    name="calendar-blank-outline"
                    style={{ fontSize: 22, color }}
                />
            },
            {
                title: 'REJECTED',
                icon: (color) => <SvgIcons.UnassignedIcon
                    fill={color}
                    style={{
                        transform: [{ scale: moderateScale(0.85) }],
                        marginLeft: moderateScale(4)
                    }}
                />
            },
        ]

        return <View style={{
            marginTop: verticalScale(5),
            marginBottom: verticalScale(14)
        }}><Carousel
                // ref={(c) => { this._carousel = c; }}
                data={entries}
                activeSlideAlignment="start"
                renderItem={({ item }) => {
                    let match = this.state.status == item.title

                    return <Pressable
                        onPress={() => {
                            if (this.props.currentEvent.taskAccess) {
                                this.setState({ status: item.title, statusEdited: true })
                            }
                        }}
                    ><LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        colors={match ? ['#00ADEF', '#355D9B'] : ['#fff', '#fff']}
                        style={{
                            height: verticalScale(35),
                            borderRadius: verticalScale(5),
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: '#355D9B',
                            borderWidth: match ? 0 : verticalScale(1),
                            flexDirection: 'row'
                        }}>
                            {item.icon(match ? "#fff" : '#355D9B')}
                            <AppText style={{
                                color: match ? '#fff' : '#355D9B',
                                marginLeft: moderateScale(6)
                            }}>
                                {item.title}
                            </AppText>
                        </LinearGradient>
                    </Pressable>
                }}
                sliderWidth={deviceWidth}
                itemWidth={verticalScale(140)}
            />
        </View>
    }

    render() {
        const data = this.props.route.params?.data
        let imageList = this.props.vendorAlbum?.slice(0, 4)

        return <ImageBackground
            source={require("../../../assets/images/blurBG.png")}
            resizeMode="cover"
            imageStyle={{
                width: "100%",
                height: "100%"
            }}
            style={{
                flex: 1
            }}
        >
            <TopBar
                style={{ backgroundColor: 'transparent' }}
                title="Vendor Details"
                rightComponent={this.renderRightHeaderComp()}
            />
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                }}
            >
                <View style={{
                    marginHorizontal: moderateScale(15)
                }}>
                    <View style={styles.section}>
                        <AppText style={[styles.heading]}>Vendor Name</AppText>
                        <View style={styles.inputlikeWrapper}>
                            <AppText style={styles.greyText}>
                                {data?.name}
                            </AppText>
                        </View>
                    </View>
                    {this.renderStatusCarousel()}
                    <View style={styles.section}>
                        <AppText style={[styles.heading]}>Budget</AppText>
                        <View style={styles.inputlikeWrapper}>
                            {this.state.budgetEdited
                                ? <><TextInput
                                    onChangeText={(val) => {
                                        this.setState({ budget: val })
                                    }}
                                    style={{ fontSize: moderateScale(15), borderBottomWidth: 0.5 }}
                                    value={String(this.state.budget)}
                                    keyboardType='numeric'
                                    returnKeyType='done'
                                    onSubmitEditing={Keyboard.dismiss}
                                />
                                    <View>
                                        <Text style={{ color: 'red' }} >{this.state.budgetErrorMsg}</Text>
                                    </View></>
                                : <Pressable
                                    onLongPress={() => {
                                        if (this.props.currentEvent.taskAccess) {
                                            this.setState({ budgetEdited: true })
                                        }
                                    }}
                                >
                                    <AppText style={styles.greyText}>
                                        {data.budget}
                                    </AppText>
                                </Pressable>
                            }
                        </View>
                    </View>

                    <View style={{ flex: 1, margin: 5, paddingBottom: verticalScale(10), flexDirection: 'row', justifyContent: 'center' }}>
                        <Pressable
                            style={{
                                flex: 1, alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={() => {
                                showLocation({
                                    latitude: data.latitude,
                                    longitude: data.longitude,
                                    googlePlaceId: data.placeId,
                                    title: data?.address
                                }).catch(e => {
                                    console.log(e)
                                })
                            }}
                        >
                            <View>
                                <MaterialCommunityIcons name="directions" size={30} color="#00ADEF" />
                            </View>
                            {/* <Text style={{ color: '#00ADEF', fontFamily: 'Mulish-Bold' }}>Directions</Text> */}
                        </Pressable>
                        {data.website && <Pressable
                            onPress={() => {
                                if (data.website) {
                                    Linking.canOpenURL(data.website).then(supported => {
                                        if (supported) {
                                            Linking.openURL(data.website).catch(e => {
                                                alert("Unable to open link")
                                            })
                                        } else {
                                            console.log("Don't know how to open URI: " + data.website);
                                        }
                                    });
                                }
                            }}
                            style={{
                                flex: 1, alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >

                            <SimpleLineIcons name="globe" size={30} color="#00ADEF" />

                            {/* <Text style={{ color: '#00ADEF', fontFamily: "Mulish-Bold" }}>Website</Text> */}
                        </Pressable>
                        }
                        {data.phone && <Pressable
                            onPress={() => {
                                if (data.phone) {
                                    Linking.openURL(`tel:${data.phone}`).catch(e => {
                                        console.log(e)
                                    })
                                }
                            }}
                            style={{
                                flex: 1, alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <MaterialIcons name="call" size={30} color="#00ADEF" />
                            {/* <Text style={{ color: '#00ADEF', fontFamily: "Mulish-Bold" }}>Call</Text> */}
                        </Pressable>
                        }
                    </View>

                    <View style={styles.section}>
                        <AppText style={[styles.heading]}>Phone Number</AppText>
                        <View style={styles.inputlikeWrapper}>
                            <AppText style={styles.greyText}>
                                {data.phone}
                            </AppText>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <AppText style={[styles.heading]}>Photos</AppText>
                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                marginRight: moderateScale(-20),
                            }}
                        >
                            {imageList?.map((image, index) => {
                                return <Image
                                    key={index}
                                    style={{
                                        flex: 1,
                                        minHeight: verticalScale(70),
                                        marginRight: moderateScale(10),
                                        minWidth: '45%',
                                        marginTop: moderateScale(10),
                                        borderRadius: moderateScale(6)
                                    }}
                                    source={{ uri: image.filePath }}
                                />
                            })}
                        </View>
                        {this.props.vendorAlbum?.length > 1
                            && <Button
                                title={
                                    'See all '
                                }
                                containerStyle={{
                                    flex: 1,
                                    marginTop: 10,
                                }}
                                type="outline"
                                buttonStyle={{
                                    padding: moderateScale(4),
                                    borderColor: '#00ADEF',
                                    borderWidth: 0.5,
                                    backgroundColor: '#fff',
                                }}
                                titleStyle={{
                                    color: '#00ADEF',
                                    fontFamily: 'Mulish',
                                }}
                                icon={
                                    <Image
                                        style={{ height: verticalScale(17), width: 23 }}
                                        source={require('../../../assets/images/open-eye.png')}
                                    />
                                }
                                iconRight
                                onPress={() =>
                                    this.props.navigation.navigate("VendorGallery", { vid: data.userId, name: data.name, })
                                }
                            />}

                    </View>

                    <View style={styles.section}>
                        <AppText style={[styles.heading]}>Address</AppText>
                        <View style={styles.inputlikeWrapper}>
                            <AppText style={styles.greyText}>
                                {data.address ? data.address : ''}
                            </AppText>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <AppText style={[styles.heading]}>Notes</AppText>
                        <View style={[styles.inputlikeWrapper, {
                            minHeight: verticalScale(50),
                            justifyContent: 'flex-start'
                        }]}>
                            <AppText style={styles.greyText}>
                                {data.notes}
                            </AppText>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground >
    }
}


const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
    heading: {
        fontSize: moderateScale(15),
        marginBottom: verticalScale(6),
        color: '#355D9B',
        fontFamily: 'Mulish-Bold'
    },
    section: {
        backgroundColor: '#fff',
        padding: verticalScale(10),
        borderRadius: verticalScale(6),
        marginBottom: verticalScale(10),
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
    },
    inputlikeWrapper: {
        //borderRadius: moderateScale(6),
        //borderColor: 'rgba(53, 93, 155, 1)',
        //minHeight: moderateScale(42),
        //borderWidth: 0.5,
        // flexDirection: 'row',
        //justifyContent: 'center',
        //paddingVertical: moderateScale(5),
        //paddingHorizontal: moderateScale(8)
    },
    greyText: {
        color: 'rgba(136, 135, 156, 1)',
        fontFamily: 'Mulish-Bold'
    }

})

const mapStateToProps = state => {
    const { currentEvent, vendorAlbum } = state.events
    const { currentTask } = state.events

    return {
        currentEvent, vendorAlbum,
        currentTask,
    }
}

export default connect(mapStateToProps)(VendorDetails)
