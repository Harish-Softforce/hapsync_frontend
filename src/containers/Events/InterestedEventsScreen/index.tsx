import * as React from 'react'
import {
   View,
   ScrollView,
   ViewStyle,
   StyleSheet,
   TextStyle,
   RefreshControl,
   ImageBackground
} from 'react-native';

import TopBar from '../../../components/TopBar'

import { moderateScale } from '../../../utils/scalingUnits';
import { getEvents } from '../../../store/actionCreators';
import { connect } from 'react-redux';
import UpcomingItem from '../../../components/Events/UpcomingItem';
import InterestedItem from '../../../components/Events/InterestedItem';

type Styles = {
   container: ViewStyle,
   heading: TextStyle
}

class InterestedEventsScreen extends React.Component {
   state = {
      refreshing: false
   }


   onRefresh = async () => {
      this.setState({ refreshing: true })
      await getEvents(this.props.userData.id, true)
      this.setState({ refreshing: false })
   }

   renderInterestedEvents = () => {

      let data = []
      const { interested, upcomingEvents } = this.props;

      if (this.props.route.params.itemType == "interested") {
         data = interested ? [...interested] : []
      } else if (this.props.route.params.itemType == "upcoming") {
         data = upcomingEvents ? [...upcomingEvents] : []
      }

      return <View style={{
         // flexDirection: 'row'
      }}>
         {data.map((each, index) => {
            return <InterestedItem
               key={index}
               data={each}
               containerStyle={{
                  ...(index == 0 && { marginRight: 3 })
               }}
            />
         })}
      </View>
   }


   render() {
      let data = []
      let title = ""

      const { interested, upcomingEvents } = this.props;

      if (this.props.route.params.itemType == "interested") {
         data = interested ? [...interested] : []
         title = "Interested (" + data.length + ")"

      } else if (this.props.route.params.itemType == "upcoming") {
         data = upcomingEvents ? [...upcomingEvents] : []
         title = "Upcoming Events (" + data.length + ")"
      }

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
            title={title}
            style={{
               backgroundColor: 'transparent'
            }}
         />
         <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
               <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
               />
            }
         >
            <View style={{ marginHorizontal: moderateScale(20) }}>
               {this.renderInterestedEvents()}
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
      fontSize: moderateScale(16),
      fontFamily: 'Mulish-ExtraBold',
      color: '#355D9B',
      marginBottom: moderateScale(11)
   }
})

const mapStateToProps = state => {
   const { interested, upcomingEvents } = state.events;
   const { userData } = state.user

   return {
      interested,
      userData,
      upcomingEvents
   }
}

export default connect(mapStateToProps)(InterestedEventsScreen)