import * as React from 'react'
import {
    ScrollView,
    ImageBackground,
    View,
    ViewStyle,
    StyleSheet,
    Pressable,
    Dimensions,
    RefreshControl,
    ActivityIndicator,
    TextInput,
    FlatList,
    Platform
} from 'react-native';

import TopBar from '../../../components/TopBar'

import Feather from 'react-native-vector-icons/Feather'

import EventCatItem from '../../../components/Events/EventCatItem'
import { getEventsCategories } from '../../../store/actionCreators';
import { connect } from 'react-redux';
import { eventsApi } from '../../../store/rtk-query/event';
import { moderateScale, verticalScale } from '../../../utils/scalingUnits';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Styles = {
    container: ViewStyle
}

class EventCat extends React.Component {

    state = {
        refreshing: false,
        allEventsCategories: [],
        catToShow: []
    }

    componentDidMount() {
        getEventsCategories(this.props.userData.id, true).then(() => {
            let arr = this.props.eventsCategories || []
            let arr1 = arr.filter(i => i.type == "CUSTOM")
            let arr2 = arr.filter(i => i.type == "REGULAR")
            let final = arr1.concat(arr2)

            this.setState({ allEventsCategories: final, catToShow: final })
        }).catch(e => {
            console.log(e)
        })
    }

    onRefresh = async () => {
        this.setState({ refreshing: true })
        await getEventsCategories(this.props.userData.id, false)
        let arr = this.props.eventsCategories || []
        let arr1 = arr.filter(i => i.type == "CUSTOM")
        let arr2 = arr.filter(i => i.type == "REGULAR")
        let final = arr1.concat(arr2)
        this.setState({ allEventsCategories: final, catToShow: final, refreshing: false })
    }

    renderRightHeader = () => {
        return <Pressable
            onPress={() => this.props.navigation.navigate("Main", {
                initial: false,
                screen: 'CreateScreen'
            })}
            style={{

            }}>
            <Feather
                name="plus"
                style={{
                    fontSize: 26,
                    color: 'rgba(53, 93, 155, 1)'
                }}
            />
        </Pressable>
    }

    renderSearchField = () => {
        return <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            minHeight: verticalScale(40),
            borderRadius: moderateScale(6),
            paddingHorizontal: moderateScale(9),
            marginBottom: 10,
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
        }}>
            <Feather
                name="search"
                style={{
                    fontSize: verticalScale(23),
                    color: '#355D9B'
                }}
            />
            <TextInput
                placeholderTextColor="#404A69"
                placeholder="Search"
                style={{
                    fontSize: verticalScale(15),
                    color: '#404A69',
                    fontFamily: 'Mulish-Light',
                    flex: 1,
                    marginLeft: moderateScale(5)
                }}
                onChangeText={(val) => {
                    let arr = [...this.state.allEventsCategories]
                    arr = arr.filter(i => (i.description).toLowerCase().includes(val.toLowerCase()))
                    this.setState({ catToShow: arr })
                }}
            />
        </View>
    }

    renderItem = ({ item }) => {
        return <EventCatItem
            data={item}
            navigation={this.props.navigation}
        />
    }

    renderEvents = () => {
        let catToShow = this.state.catToShow || []

        return <FlatList
            data={catToShow}
            renderItem={this.renderItem}
            keyExtractor={item => item?.id}
            keyboardShouldPersistTaps="handled"
        />
    }


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
                title="Event Category"
            // rightComponent={this.renderRightHeader()}
            />
            <View style={{ marginHorizontal: 20 }}>
                {this.renderSearchField()}
            </View>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />
                }
                keyboardShouldPersistTaps="handled"
            >

                <View style={{ marginHorizontal: 20 }}>

                    {this.renderEvents()}
                </View>
            </KeyboardAwareScrollView>
        </ImageBackground>

    }
}

const styles = StyleSheet.create<Styles>({
    container: {
        flexGrow: 1,
        paddingBottom: 0
    }
})

const mapStateToProps = state => {
    const { eventsCategories } = state.events
    const { userData } = state.user

    return {
        eventsCategories,
        userData
    }
}

export default connect(mapStateToProps)(EventCat)