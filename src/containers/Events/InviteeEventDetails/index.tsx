import * as React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
  Pressable,
  ImageBackground,
  Dimensions,
  ScrollView,
  TextStyle,
  Image,
  Platform,
  Text,
} from 'react-native';

import TopBar from '../../../components/TopBar';
import AppText from '../../../components/UI/AppText';

import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import * as SvgIcons from '../../../assets/svg-icons';
import { moderateScale, verticalScale } from '../../../utils/scalingUnits';
import PollItem from '../../../components/PollItem';
import { connect } from 'react-redux';

import moment from 'moment';
import { inviteeEventConfirmation } from '../../../store/actionCreators';
import AppButton from '../../../components/UI/button';
import { Button } from 'react-native-elements';
import GuestCountModal from '../../../components/GuestCountModal';

type Styles = {
  container: ViewStyle;
  heading: TextStyle;
  outLineButton: ViewStyle;
};

class InviteeEventDetails extends React.Component {
  state = {
    timings: undefined,
    locations: undefined,
    showCountModal: false
  };

  componentDidMount() {
    const { data } = this.props.route.params;

    let timings = [...data.timings];
    let locations = [...data.locations];

    locations.sort((a, b) => (a.id > b.id ? 1 : -1));
    timings.sort((a, b) => (a.id > b.id ? 1 : -1));

    const dataToAddtostate = { timings, locations };

    for (let key in dataToAddtostate) {
      this.setState({ [key]: dataToAddtostate[key] });
    }
  }

  componentDidUpdate(prevProps) {
    //
    const { data } = this.props.route.params;
    if (this.props.route.params != prevProps.route.params) {
      const { timings } = data;
      const dataToAddtostate = { timings };

      for (let key in dataToAddtostate) {
        this.setState({ [key]: dataToAddtostate[key] });
      }
    }
  }

  handleLocationVote = (locationID, value) => {
    let locations = [...this.state.locations];

    let locObjTochange = locations.filter(each => each.id == locationID)[0];

    let pollings = [...locObjTochange.polling];
    let prevId = locObjTochange.polling[locObjTochange.polling.length - 1].id;

    pollings.push({
      id: prevId + 1,
      userId: 1,
      userName: 'test',
      vote: value,
    });

    locations = [
      ...locations.filter(each => each.id != locationID),
      {
        ...locObjTochange,
        polling: pollings,
      },
    ];

    // sort
    locations.sort((a, b) => (a.id > b.id ? 1 : -1));

    this.setState({ locations });
  };

  handleTimingVote = (timingId, value) => {
    let timings = [...this.state.timings];

    let timeObjTochange = timings.filter(each => each.id == timingId)[0];

    let pollings = [...timeObjTochange.polling];
    let prevId = timeObjTochange.polling[timeObjTochange.polling.length - 1].id;

    pollings.push({
      id: prevId + 1,
      userId: 1,
      userName: 'test',
      vote: value,
    });

    timings = [
      ...timings.filter(each => each.id != timingId),
      {
        ...timeObjTochange,
        polling: pollings,
      },
    ];

    // sort
    timings.sort((a, b) => (a.id > b.id ? 1 : -1));

    this.setState({ timings });
  };

  calculatePollNo = (data: Array) => {
    if (Array.isArray(data)) {
      let trueNo = data.filter(each => each.vote == 'LIKE').length;
      let falseNo = data.filter(each => each.vote == 'DISLIKE').length;
      return {
        trueNo,
        falseNo,
      };
    } else {
      return {
        trueNo: 0,
        falseNo: 0,
      };
    }
  };

  getEventCategoryName = () => {
    const { eventsCategories } = this.props;
    const { data } = this.props.route.params;

    let name;
    if (eventsCategories) {
      let nameObj = eventsCategories.filter(
        each => each.eventTypeId == data.eventTypeId,
      )[0];
      name = nameObj ? nameObj.eventTypeName : undefined;
    }

    return name;
  };

