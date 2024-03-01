import * as React from 'react'
import {
   View,
   ScrollView,
   ViewStyle,
   StyleSheet,
   TextStyle,
   Pressable,
   Dimensions,
   RefreshControl,
   Text,
   ImageBackground
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import TopBar from '../../components/TopBar'
import { moderateScale } from '../../utils/scalingUnits';
import { getEvents } from '../../store/actionCreators';
import { connect } from 'react-redux';
import Config from 'react-native-config'
import InterestedItem from '../../components/Events/InterestedItem';
import RecommendedItem from '../../components/Events/RecommendedItem';

type Styles = {
   container: ViewStyle,
   heading: TextStyle
}

class VendorDashboard extends React.Component {

   state = {
      refreshing: false
   }

   componentDidMount() {
      const { userData } = this.props
      getEvents(userData.id, true)

      this.timer = setInterval(() => getEvents(userData.id, false), parseInt(Config.TIMER));
   }

   componentWillUnmount() {
      clearInterval(this.timer)
   }

   onRefresh = () => {
      const { userData } = this.props
      getEvents(userData.id, true)
   }

   renderUpcomingEvents = () => {

      const { upcomingEvents, } = this.props;

      let data = upcomingEvents ? [...upcomingEvents] : []

      return <View style={{
         // flexDirection: 'row'
      }}>
         {data.slice(0, 5).map((each, index) => {
            return <View
               key={each.id}
            >
               <InterestedItem
                  key={index}
                  data={each}
                  containerStyle={{
                     ...(index == 0 && { marginRight: 3 })
                  }}
               />
               {index == 4 &&
                  <Pressable
                     onPress={() => {
                        this.props.navigation.navigate("InterestedEventsScreen", {
                           itemType: "upcoming"
                        })
                     }}
                     style={{
                        marginLeft: 'auto'
                     }}>
                     <Text style={[styles.heading, { fontSize: 14 }]}>See all</Text>
                  </Pressable>
               }
            </View>
         })}
      </View>
   }

   renderInterestedEvents = () => {

      const { interested } = this.props;

      let data = interested ? [...interested] : []

      return <View style={{
         // flexDirection: 'row'
      }}>
         {data.slice(0, 5).map((each, index) => {
            return <View
               key={each.id}
            >
               <InterestedItem
                  key={index}
                  data={each}
                  containerStyle={{
                     ...(index == 0 && { marginRight: 3 })
                  }}
               />
               {index == 4 &&
                  <Pressable
                     onPress={() => {
                        this.props.navigation.navigate("InterestedEventsScreen", {
                           itemType: "interested"
                        })
                     }}
                     style={{
                        marginLeft: 'auto'
                     }}>
                     <Text style={[styles.heading, { fontSize: 14 }]}>See all</Text>
                  </Pressable>
               }
            </View>
         })}
      </View>
   }



   render() {

      return <ImageBackground
         source={require("../../assets/images/blurBG.png")}
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
            title="Home"
            leftComponent={<></>}
            style={{
               backgroundColor: 'transparent'
            }}
         />
         <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
               <RefreshControl
                  refreshing={this.props.isLoading}
                  onRefresh={this.onRefresh}
               />
            }
         >
            <View style={{ marginHorizontal: moderateScale(20) }}>
               <Text
                  style={styles.heading}
               >Upcoming Events ({this.props.upcomingEvents.length})</Text>
               {this.renderUpcomingEvents()}
            </View>

            <View style={{ marginHorizontal: moderateScale(20) }}>
               <Text
                  style={styles.heading}
               >Interested ({this.props.interested.length})</Text>
               {this.renderInterestedEvents()}
            </View>

            <View style={{ marginHorizontal: moderateScale(20) }}>
               <Text
                  style={styles.heading}
               >Recommended Events ({this.props.recommendedEvents?.length})</Text>

               <Carousel
                  ref={(c) => { this._carousel = c; }}
                  data={this.props.recommendedEvents ? this.props.recommendedEvents : []}
                  renderItem={({ item }) => <RecommendedItem
                     data={item}
                     containerStyle={{ marginRight: moderateScale(6) }}
                  />}
                  sliderWidth={deviceWidth}
                  itemWidth={deviceWidth / 2}
                  contentContainerCustomStyle={{ paddingBottom: moderateScale(10) }}
                  activeSlideAlignment="start"
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={1}
               />
            </View>

         </ScrollView>
      </ImageBackground>
   }
}

const styles = StyleSheet.create<Styles>({
   container: {
      flexGrow: 1,
      //backgroundColor: '#FFFBFB',
      paddingBottom: 30
   },
   heading: {
      fontSize: moderateScale(18),
      fontFamily: 'Mulish-ExtraBold',
      color: '#355D9B',
      marginBottom: moderateScale(11)
   }
})

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const mapStateToProps = state => {

   const { upcomingEvents, interested, recommendedEvents, isLoading } = state.events;
   const { userData } = state.user

   return {
      upcomingEvents,
      interested,
      recommendedEvents,
      isLoading,
      userData,
   }
}

export default connect(mapStateToProps)(VendorDashboard)