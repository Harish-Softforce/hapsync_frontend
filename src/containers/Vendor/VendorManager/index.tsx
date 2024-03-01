import * as React from 'react'
import {
    View,
    ImageBackground,
    ScrollView, StyleSheet,
    Dimensions,
    Pressable,
    Switch,
    Image,
    TextInput,
    FlatList,
    Text,
    Modal
} from 'react-native'

import AppText from '../../../components/UI/AppText'
import AppButton from '../../../components/UI/button'
import TopBar from '../../../components/TopBar'
import VendorEntry from '../../../components/Vendor/NewVendorEntry'

import { moderateScale, verticalScale } from '../../../utils/scalingUnits'

import * as SvgIcons from '../../../assets/svg-icons'

import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import Accordion from 'react-native-collapsible/Accordion';
import VendorItem from '../../../components/Vendor/VendorItem'
import axios from '../../../axios'
import { connect } from 'react-redux'
import { addActivityVendor, addGoogleVendor, updateActivity, updateActivityVendor } from '../../../store/actionCreators'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { Button, Divider } from 'react-native-elements'

import { Client } from "@googlemaps/google-maps-services-js";
import { each } from 'immer/dist/internal'
import Config from 'react-native-config'

let modalValues = [
    {
        title: 'Evaluating',
        value: 'EVALUATING'
    },
    {
        title: 'Hired',
        value: 'HIRED'
    },
    {
        title: 'Not Available',
        value: 'NOTAVAILABLE'
    },
    {
        title: 'Rejected',
        value: 'REJECTED'
    }
]
const client = new Client({})

class VendorManager extends React.Component {
    state = {
        shortListed: [],
        hapRecommended: [],
        googleVendorsList: [],
        vendorStatus: undefined,
        modalVisible: false,
        selectedVendor: undefined
    }

    componentDidMount() {
        if (this.props.currentTask) {
            axios.get('/suggestions/activities/' + this.props.currentTask.activityTypeId + '/vendors')
                .then(res => {
                    //console.log(res)
                    let arr = res.data.filter(i => {
                        let a = true
                        this.props.currentTask.vendors.map(j => {
                            if (j.vendorId == i.id) {
                                a = false
                            }
                        })
                        return a
                    })
                    this.setState({ hapRecommended: arr })
                }).catch(e => {
                    console.log(e)
                })
            this.setState({ short: this.props.currentTask.vendors })
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.currentTask?.vendors !== this.props.currentTask?.vendors) {
            let arr = this.state.hapRecommended.filter(i => {
                let a = true
                this.props.currentTask?.vendors.map(j => {
                    if (j.vendorId == i.id) {
                        a = false
                    }
                })
                return a
            })
            this.setState({ hapRecommended: arr })
        }
    }

    renderVendorStatus = (data) => {
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
            <AppText style={{
                color: colors.textColor,
                fontSize: verticalScale(10)
            }}>{status}</AppText>
        </View>
    }

    handleItemClick = (data) => {
        this.props.navigation.navigate("VendorDetails", {
            data: data,
        })
    }

    handleUpdateStatus = (data) => {
        if (this.props.currentEvent.taskAccess) {
            this.setState({ selectedVendor: data, modalVisible: true, vendorStatus: data.status })
        }
    }


    renderVendors = () => {

        return <View >
            {this.props.currentTask?.vendors.map((each, index) => {
                return <VendorItem
                    key={index}
                    data={each}
                    handleItemClick={this.handleItemClick}
                    handleUpdateStatus={this.handleUpdateStatus}
                />
            })}
        </View>
    }

