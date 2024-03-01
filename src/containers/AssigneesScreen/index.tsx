import * as React from 'react'
import {
    View,
    ImageBackground,
    ScrollView, StyleSheet,
    Dimensions,
    Pressable,
    Switch,
    FlatList,
    Image
} from 'react-native'

import Text from '../../components/UI/AppText'
import TopBar from '../../components/TopBar'
import { moderateScale, verticalScale } from '../../utils/scalingUnits'
import Feather from 'react-native-vector-icons/Feather'

import * as SvgIcons from '../../assets/svg-icons'

const AssigneesScreen = ({ route, navigation }) => {

    const { type, guests, hostId, assignees } = route.params;
    const [list, setList] = React.useState<any>([])
    //const [assignedList, setAssignedList] = React.useState<any>([])

    React.useEffect(() => {

        let list = []
        // console.log(assignees)
        // console.log(guests)

        assignees.map(i => {
            list.push({
                userId: i.userId,
                status: i.status,
                name: i.name,
                phone: i.phone,
                selected: true
            })
        })

        guests.map(i => {
            if (assignees.find(j => j.userId == i.userId)) {

            } else {
                list.push({
                    userId: i.userId,
                    status: "ACTIVE",
                    name: i.name,
                    phone: i.phone,
                })
            }
        })

        setList(list)

    }, [])

    /* React.useEffect(()=>{
        return ()=>{
            onClickAssign(assignedList)
        }
    }) */

    const renderHeaderRightComp = () => {
        let assignedList = []
        assignedList = list.filter(i => i.selected)
        //console.log("hi")
        return <Pressable
            onPress={() => {
                if (assignedList.length > 0) {
                    route.params.onClickAssign(assignedList)
                    navigation.pop()
                }
            }}
            style={{
                marginRight: -moderateScale(4)
            }}
        >
            <Feather
                name="check"
                style={{
                    color: assignedList.length > 0 ? '#355D9B' : "grey",
                    fontSize: verticalScale(28)
                }}
            />
        </Pressable>
    }

    const renderItem = ({ item }) => {
        return (
            <Pressable
                onPress={() => {
                    if (item.userId == hostId) {
                        return
                    }
                    //console.log(item)
                    let arr = [...list]
                    //console.log(arr)
                    for (let data of arr) {
                        if (data.phone == item.phone) {
                            data.selected = (data.selected == null) ? true : !data.selected;
                            break;
                        }
                    }
                    setList(arr);
                }}
                style={{
                    flexDirection: "row",
                    minHeight: verticalScale(60),
                    borderRadius: moderateScale(6),
                    marginBottom: moderateScale(7),
                    padding: moderateScale(15),
                    backgroundColor: item.selected == true ? "#A7ECC1" : 'white',
                    alignItems: 'center',
                    borderWidth: 0.3
                    // justifyContent: 'space-between'
                }}
            >
                <View style={{
                    marginRight: moderateScale(7)
                }}>
                    <Image
                        style={{
                            width: moderateScale(54),
                            height: moderateScale(54),
                            borderRadius: moderateScale(27)
                        }}
                        source={require("../../assets/images/event.png")}
                    />
                </View>
                <View style={{
                    flex: 1,
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: moderateScale(14),
                        color: '#355D9B',
                        fontFamily: 'Mulish-Bold'
                    }}>
                        {item.name}
                    </Text>
                    <Text
                        style={{
                            fontSize: moderateScale(13),
                            color: "grey",
                        }}
                    >
                        {item.phone}
                    </Text>
                </View>

                {/* item.userId == hostId
                    &&
                    <View style={{ padding:5,backgroundColor:"green", borderRadius:3}}>
                        <Text style={{color:"white", fontWeight:"bold"}}>Host</Text>
                    </View> */
                }

            </Pressable>
        );
    };



    return <ImageBackground
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

        <TopBar
            style={{ backgroundColor: 'transparent' }}
            title={type}
            rightComponent={renderHeaderRightComp()}
        />
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1
            }}
        >
            <View style={{ flexDirection: 'row' }}>
                <FlatList
                    contentContainerStyle={{
                        paddingBottom: 40,
                        marginHorizontal: moderateScale(11)
                    }}
                    style={{ paddingTop: 10 }}
                    data={list}
                    // data={contacts}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index}
                />
            </View>
        </ScrollView>
    </ImageBackground >
}


const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
    heading: {
        fontSize: moderateScale(22),
        marginVertical: verticalScale(20),
        marginHorizontal: moderateScale(11),
        color: '#355D9B',
        fontFamily: 'Mulish-ExtraBold'
    }
})


export default AssigneesScreen
