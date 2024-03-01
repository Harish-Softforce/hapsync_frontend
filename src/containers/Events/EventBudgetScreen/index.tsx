import * as React from 'react'
import {
    View,
    ImageBackground,
    ScrollView, StyleSheet,
    Dimensions,
    Pressable,
    Switch,
    Image,
    TextStyle,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native'

import AppText from '../../../components/UI/AppText'
import TopBar from '../../../components/TopBar'
import AppInput from '../../../components/UI/Input'

import { moderateScale, verticalScale } from '../../../utils/scalingUnits'

import * as SvgIcons from '../../../assets/svg-icons'

import { launchCamera, launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import Accordion from 'react-native-collapsible/Accordion';
import { connect } from 'react-redux'
import moment from 'moment'
import validator from 'validator'
import { updateEvent } from '../../../store/actionCreators'

class EventTasks extends React.Component {
    state = {
        activeSections: [],
        accordionData: [],

        finalCost: 0,
        paid: 0,
        pending: 0,

        plannedBudget: 0,
        isEditedPlannedBudget: false,
        errMsg: ""
    }

    componentDidMount() {
        this.initialize()
    }
    initialize() {
        let accordionData = []
        //unique Activity Types
        let finalCost = 0
        let finalpaid = 0
        let finalpending = 0

        this.props.currentEvent?.activities?.map(i => {
            let cost = i.budget
            let paid = 0

            i.budgetRequest.payments.map(j => {
                paid = paid + j.amount
            })
            let due = cost - paid

            accordionData.push(
                {
                    title: i.name,
                    cost: cost,
                    paid: paid,
                    due: due,
                    payments: i.budgetRequest.payments
                }
            )
            finalCost = finalCost + cost
            finalpaid = finalpaid + paid
        })

        finalpending = finalCost - finalpaid
        this.setState(
            {
                accordionData: accordionData,
                finalCost: finalCost,
                paid: finalpaid,
                pending: finalpending,
                plannedBudget: this.props.currentEvent?.budget,
                isEditedPlannedBudget: false,
                errMsg: ""
            }
        )
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentEvent !== this.props.currentEvent) {
            this.initialize()
        }
    }

    updateSection = (activeSections) => {
        this.setState({ activeSections });
    }

    renderRightHeaderComp = () => {
        const { plannedBudget, isEditedPlannedBudget } = this.state

        return <View>
            {isEditedPlannedBudget &&
                <Pressable
                    onPress={() => {
                        if (validator.isNumeric(String(this.state.plannedBudget)) && Number(this.state.plannedBudget) > -1) {
                            let obj = { ...this.props.currentEvent }
                            obj.budget = plannedBudget
                            obj.eventId = obj.id

                            updateEvent(obj)
                        }
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
        </View>
    }

    renderCosts = () => {

        let boldBlueText: TextStyle = {
            color: '#355D9B',
            fontSize: verticalScale(25),
            fontWeight: 'bold'
        }
        let lightBlueText: TextStyle = {
            color: '#355D9B66',
            fontSize: verticalScale(13),
            fontWeight: '500',
            paddingBottom: 5
        }
        let skyBlueText: TextStyle = {
            color: '#00ADEF',
            fontSize: verticalScale(13)
        }

        return <View
            style={{
                flexDirection: 'row',
            }}
        >
            <View style={{
                backgroundColor: '#fff',
                borderRadius: verticalScale(10),
                minHeight: verticalScale(143),
                flex: 1,
                alignItems: 'center',
                paddingTop:20,
                marginRight: moderateScale(3)
            }}>
                <AppText style={lightBlueText}>Planned Budget</AppText>

                {this.state.isEditedPlannedBudget ?
                    <>
                        <TextInput
                            onChangeText={(val) => {
                                this.setState({ plannedBudget: val })
                                if (validator.isNumeric(val) && Number(val) > -1) {
                                    this.setState({ errMsg: "" })
                                } else {
                                    this.setState({ errMsg: "Invalid" })
                                }
                            }}
                            value={String(this.state.plannedBudget)}
                            
                            style={[boldBlueText, { fontSize: verticalScale(20), borderBottomWidth: 1, borderColor: 'grey', paddingHorizontal: 20 }]}
                            multiline={true}
                            numberOfLines={1}
                            keyboardType='numeric'
                            returnKeyType='done'
                            onSubmitEditing={Keyboard.dismiss}
                        />
                        <Text style={{ color: 'red', fontSize: 17 }}>{this.state.errMsg}</Text>
                    </>
                    : <>
                        <Text style={boldBlueText}>{this.state.plannedBudget}</Text>
                        {this.props.currentEvent.eventEditAccess && <Pressable style={{ padding: 15 }}
                            onPress={() => {
                                this.setState({ isEditedPlannedBudget: true })
                            }}
                        >
                            <SvgIcons.EditPenIcon
                                style={{
                                    transform: [{ scale: moderateScale(1) }],
                                    //marginTop: verticalScale(16)
                                }}
                            />
                        </Pressable>}
                    </>
                }
            </View>
            <View
                style={{
                    flex: 1
                }}
            >
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: verticalScale(10),
                    height: verticalScale(89),
                    alignItems: 'center',
                    paddingTop:20,
                    
                    
                }}>
                    <AppText style={lightBlueText}>Final Cost</AppText>
                    <AppText style={[boldBlueText]}>{this.state.finalCost}</AppText>
                </View>


                <View style={{
                    flexDirection: 'row',
                    flex: 1,
                    marginTop: verticalScale(3)
                }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: verticalScale(10)
                    }}>
                        <AppText style={[lightBlueText,{paddingBottom:1}]}>Paid</AppText>
                        <AppText style={skyBlueText}>{this.state.paid}</AppText>
                    </View>
                    <View style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: verticalScale(10),
                        marginLeft:3    
                    }}>
                        <AppText style={[lightBlueText,{paddingBottom:1}]}>Pending</AppText>
                        <AppText style={skyBlueText}>{this.state.pending}</AppText>
                    </View>
                </View>
            </View>
        </View>
    }

    /** accordion login starts */

    renderAccordionHeader = (item) => {
        return <View style={[styles.section, {
            //height: verticalScale(78),
            //marginBottom: verticalScale(6),
            flexDirection: 'row'
        }]}>
            {/* <View style={{
                flex: 0.2,
                justifyContent: 'center',
            }}>
                <View style={{
                    backgroundColor: '#00ADEF',
                    height: verticalScale(41),
                    width: verticalScale(41),
                    borderRadius: verticalScale(47),
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {item?.icon}
                </View>
            </View> */}
            <View style={{
                flex: 1,
                justifyContent: 'center',
            }}
            >
                <AppText style={{
                    color: '#355D9B',
                    fontFamily: 'Mulish-Bold'
                }}>
                    {item?.title}
                </AppText>
                <View style={{ height: 5 }}></View>
                <AppText
                    style={{
                        color: '#88879C',
                        fontSize: verticalScale(10)
                    }}
                >Cost: {item.cost}</AppText>
            </View>
            <View style={{ flex: 0.5, justifyContent: 'center', }}>
                <AppText
                    style={{
                        color: '#88879C',
                        fontSize: verticalScale(10)
                    }}
                >Paid: {item.paid}</AppText>
                <View style={{ height: 5 }}></View>
                <AppText
                    style={{
                        color: '#88879C',
                        fontSize: verticalScale(10)
                    }}
                >Due: {item.due}</AppText>
            </View>
            <View style={{
                justifyContent: 'center',
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

    renderAccordionContent = (item) => {
        //console.log( item)
        const payments = item.payments

        return <View
            style={{
                backgroundColor: '#fff',
                borderRadius: verticalScale(10),
                padding: moderateScale(10),
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
               // marginBottom: verticalScale(8),
                marginTop: -verticalScale(12),
            }}
        >
            {payments.map((each, index) => {
                return <View
                    key={index}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: verticalScale(57),
                        borderBottomColor: '#88879C1A',
                        borderBottomWidth: verticalScale(1)
                    }}>
                    <View>
                        <AppText
                            style={{
                                color: '#355D9B',
                                fontSize: verticalScale(13),
                                //fontWeight: 'bold'
                                padding:5,
                                margin:0
                            }}
                        >{each.name}</AppText>
                        <View style={{ height: 5 }}></View>
                        <AppText
                            style={{
                                color: '#88879C',
                                fontSize: verticalScale(10)
                            }}
                        >Date: {moment(each.date).format('DD-MM-YYYY')}</AppText>
                    </View>
                    <AppText
                        style={{
                            color: '#88879C',
                            fontSize: verticalScale(10)
                        }}
                    >Paid: {each.amount}</AppText>
                </View>
            })}
        </View>
    }


    renderAccordion = () => {
        const { accordionData, activeSections } = this.state

        /* let data = Object.keys(accordionData).map((key) => {
            return {
                title: accordionData[key].title,
            icon: accordionData[key].icon
            }
        }) */

        return <View style={
            {marginTop: verticalScale(0)}
            
            

            

        }>
            <Accordion

            
                activeSections={activeSections}
                sections={accordionData}
            
                renderSectionTitle={() => { }}
                renderHeader={this.renderAccordionHeader}
                
                renderContent={this.renderAccordionContent}
                onChange={this.updateSection}
                underlayColor="transparent"
                touchableComponent={TouchableWithoutFeedback}
                duration={0}
            />
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
                flex: 1,
                minWidth: "100%",
                minHeight: "100%"
            }}
        >
            <TopBar
                style={{ backgroundColor: 'transparent' }}
                title="Budget"
                rightComponent={this.renderRightHeaderComp()}
            />
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: moderateScale(10)
                }}
            >
                <View style={{
                    marginHorizontal: moderateScale(11)
                }}>
                    {this.renderCosts()}
                    {this.renderAccordion()}
                </View>
            </ScrollView>
        </ImageBackground >
    }
}





const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
    heading: {
        fontSize: moderateScale(14),
        marginVertical: verticalScale(0),
        color: '#355D9B',
        fontFamily: 'Mulish-ExtraBold',
        
    },
    section: {
        backgroundColor: '#fff',
        padding: verticalScale(10),
        borderRadius: verticalScale(10),
        //borderBottomLeftRadius: 0,
        //borderBottomRightRadius: 0,
        //marginBottom: verticalScale(15),
        marginTop: verticalScale(10),
        elevation: 1
    },
   
})

const mapStateToProps = state => {
    const { eventsCategories } = state.events
    const { currentEvent } = state.events
    const { userData } = state.user

    return {
        eventsCategories,
        currentEvent,
        userData
    }
}

export default connect(mapStateToProps)(EventTasks)