    renderUpdateStatusModal = () => {
        return <Modal visible={this.state.modalVisible} animationType="slide"
            transparent={true}
        >
            <Pressable
                onPress={() => this.setState({ modalVisible: false, vendorStatus: undefined, selectedVendor: undefined })}
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0,0.8)',
                    justifyContent: 'flex-end',
                }}>
                <View style={{
                    marginHorizontal: moderateScale(11),
                    backgroundColor: '#fff',
                    minHeight: verticalScale(100),
                    paddingVertical: verticalScale(11),
                    borderRadius: verticalScale(10)
                }}>
                    {modalValues.map((each) => {
                        let match = this.state.vendorStatus == each.value;
                        if (this.state.vendorStatus) {
                            match = this.state.vendorStatus == each.value
                        }

                        return <Pressable
                            onPress={() => this.setState({ vendorStatus: each.value })}
                            key={each.value}
                            style={{
                                height: verticalScale(40),
                                justifyContent: 'center',
                                backgroundColor: match ? '#F8F7FA' : '#fff',
                                elevation: match ? 1 : 0,
                                paddingHorizontal: moderateScale(13)
                            }}>
                            <Text
                                style={{
                                    fontSize: verticalScale(18),
                                    color: match ? '#355D9B' : '#88879C',
                                    fontFamily: match ? 'Mulish-Bold' : 'Mulish-Regular'
                                }}
                            >
                                {each.title}
                            </Text>
                        </Pressable>
                    })}
                    <View style={{
                        flexDirection: 'row',
                        marginTop: moderateScale(12),
                        marginHorizontal: moderateScale(11)
                    }}>
                        <AppButton
                            clicked={() => this.setState({ modalVisible: false, vendorStatus: undefined, selectedVendor: undefined })}
                            title="Cancel"
                            style={[styles.button, {
                                backgroundColor: '#00ADEF',
                                marginRight: verticalScale(7)
                            }]}
                        />
                        <AppButton
                            clicked={() => {
                                if (this.state.selectedVendor) {
                                    let obj = {
                                        ...this.state.selectedVendor,
                                        status: this.state.vendorStatus,
                                        eventId:this.props.currentEvent.id,
                                    }
                                    updateActivityVendor(obj, this.props.currentEvent.id)
                                }
                                this.setState({
                                    vendorStatus: undefined,
                                    modalVisible: false,
                                    selectedVendor: undefined
                                })
                            }}
                            title="OK"
                            style={[styles.button]}
                        />
                    </View>
                </View>
            </Pressable>
        </Modal>
    }

    renderHeaderRightComp = () => {
        return <Pressable
            onPress={() => this.props.navigation.navigate("AddVendor",
                {
                    taskId: this.props.currentTask.id,
                    activityTypeId: this.props.currentTask.activityTypeId,
                    eventId: this.props.currentEvent.id
                }
            )}
            style={{
                marginRight: -moderateScale(4)
            }}
        >
            <Feather
                name="plus"
                style={{
                    color: '#355D9B',
                    fontSize: verticalScale(28)
                }}
            />
        </Pressable>
    }


    renderSearchField = () => {
        const renderItem = ({ item }) => {
            return <>
                <Pressable
                    onPress={() => {

                        let renderData = [...this.state.googleVendorsList];
                        //console.log(renderData)
                        for (let data of renderData) {
                            if (data.place_id == item.place_id) {
                                data.selected = (data.selected == null) ? true : !data.selected;
                                break;
                            }
                        }
                        this.setState({ googleVendorsList: renderData });
                    }}
                    style={{ backgroundColor: item.selected == true ? "#A7ECC1" : 'white', paddingVertical: 10 }}>
                    <Text style={{ padding: 5, marginLeft: 10, fontWeight: 'bold' }}>{item.name}</Text>
                    <Text style={{ padding: 5, marginLeft: 10, }}>{item.vicinity}</Text>
                </Pressable>
                <Divider color='black' />
            </>
        }
        return <><View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            minHeight: verticalScale(40),
            borderRadius: verticalScale(6),
            paddingHorizontal: moderateScale(11)
        }}>
            <SvgIcons.GoogleIcon
                style={{
                    //transform: [{ scale: moderateScale(1) }]
                }}
            />
            <TextInput
                onChangeText={(val) => {
                    const { latitude, longitude } = this.props.currentEvent.locations[0]
                    const { placeType } = this.props.currentEvent

                    client.placesNearby({
                        params: {
                            key: Config.GOOGLE_PLACE_API_KEY,
                            location: latitude + ',' + longitude,
                            radius: 25000,
                            type: placeType,
                            keyword: val,
                            //rankby:'distance'
                        },
                        timeout: 60000
                    }).then(r => {
                        //console.log(r.data.results)
                        let arr = [...r.data.results]

                        arr = arr.filter(i => !(this.props.currentTask?.vendors?.find(j => j.placeId == i.place_id)))


                        this.setState({ googleVendorsList: arr })
                    }).catch(e => {
                        console.log(e)
                    })

                }}
                placeholderTextColor="#404A69"
                placeholder="Search"
                style={{
                    fontSize: verticalScale(15),
                    color: '#404A69',
                    fontFamily: 'Mulish-Light',
                    flex: 1,
                    marginLeft: moderateScale(5),
                    paddingLeft: 5
                }}
            />

            <View>
                {this.state.googleVendorsList.length > 0 
                && <Button
                    onPress={() => {

                        let arr = []
                        let a = [...this.state.googleVendorsList]

                        var requests = 0;

                        a.forEach(async data => {
                            if (data.selected) {
                                requests++;
                                //console.log(data)
                                await client.placeDetails({
                                    params: {
                                        place_id: data.place_id,
                                        key: Config.GOOGLE_PLACE_API_KEY,
                                    },

                                }).then((r) => {
                                    requests--
                                    //console.log(requests)
                                    //console.log(r.data.result)

                                    let phoneNo = null

                                    let result = r.data.result
                                    if (result.formatted_phone_number) {
                                        let num = String(result.formatted_phone_number).replace(/\D/g, "")
                                        phoneNo = num
                                        console.log(phoneNo)
                                        if (phoneNo.length > 10) {
                                            phoneNo = num.substr(num.length - 10)
                                        }
                                    }

                                    let obj = {
                                        placeId: result.place_id,
                                        latitude: result.geometry?.location.lat,
                                        longitude: result.geometry?.location.lng,
                                        website: result.website,
                                        phone: phoneNo,
                                        name: result.name,
                                        address: result.vicinity,
                                        activityId: this.props.currentTask.id,
                                        activityTypeId: this.props.currentTask.activityTypeId
                                    }
                                    console.log(obj)
                                    arr.push(obj)
                                    if (requests == 0) {
                                        done(arr)
                                    }
                                }).catch(e => {
                                    requests--
                                    console.log(e)
                                })
                            }
                        })
                        const done = (arr) => {
                            console.log(arr)
                            if (arr.length > 0) {
                                addGoogleVendor(arr, this.props.currentTask.id, this.props.currentEvent.id)
                            }
                        }
                        this.setState({
                            googleVendorsList: [],
                        })
                    }}
                    title={"Save"}
                    titleStyle={{
                        fontFamily: "Mulish-Bold",
                        letterSpacing: 1
                    }}
                />}
            </View>


            {/* <GooglePlacesAutocomplete
                    placeholder='Search'
                    enablePoweredByContainer={false}
                    nearbyPlacesAPI={'GooglePlacesSearch'}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        console.log(data, details);
                    }}
                    GooglePlacesSearchQuery={{ rankby: 'distance', type: 'bakery' }}
                    query={{
                        key: Config.GOOGLE_PLACE_API_KEY,
                        language: 'en',
                        //components: 'country:us',
                    }}
                /> */}
        </View>
            <View style={{ height: 5 }}></View>

            <FlatList
            keyboardShouldPersistTaps='handled'
                nestedScrollEnabled
                data={this.state.googleVendorsList}
                renderItem={renderItem}
                keyExtractor={(item, index) => String(index)}
                style={{ maxHeight: deviceHeight / 2, margin: 3, }}
            />
        </>
    }

    handleEvaluate = (data) => {
        /* let arr=this.state.hapRecommended
        arr.splice(arr.findIndex(x => x.id===data.id),1);

        let list=this.state.shortListed
        list.push(data)

        this.setState({
            shortListed: list,
            hapRecommended: arr,
        }) */

        let apiVendors = []

        apiVendors.push(
            {
                eventId:this.props.currentEvent.id,
                activityId: this.props.currentTask.id,
                status: "EVALUATING",
                vendorId: data.id,
            }
        )

        addActivityVendor(apiVendors, this.props.currentEvent.id, this.props.currentTask.id)
    }

    renderRecommendations = () => {

        return <View >
            {this.state.hapRecommended.map((each, index) => {
                return <VendorItem key={index} data={each} handleEvaluate={this.handleEvaluate} />
            })}
            <View style={{ height: 30 }}></View>
        </View>
    }

    updateSection = (activeSections) => {
        this.setState({ activeSections });
    }

    /** accordion logic starts */
    renderAccordionSectionTitle = (item) => {
        return
    }

    renderAccordionContent = (item) => {
        const users = [
            {
                name: 'John Smith',
                status: 'Evaluating'
            },
            {
                name: 'John Smith',
                status: 'Discarded'
            }
        ]

        return <View style={{
            backgroundColor: '#fff',
            elevation: 1,
            borderRadius: verticalScale(16),
            padding: moderateScale(20),
            marginBottom: verticalScale(8),
            marginTop: -verticalScale(12)
        }}>
            {users.map((user, index) => {
                return <Pressable
                    onPress={() => this.props.navigation.navigate("VendorDetails", {
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
                        <AppText style={{
                            fontSize: moderateScale(13),
                            fontWeight: 'bold',
                            color: '#355D9B'
                        }}>
                            {user?.name}
                        </AppText>
                        <AppText style={{
                            fontSize: moderateScale(10),
                            color: '#88879C'
                        }}>
                            +01 123580 45795
                        </AppText>
                    </View>
                    <View style={{
                        marginLeft: 'auto',
                    }}>
                        {this.renderVendorStatus(user)}
                    </View>
                </Pressable>
            })}
        </View>
    }

    renderAccordionHeader = (item) => {
        return <View style={[styles.section, {
            height: verticalScale(98),
            flexDirection: 'row'
        }]}>
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
                    {item?.icon}
                </View>
            </View>
            <View style={{
                flex: 0.65,
                justifyContent: 'center',
            }}
            >
                <AppText style={{
                    color: '#355D9B',
                    fontFamily: 'Mulish-Bold'
                }}>
                    {item?.title}
                </AppText>
                <AppText style={{
                    fontSize: verticalScale(10),
                    color: '#9F9FB9'
                }}>Browse vendors</AppText>
            </View>
            <View style={{
                flex: 0.15,
                justifyContent: 'center'
            }}>
                <MaterialIcons
                    name="keyboard-arrow-down"
                    style={{
                        fontSize: verticalScale(23),
                        marginLeft: 'auto',
                        color: '#355D9B'
                    }}
                />
            </View>
        </View>
    }
    /** accordion logic ends */


    render() {
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
                title="Vendors"
                rightComponent={this.props.currentEvent.taskAccess ? this.renderHeaderRightComp() : <></>}
            />
            <ScrollView
            keyboardShouldPersistTaps='handled'
                contentContainerStyle={{
                    flexGrow: 1,
                }}
            >
                <View style={{
                    marginHorizontal: moderateScale(15)
                }}>
                    {this.props.currentEvent.taskAccess && this.renderSearchField()}
                    <AppText style={[styles.heading, {
                        marginTop: verticalScale(5),
                        marginVertical:0
                    }]}>Shortlisted Vendors ({this.props.currentTask?.vendors.length})</AppText>
                    {this.renderVendors()}
                    {this.props.currentEvent.taskAccess && <AppText style={[styles.heading,{marginTop: verticalScale(20),marginVertical:0}]}>Hapsync recommended </AppText>}
                    {this.props.currentEvent.taskAccess && this.renderRecommendations()}
                    {this.renderUpdateStatusModal()}
                    {/* <AppButton
                        clicked={()=>{
                            //console.log(this.props.route.params.data)

                            let apiVendors=[]

                            this.state.shortListed.map(i=>{
                                apiVendors.push(
                                    {
                                        activityId: this.props.currentTask.id,
                                        status: "EVALUATING",
                                        vendorId: i.id,
                                    }
                                )
                            })
                            addActivityVendor(apiVendors,this.props.currentEvent.id,this.props.currentTask.id)
                            this.props.navigation.pop()
                        }}
                        style={{
                            height: verticalScale(44)
                        }}
                        title="OK"
                    /> */}
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
        marginVertical: verticalScale(6),
        color: '#355D9B',
        fontFamily: 'Mulish-ExtraBold'
    },
    section: {
        backgroundColor: '#fff',
        padding: verticalScale(20),
        borderRadius: verticalScale(15),
        marginBottom: verticalScale(15),
        elevation: 1
    },
    button: {
        height: verticalScale(40),
        flex: 1
    },
})

const mapStateToProps = state => {
    const { currentEvent } = state.events
    const { currentTask } = state.events

    return {
        currentEvent,
        currentTask
    }
}

export default connect(mapStateToProps)(VendorManager)
