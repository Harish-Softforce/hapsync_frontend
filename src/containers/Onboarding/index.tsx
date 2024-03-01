import * as React from 'react';
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  ViewStyle,
  Pressable,
} from 'react-native';

import Carousel, { Pagination } from 'react-native-snap-carousel';

import Text from '../../components/UI/AppText'

type Props = {
  name: string;
};

type State = {
  activeSlide: number;
  entries: { title: string, desc: string, image: any }[]
};

type Styles = {
  container: ViewStyle;
  slide: ViewStyle;
};

class Onboarding extends React.Component<Props, State> {
  state: State = {
    activeSlide: 0,
    entries: [
      {
        title: 'create event',
        desc: 'Plan your birthdays, graduations, meetup, potlucks, dance production, non profit fund raising events, collaborate with volunteers, service providers for the event to smoothly execute the plan.',
        image: require("../../assets/images/onboard.png")
      },
      {
        title: 'GROUP CHAT',
        desc: 'Chat with invitees, guests or service providers to communicate updates or finalize service providers for the event.',
        image: require("../../assets/images/onboard2.png")
      },
      {
        title: 'BUDGET',
        desc: 'Plan your event budget and track the allocated budget how it is spent across event activities.',
        image: require("../../assets/images/onboard3.png")
      }
    ]
  };

  renderSlideItem = ({ item, index }) => {
    return <View style={styles.slide} >
      <Image
        style={{
          resizeMode: 'contain',
          marginBottom: 70
        }}
        source={item.image}
      />
      <Text
        style={{
          textTransform: "uppercase",
          fontSize: 20,
          color: 'rgba(53, 93, 155, 1)',
          fontWeight: "bold",
          marginBottom: 12
        }}
      >{item.title}</Text>
      <Text
        style={{
          fontSize: 16,
          color: 'rgba(53, 93, 155, 0.8)',
          fontWeight: "300",
          textAlign: 'center'
        }}
      >{item.desc}</Text>
    </View>
  }

  get pagination() {
    const { entries, activeSlide } = this.state;

    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginHorizontal: 35,
      }}>
        <Pressable
          onPress={() => {
            //this.props.navigation.navigate("TourScreen")
            this.props.navigation.navigate("LoginScreen")
          }}
        >
          <Text
            style={[{
              fontSize: 15,
              color: 'rgba(53, 93, 155, 1)',
              fontFamily: "Mulish-ExtraBold",
            }]}
          >
            SKIP
          </Text>
        </Pressable>
        <Pagination
          dotsLength={entries.length}
          activeDotIndex={activeSlide}
          containerStyle={{ backgroundColor: '#FFFBFB', }}
          dotStyle={{
            width: 23,
            height: 8,
            borderRadius: 5,
            marginHorizontal: 1,
            backgroundColor: 'rgba(53, 93, 155, 1)'
          }}
          inactiveDotStyle={{
            width: 10,
            height: 10,
            marginHorizontal: 1,
            backgroundColor: 'rgba(53, 93, 155, 0.15)'
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.85}
        />
        <Pressable
          onPress={() => {
            activeSlide < 2 ? this._carousel.snapToNext() : this.props.navigation.navigate("LoginScreen")//this.props.navigation.navigate("TourScreen")
          }}
        >
          <Text
            style={[{
              fontSize: 15,
              color: 'rgba(53, 93, 155, 1)',
              fontFamily: "Mulish-ExtraBold",
            }]}
          >
            NEXT
          </Text>
        </Pressable>
      </View>
    );
  }

  render() {

    return <View style={styles.container}>
      <Carousel
        ref={(c) => { this._carousel = c; }}
        loop={false}
        data={this.state.entries}
        renderItem={this.renderSlideItem}
        sliderWidth={deviceWidth}
        itemWidth={deviceWidth}
        onSnapToItem={(index) => this.setState({ activeSlide: index })}
      />
      {this.pagination}
    </View>;
  }
}

const deviceWidth = Dimensions.get("window").width

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#FFFBFB',
  },
  slide: {
    alignItems: 'center',
    paddingHorizontal: 35,
    justifyContent: 'center',
    flex: 1
  }
});

export default Onboarding;