  renderPolls = () => {
    let pollDates: PollDateType[] = [];

    const { timings } = this.state;

    if (Array.isArray(timings)) {
      timings.forEach(each => {
        if (each.startTime && each.endTime) {
          pollDates.push({
            date: moment(each.slot, 'YYYY-MM-DD').toString(),
            time: {
              startTime: moment(each.startTime, 'hh:mm:ss').toString(),
              endTime: moment(each.endTime, 'hh:mm:ss').toString(),
            },
            polling: each.polling,
            // send remaining data in each time obj, for when PollDates screen returns them
            ...each,
          });
        } else {
          pollDates.push({
            date: moment(each.slot, 'YYYY-MM-DD').toString(),
            time: undefined,
            polling: each.polling,
            // send remaining data in each time obj, for when PollDates screen returns them
            ...each,
          });
        }
      });
    }

    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: verticalScale(10),
          }}>
          <Text style={styles.heading}>When do you want to come?</Text>
          {/* <Pressable
            onPress={() =>
              this.props.navigation.navigate('PollDates', {
                fromScreen: 'InviteeEventDetails',
                ...this.props.route.params,
                datesWithUniqueTimes: pollDates,
              })
            }>
            <AppText
              style={{
                color: '#00ADEF',
              }}>
              See all
            </AppText>
          </Pressable> */}
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          {pollDates.slice(0, 2).map((each, index) => {
            const even = index % 2 == 0;

            return (
              <PollItem
                containerStyle={{
                  marginRight: even ? moderateScale(6) : 0,
                }}
                key={index}
                data={each}
              //handleTimingVote={this.handleTimingVote}
              />
            );
          })}
        </View>
        <Button
          title="See all "
          containerStyle={{
            flex: 1,
            marginTop: 10,
          }}
          type="outline"
          buttonStyle={{
            padding: moderateScale(6),
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
              style={{ height: 17, width: 23 }}
              source={require('../../../assets/images/open-eye.png')}
            />
          }
          iconRight
          onPress={() => {
            this.props.navigation.navigate('PollDates', {
              fromScreen: 'InviteeEventDetails',
              ...this.props.route.params,
              datesWithUniqueTimes: pollDates,
            });
          }}
        />
        {/* <Pressable
          onPress={() =>
            this.props.navigation.navigate('PollDates', {
              fromScreen: 'InviteeEventDetails',
              ...this.props.route.params,
              datesWithUniqueTimes: pollDates,
            })
          }
          style={[
            styles.outLineButton,
            {
              borderColor: '#00ADEF',
              marginVertical: moderateScale(11),
            },
          ]}>
          <AppText
            style={{
              color: '#00ADEF',
              fontFamily: 'Mulish-ExtraBold',
            }}>
            SEE ALL
          </AppText>
        </Pressable> */}
        {/* <Pressable style={styles.outLineButton}>
                <AppText style={{
                    fontFamily: 'Mulish-ExtraBold',
                    color: '#355D9B'
                }}>Propose new date and location</AppText>
            </Pressable> */}
      </>
    );
  };

  renderLocations = () => {
    const { locations } = this.state;

    const locationsData = locations ? locations : [];

    return (
      <View
        style={{
          marginVertical: verticalScale(10)
          /* backgroundColor: '#fff',
          borderRadius: moderateScale(10),
          marginTop: moderateScale(30),
          marginBottom: moderateScale(20),
          padding: moderateScale(10), */
        }}>
        <AppText style={[styles.heading, { marginBottom: 0 }]}>Poll Locations</AppText>
        {locationsData.map((each, index) => {
          return (
            <View
              key={each.id}
              style={{
                flexDirection: 'row',
                //minHeight: moderateScale(45),
                //alignItems: 'center',
                backgroundColor: '#fff',
                borderWidth: 0.5,
                borderColor: '#ccc',
                borderRadius: moderateScale(6),
                padding: 10,
                paddingVertical: moderateScale(16),
                marginTop: moderateScale(10),
              }}>
              <Feather
                name="map-pin"
                color={"#355D9B"}
                size={moderateScale(30)}
              />
              <Text style={{ flex: 1, color: 'grey', paddingHorizontal: 7, fontFamily: "Mulish", fontSize: moderateScale(16) }}>
                {each?.name}
              </Text>
              {false && (
                <View
                  style={{
                    marginLeft: 'auto',
                    marginTop: moderateScale(9),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Pressable
                    //onPress={() => this.handleLocationVote(each.id, false)}
                    style={{ alignItems: 'center' }}>
                    <View style={{ transform: [{ rotateY: '180deg' }] }}>
                      <MaterialCommunityIcons
                        name="thumb-down"
                        style={{
                          color: '#E14F50',

                          fontSize: moderateScale(18),
                        }}
                      />
                    </View>
                    <AppText
                      style={{
                        color: '#E14F50',
                        fontFamily: 'Mulish-ExtraBold',
                      }}>
                      {this.calculatePollNo(each.polling).falseNo}
                    </AppText>
                  </Pressable>
                  <Pressable
                    //onPress={() => this.handleLocationVote(each.id, true)}
                    style={{
                      marginLeft: moderateScale(16),
                      alignItems: 'center',
                    }}>
                    <MaterialCommunityIcons
                      name="thumb-up"
                      style={{ color: '#355D9B', fontSize: moderateScale(18) }}
                    />
                    <AppText
                      style={{
                        color: '#355D9B',
                        fontFamily: 'Mulish-ExtraBold',
                      }}>
                      {this.calculatePollNo(each.polling).trueNo}
                    </AppText>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  render() {
    const { data } = this.props.route.params;

    return (
      <ImageBackground
        source={require('../../../assets/images/blurBG.png')}
        resizeMode="cover"
        imageStyle={{
          width: '100%',
          height: '100%',
        }}
        style={{
          flex: 1,
          minWidth: '100%',
          minHeight: '100%',
        }}>
        <TopBar
          style={{ backgroundColor: 'transparent' }}
          title="Event Details"
        />
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginHorizontal: moderateScale(20),
            }}>
            <AppText
              style={[
                {
                  textAlign: 'center',
                  marginBottom: moderateScale(10),
                },
                styles.heading,
              ]}>
              {data.hostName} is waiting for your acceptance...
            </AppText>
            <Image
              style={{
                resizeMode: 'cover',
                flex: 1,
                height: moderateScale(160),
                width: 'auto',
                borderRadius: moderateScale(10),
                borderColor: '#355D9B',
                borderWidth: 2.5,
              }}
              source={
                data.imagePath
                  ? { uri: data?.imagePath }
                  : require('../../../assets/images/splashscreen.png')
              }
            />
            {data.eventTypeName == 'CUSTOM' ? (
              this.renderPolls()
            ) : (
              <View style={{ marginVertical: 10 }}></View>
            )}

            <Pressable></Pressable>
            {data.eventTypeName == 'CUSTOM' && this.renderLocations()}
            <View style={styles.nameContainer}>
              <AppText style={[styles.heading]}>Event Name</AppText>
              <AppText style={[styles.smallGreyText]}>{data?.name}</AppText>
            </View>
            {data?.description && <View style={styles.nameContainer}>
              <AppText style={[styles.heading]}>Event Description</AppText>
              <AppText style={[styles.smallGreyText]}>{data?.description}</AppText>
            </View>
            }
            {/* <View
                        style={styles.nameContainer}
                    >
                        <AppText style={[styles.heading]}>Event Category</AppText>
                        <AppText style={[styles.smallGreyText]}>{this.getEventCategoryName()}</AppText>

                    </View> */}
            {data.eventTypeName != 'CUSTOM' && (
              <>
                <View
                  style={[
                    styles.nameContainer,
                    {
                      //marginBottom: 20,
                    },
                  ]}>
                  <AppText style={[styles.heading]}>{'Date & Time'}</AppText>
                  <AppText style={[styles.smallGreyText]}>
                    {moment(data.timings[0].slot).format('DD MMM[,] YYYY') +
                      (data.timings[0].startTime == null
                        ? ''
                        : moment(data.timings[0].startTime, 'hh:mm').format(
                          ' - LT',
                        ))}
                  </AppText>
                </View>
                <View
                  style={[
                    styles.nameContainer,
                  ]}>
                  <AppText style={[styles.heading]}>Location</AppText>
                  <AppText style={[styles.smallGreyText]}>
                    {data?.locations[0]?.name}
                  </AppText>
                </View>
              </>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <AppButton
                title="Decline"
                style={{ height: moderateScale(40), flex: 1 }}
                clicked={() => {
                  let obj = {
                    "eventId": data.id,
                    "responseStatus": 'DECLINED',
                    "userId": this.props.userData.id,
                    "guestCount": 0
                  }
                  inviteeEventConfirmation(obj, this.props.navigation);
                }}
              />
              <View style={{ width: 15 }}></View>
              <AppButton
                title="Accept"
                style={{ height: moderateScale(40), flex: 1 }}
                clicked={() => {
                  this.setState({ showCountModal: true })
                  /* inviteeEventConfirmation(
                    this.props.userData.id,
                    data.id,
                    'ACCEPTED',
                    this.props.navigation,
                  ); */
                }}
              />
            </View>
          </View>
        </ScrollView>
        <GuestCountModal
          showCountModal={this.state.showCountModal}
          hideModal={() => this.setState({ showCountModal: false })}
          onConfirm={(count) => {
            console.log(count)

            let obj = {
              "eventId": data.id,
              "responseStatus": 'ACCEPTED',
              "userId": this.props.userData.id,
              "guestCount": count
            }
            inviteeEventConfirmation(obj, this.props.navigation);

          }}
        />
      </ImageBackground>
    );
  }
}

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create<Styles>({
  container: {
    flexGrow: 1,
    paddingBottom: moderateScale(50),
  },
  nameContainer: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(6),
    marginBottom: verticalScale(10),
    minHeight: moderateScale(60),
    padding: moderateScale(12),
    justifyContent: 'space-around',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  heading: {
    fontFamily: 'Mulish-Bold',
    color: '#355D9B',
    fontSize: moderateScale(15.5),
    marginBottom: moderateScale(10),
  },
  smallGreyText: {
    color: '#88879C',
    fontSize: moderateScale(13),
  },
  //
  outLineButton: {
    borderRadius: moderateScale(10),
    borderColor: 'rgba(53, 93, 155, 1)',
    minHeight: moderateScale(42),
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(8),
  },
});

const mapStateToProps = state => {
  const { eventsCategories } = state.events;
  const { userData } = state.user;
  return {
    eventsCategories,
    userData,
  };
};

export default connect(mapStateToProps)(InviteeEventDetails);
