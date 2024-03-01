import * as React from 'react'
import {
    View,
    ImageBackground,
    ScrollView, StyleSheet,
    Dimensions,
    Pressable,
    Switch,
    TextInput
} from 'react-native'

import Text from '../../../components/UI/AppText'
import TopBar from '../../../components/TopBar'
import VendorEntry from '../../../components/Vendor/NewVendorEntry'

import { moderateScale, verticalScale } from '../../../utils/scalingUnits'

import * as SvgIcons from '../../../assets/svg-icons'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import { Image } from 'react-native-elements'
import VendorItem from '../../../components/Vendor/VendorItem'
import { connect } from 'react-redux'

class VendorsScreen extends React.Component {
    state = {
        filterdList:this.props.currentTask.vendors
    }
    componentDidUpdate(prevProps){
        if(prevProps.currentTask?.vendors!==this.props.currentTask?.vendors){
            this.setState({filterdList:this.props.currentTask.vendors})
        }
    }

    renderHeaderRightComp = () => {
        return <Pressable
            onPress={() => this.props.navigation.navigate("VendorManager",
                {
                    data:this.props.currentTask
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
        return <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            height: verticalScale(50),
            borderRadius: verticalScale(10),
            marginHorizontal: moderateScale(9)
        }}>
            <Feather
                name="search"
                style={{
                    padding: 10,
                    fontSize: verticalScale(23),
                    color: '#355D9B'
                }}
            />
            <TextInput
                onChangeText={text=>{
                    let arr=this.props.currentTask.vendors?.filter(i=>i.name.toLowerCase().includes(text.toLowerCase()))
                    this.setState({filterdList:arr})
                }}
                placeholderTextColor="#404A69"
                placeholder="Search"
                style={{
                    fontSize: verticalScale(15),
                    color: '#404A69',
                    fontFamily: 'Mulish-Light',
                    flex: 1,
                    marginLeft: moderateScale(5)
                }}
            />
        </View>
    }

    handleItemClick=(data)=>{
        this.props.navigation.navigate("VendorDetails", {
            data: data,
         })
    }

    renderVendors = () => { 
        return <>
            { this.state.filterdList?.map((each,i)=>
                    <VendorItem key={i} data={each}  handleItemClick={this.handleItemClick} /> 
                )
            }
        </>
    }

    render() {
        const data = this.props.currentTask

        return <ImageBackground
            source={require("../../../assets/images/blurBG.png")}
            resizeMode="cover"
            imageStyle={{
                width: "100%",
                height: "100%"
            }}
            style={{
                // flex: 1,
                minWidth: "100%",
                minHeight: "100%"
            }}
        ><ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: moderateScale(50)
            }}
        >
                <TopBar
                    style={{ backgroundColor: 'transparent' }}
                    title={data?.name}
                    rightComponent={this.renderHeaderRightComp()}
                />
                <View style={{
                    marginHorizontal: moderateScale(11)
                }}>
                    {this.renderSearchField()}
                    {this.renderVendors()}
                </View>
            </ScrollView>
        </ImageBackground >
    }
}


const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const styles = StyleSheet.create({

})

const mapStateToProps = state => { 
    const { currentEvent } = state.events
    const { currentTask } = state.events 

    return { 
        currentEvent,
        currentTask 
    }
}

export default connect(mapStateToProps)(VendorsScreen)
