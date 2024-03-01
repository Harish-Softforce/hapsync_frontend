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
   Text,
   Platform,
   FlatList,
} from 'react-native';

import TopBar from '../../../components/TopBar';
import AppText from '../../../components/UI/AppText';

import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import * as SvgIcons from '../../../assets/svg-icons';
import { moderateScale, verticalScale } from '../../../utils/scalingUnits';
import PollItem from '../../../components/PollItem';
import AppButton from '../../../components/UI/button';
import { addEvent } from '../../../store/actionCreators';
import moment from 'moment';

import { VoteTimeItem, VoteDateItem } from '../../VoteScreen';
import { connect } from 'react-redux';

import CustomModal from '../../../components/CustomModal';
import { Button } from 'react-native-elements';

type Styles = {
   container: ViewStyle;
   heading: TextStyle;
};

export type PollDateType = {
   date: Date;
   time: any;
};

class HostEventConfirm extends React.Component {
   state = {
      defaultImage: undefined,
      selectedImage: undefined,
      eventTypeId: undefined,
      selectedCategory: undefined,
      //
      selectedDate: undefined,
      selectedStartTime: undefined,
      selectedEndTime: undefined,
      //
      eventName: undefined,
      description: "",
      location: {
         loc: undefined,
         lat: undefined,
         lng: undefined,
      },
      // set from vote screen
      votedDates: undefined,
      votedLocations: [],
      //
      guests: [],
      activities: [],
      //

      showModal: false,
   };

   componentDidMount() {
      if (this.props.route.params) {
         const {
            selectedImage,
            defaultImage,
            eventTypeId,
            selectedCategory,
            eventName,
            description,
            location,
            votedDates,
            selectedDate,
            selectedStartTime,
            selectedEndTime,
            guests,
            votedLocations,
            activities
         } = this.props.route.params;

         this.setState({
            selectedImage,
            defaultImage,
            eventTypeId,
            selectedCategory,
            eventName,
            description,
            location,
            votedDates,
            selectedDate,
            selectedEndTime,
            selectedStartTime,
            guests,
            votedLocations,
            activities
         });
      }
   }

   getCategoryIdFromName = name => {
      const { eventsCategories } = this.props;

      let id;
      if (eventsCategories) {
         let nameObj = eventsCategories.filter(
            each => each.eventTypeName == name,
         )[0];
         id = nameObj ? nameObj.eventTypeId : undefined;
      }

      return id;
   };

   getCategoryImageFromName = name => {
      const { eventsCategories } = this.props;

      let imagePath;
      if (eventsCategories) {
         let nameObj = eventsCategories.filter(
            each => each.eventTypeName == name,
         )[0];

         imagePath = nameObj ? nameObj.eventTypeImageURL : undefined;
      }

      return imagePath;
   };

   renderRightHeader = () => {
      return (
         <Pressable
            style={{
               transform: [{ scale: moderateScale(1) }],
            }}>
            <SvgIcons.SettingsIcon />
         </Pressable>
      );
   };

   /** custom event unique contents start */
   renderTimingsPolls = () => {
      let disableMainScreenDates: boolean =
         this.props.route.params?.disableMainScreenDates;

      const {
         votedDates,
         selectedStartTime,
         selectedDate,
         selectedEndTime,
         selectedCategory,
      } = this.state;

      if (selectedCategory?.toLowerCase() !== 'custom') {
         return;
      }

      let datesWithUniqueTimes: PollDateType[] = [];

      if (votedDates) {
         let parsedDates = JSON.parse(votedDates);

         for (let dateKey in parsedDates) {
            if (!parsedDates[dateKey]['times']) {
               // if no time key, push like that
               datesWithUniqueTimes.push(parsedDates[dateKey]);
            } else {
               // if time key is available , loop through each
               for (let timeKey in parsedDates[dateKey]['times']) {
                  // push each into the unique array but with a "time" key this time

                  delete parsedDates[dateKey]['times'][timeKey]['showEndTimePicker'];
                  delete parsedDates[dateKey]['times'][timeKey][
                     'showStartTimePicker'
                  ];

                  datesWithUniqueTimes.push({
                     ...parsedDates[dateKey], //get other contents
                     times: undefined, // remove times content,
                     time: {
                        ...parsedDates[dateKey]['times'][timeKey],
                     },
                     // empty polling
                     polling: [],
                  });
               }
            }
         }
      }

      let dateTodisplay = [...datesWithUniqueTimes];

      // append the date selected on main create screen
      // then show voted dates after it

      if (!disableMainScreenDates) {
         dateTodisplay = [
            {
               date: selectedDate,
               time: {
                  startTime: selectedStartTime,
                  endTime: selectedEndTime,
               },
            },
            // other voted dates
            ...datesWithUniqueTimes,
         ];
      }

      return (
         <>
            <View
               style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: moderateScale(5),
                  //marginBottom: moderateScale(16)
               }}>
               <Text style={[styles.heading, {}]}>{'Poll Dates'}</Text>
            </View>
            <View
               style={{
                  flexDirection: 'row',
                  marginHorizontal: -8,
               }}>
               {
                  <FlatList
                     data={dateTodisplay.slice(0, 2)}
                     numColumns={2}
                     renderItem={({ item }) => (
                        <PollItem
                           data={item}
                           containerStyle={{
                              //marginBottom: moderateScale(8),
                              flex: 0.5,
                              marginHorizontal: moderateScale(4),
                           }}
                        />
                     )}
                     keyExtractor={(item, index) => index}
                     contentContainerStyle={{ padding: 3 }}
                  />
               }
            </View>
            <Button
               title={
                  //'See all '
                  "See all " + "(" + dateTodisplay.length + ")  "
               }
               containerStyle={{
                  flex: 1,
                  //marginHorizontal: 10,
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
               onPress={() =>
                  this.props.navigation.navigate('PollDates', {
                     ...this.props.route.params,
                     datesWithUniqueTimes: dateTodisplay,
                     fromScreen: 'HostEventConfirm',
                  })
               }
            />

            {/* <Button
            tit
            onPress={() => this.props.navigation.navigate("PollDates", {
                ...this.props.route.params,
                datesWithUniqueTimes: dateTodisplay,
                fromScreen: 'HostEventConfirm'
            })}>
                <AppText style={{
                    color: '#00ADEF'
                }}>See all {"("+dateTodisplay.length+")"}</AppText>
            </Pressable> */}
         </>
      );
   };

   renderLocationsPolls = () => {
      let { location, selectedCategory } = this.state;
      let locationToDisplay = { ...this.state.votedLocations };

      if (selectedCategory?.toLowerCase() !== 'custom') {
         return;
      }

      // add the initial location
      let key = Math.floor(10000 * Math.random());
      let ObjKeys = Object.keys(locationToDisplay);

      if (location?.loc) {
         // add location from main create screen to the object of votedLocations
         locationToDisplay[key] = location;

         // sort to make location on main screen first
         ObjKeys.pop(key);
         ObjKeys = [[key], ...ObjKeys];
      }

      return (
         <View
            style={{
               //backgroundColor: '#fff',
               borderRadius: moderateScale(10),
               marginVertical: moderateScale(15),
            }}>
            <Text style={[styles.heading, { marginBottom: 0 }]}>
               {'Poll Locations'}
            </Text>
            {ObjKeys.map((key, index) => {
               return (
                  <View
                     key={key}
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
                        marginTop: moderateScale(15),
                     }}>
                     <Feather
                        name="map-pin"
                        color={'#355D9B'}
                        size={moderateScale(30)}
                     />
                     <Text
                        style={{
                           flex: 1,
                           color: 'grey',
                           paddingHorizontal: 7,
                           fontFamily: 'Mulish',
                           fontSize: moderateScale(16),
                        }}>
                        {locationToDisplay[key].loc}
                     </Text>
                     {/* <AppText style={{ flex: 0.8, color: '#88879C' }}>
                        {locationToDisplay[key].loc}
                    </AppText> */}
                     {/* {false && <View
                        style={{
                            marginLeft: 'auto',
                            marginTop: moderateScale(9),
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                        <View style={{ alignItems: 'center' }}>
                            <View style={{ transform: [{ rotateY: '180deg' }], }}>
                                <MaterialCommunityIcons
                                    name="thumb-down"
                                    style={{
                                        color: '#E14F50',

                                        fontSize: moderateScale(18)
                                    }}
                                />
                            </View>
                            <AppText style={{
                                color: '#E14F50',
                                fontFamily: 'Mulish-ExtraBold'
                            }}>0</AppText>
                        </View>
                        <View style={{ marginLeft: moderateScale(16), alignItems: 'center' }}>
                            <MaterialCommunityIcons
                                name="thumb-up"
                                style={{ color: '#355D9B', fontSize: moderateScale(18) }}
                            />
                            <AppText style={{
                                color: '#355D9B',
                                fontFamily: 'Mulish-ExtraBold'
                            }}>0</AppText>

                        </View>
                    </View>
                    } */}
                  </View>
               );
            })}
         </View>
      );
   };
   /** custom event unique content ends */

   /** non custom event unique content starts */
   renderEventTime = () => {
      const {
         votedDates,
         selectedStartTime,
         selectedDate,
         selectedEndTime,
         selectedCategory,
      } = this.state;

      if (selectedCategory?.toLowerCase() === 'custom') {
         return;
      }

      return (
         <View style={[styles.nameContainer]}>
            <AppText style={[styles.heading]}>{'Date & Time'}</AppText>
            <AppText style={[styles.smallGreyText]}>
               {moment(selectedDate).format('DD MMM[,] YYYY')}{' '}
            </AppText>
            <AppText style={[styles.smallGreyText]}>
               {moment(selectedStartTime).format('hh:mm A')} -{' '}
               {moment(selectedEndTime).format('hh:mm A')}{' '}
            </AppText>
         </View>
      );
   };

   renderEventLocation = () => {
      const { location, selectedCategory } = this.state;

      if (selectedCategory?.toLowerCase() === 'custom') {
         return;
      }

      return (
         <View style={styles.nameContainer}>
            <AppText style={[styles.heading]}>Location</AppText>
            <AppText style={[styles.smallGreyText]}>{location.loc} </AppText>
         </View>
      );
   };
   /** non custom event unique content ends */

   /***
    * GUEST LOGIC
    */
   onRemoveFromGuest = contact => {
      let guests = [...this.state.guests];

      const isGuest = this.isPartofGuests(contact);

      if (isGuest) {
         guests = guests.filter(each => {
            return each.id !== contact.id;
         });
      }

      this.setState({ guests });
   };

   isPartofGuests = contact => {
      let guests = [...this.state.guests];

      let match = guests.filter(each => {
         return each.id == contact.id;
      });

      if (match.length > 0) {
         return true;
      } else {
         return false;
      }
   };

   renderGuests = () => {
      const { guests } = this.state;

      return (
         <View
            style={{
               backgroundColor: '#fff',
               borderRadius: moderateScale(10),
               //marginTop: moderateScale(30),
               //marginBottom: moderateScale(20),
               padding: moderateScale(10),
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
            }}>
            <View
               style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: moderateScale(5),
                  backgroundColor: 'rgba(238, 215, 255, 0.27)',
               }}>
               <Text style={[styles.heading, { marginHorizontal: 5 }]}>Guests</Text>
               <Pressable
                  onPress={() =>
                     this.props.navigation.navigate('InviteFriend', {
                        ...this.props.route.params,
                        guests,
                     })
                  }>
                  <MaterialCommunityIcons
                     name="plus"
                     style={{
                        color: 'black',
                        fontSize: moderateScale(23),
                     }}
                  />
               </Pressable>
            </View>
            {guests &&
               guests.map((each, index) => {
                  return (
                     <View
                        key={each.id}
                        style={{
                           flexDirection: 'row',
                           //height: moderateScale(65),
                           padding: moderateScale(15),
                           alignItems: 'center',
                           borderBottomWidth: guests.length == index + 1 ? 0 : 0.5,
                           borderColor: '#cccccc',
                        }}>
                        <Image
                           style={{
                              width: moderateScale(52),
                              height: moderateScale(52),
                              borderRadius: moderateScale(27),
                              borderWidth: 0.5,
                              borderColor: 'black',
                           }}
                           source={
                              each.imageUrl
                                 ? {
                                    uri: each.imageUrl,
                                 }
                                 : require('../../../assets/images/event.png')
                           }
                        />
                        <View
                           style={{
                              flex: 0.6,
                              paddingLeft: moderateScale(10),
                           }}>
                           <AppText
                              style={{ fontSize: moderateScale(15), color: '#355D9B' }}>
                              {each.givenName}
                           </AppText>
                           <AppText
                              style={{
                                 fontSize: moderateScale(12),
                                 color: '#88879C',
                              }}>
                              {each.phoneNumber}
                           </AppText>
                        </View>
                        <Pressable
                           style={{
                              marginLeft: 'auto',
                              borderRadius: moderateScale(40),
                              borderStyle: 'dotted',
                              borderWidth: 1,
                              borderColor: '#E14F50',
                           }}
                           onPress={() => this.onRemoveFromGuest(each)}>
                           <MaterialCommunityIcons
                              name="minus"
                              style={{
                                 color: '#E14F50',
                                 fontSize: moderateScale(23),
                              }}
                           />
                        </Pressable>
                     </View>
                  );
               })}
         </View>
      );
   };

   submit = () => {
      const {
         votedDates,
         votedLocations,
         defaultImage,
         location,
         guests,
         eventTypeId,
         selectedCategory,
         //
         selectedDate,
         selectedEndTime,
         selectedStartTime,
         selectedImage,
         activities
      } = this.state;

      let disableMainScreenDates: boolean =
         this.props.route.params?.disableMainScreenDates;

      let locationsAPidata = [];
      let timingsApidata = [];
      let inviteesApiData = [];

      //
      // LOCATIONS
      // let allLocations = { ...votedLocations }

      // // add the initial location
      // let key = Math.floor(10000 * Math.random())
      // allLocations[key] = location
      if (!votedLocations || Object.keys(votedLocations).length == 0) {
         locationsAPidata = [
            {
               name: location.loc,
               preference: 1,
               vote: 'PENDING',
               latitude: location.lat,
               longitude: location.lng,
            },
         ]
      } else {
         locationsAPidata = Object.keys(votedLocations).map(locationKey => ({
            name: votedLocations[locationKey].loc,
            preference: 1,
            vote: 'PENDING',
            latitude: votedLocations[locationKey].lat,
            longitude: votedLocations[locationKey].lng,
         }))
      }

      // //
      // // TIMINGS

      // push time from main create event screen
      if (!disableMainScreenDates) {
         timingsApidata.push({
            slot: moment(selectedDate).format('YYYY-MM-DD'),
            startTime: moment(selectedStartTime).format('HH:mm'),
            endTime: moment(selectedEndTime).format('HH:mm'),
            preference: 1,
            vote: 'PENDING',
         });
      }

      if (votedDates) {
         let parsedDates: { [key: string | number]: VoteDateItem } =
            JSON.parse(votedDates);

         for (let dateKey in parsedDates) {
            if (!parsedDates[dateKey]['times']) {
               // if no time key, push like that
               timingsApidata.push({
                  slot: moment(parsedDates[dateKey]['date']).format('YYYY-MM-DD'),
                  startTime: null,
                  endTime: null,
                  preference: 1,
                  vote: 'PENDING',
               });
               // timingsApidata.push(parsedDates[dateKey])
            } else {
               //console.log(" parsedDates[dateKey] ", parsedDates[dateKey])
               // if time key is available , loop through each
               for (let timeKey in parsedDates[dateKey]['times']) {
                  // push each into the unique array but with a "time" key this time

                  delete parsedDates[dateKey]['times'][timeKey]['showEndTimePicker'];
                  delete parsedDates[dateKey]['times'][timeKey][
                     'showStartTimePicker'
                  ];

                  timingsApidata.push({
                     slot: moment(parsedDates[dateKey]['date']).format('YYYY-MM-DD'),
                     startTime: moment(
                        parsedDates[dateKey]['times'][timeKey].startTime,
                     ).format('HH:mm'),
                     endTime: moment(
                        parsedDates[dateKey]['times'][timeKey].endTime,
                     ).format('HH:mm'),
                     preference: 1,
                     vote: 'PENDING',
                  });
               }
            }
         }
      }

      // //
      // // INVITEES

      inviteesApiData = guests.map((guest, index) => {
         // let num=guest.phoneNumbers[0].number.replace(/\D/g, "")
         // let phoneNo=num.substr(num.length - 10)

         return {
            userId: guest.guestId,
            // "email": "test@test.com",
            countryCode: guest.countryCode,
            phone: guest.phoneNumber,
            name: guest.givenName
         };

         // return {
         //     "user": {
         //         "id": index + 1,
         //         "phone": guest.phoneNumbers[0].number,
         //         "name": guest.displayName
         //     },
         //     "response": "PENDING"
         // }
      });

      let data = {
         name: this.state.eventName,
         description: this.state.description,
         eventTypeId: eventTypeId,
         userId: this.props.userData.id,
         date: moment(this.state.selectedDate).format('YYYY-MM-DD'),
         // "location": this.state.location,
         createdDate: moment(this.state.selectedDate).format('YYYY-MM-DD'),
         owner: this.props.userData.id,
         invitees: [...inviteesApiData],
         locations: [...locationsAPidata],
         timings: [...timingsApidata],
         pollingStatus: selectedCategory == 'CUSTOM' ? 'PROGRESS' : undefined,
         imagePath: defaultImage,
         imageFileName: null,
         activities: activities
      };
      //console.log(data)
      //return

      /* if(!selectedImage){
              if(this.getCategoryImageFromName(selectedCategory)){
                  data["imagePath"] = this.getCategoryImageFromName(selectedCategory)
              }
          } */

      // console.log('eventRequest : ', JSON.stringify(data))
      //let formData = new FormData()
      // formData.append('eventRequest', JSON.stringify(data))
      // if (selectedImage) {
      //     formData.append('file', {
      //         uri: selectedImage.uri,
      //         name: selectedImage.fileName,
      //         type: selectedImage.type,
      //     })
      // }
      // passed the navigation to addEvent function
      addEvent(data, selectedImage, eventId => {
         console.log(' Created Event ' + eventId);
         this.props.navigation.navigate('HomeScreen');

         this.props.navigation.navigate('EventTabs', {
            data: { id: eventId },
            showConfirmModal: true,
         });
         //this.setState({ eventId: eventId, showModal: true })
      });
   };

   render() {
      const { selectedImage, defaultImage, eventName, description, selectedCategory } =
         this.state;

      return (
         <>
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
                  title="Event Summary"
               //rightComponent={this.renderRightHeader()}
               />
               <ScrollView contentContainerStyle={styles.container}>
                  <View
                     style={{
                        marginHorizontal: moderateScale(15),
                     }}>
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
                           selectedImage
                              ? {
                                 uri: selectedImage?.path,
                              }
                              : defaultImage
                                 ? {
                                    uri: defaultImage,
                                 }
                                 : require('../../../assets/images/splashscreen.png')
                        }
                     />
                     <View
                        style={[
                           styles.nameContainer,
                           {
                              marginTop: verticalScale(10),
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                           },
                        ]}>
                        <View>
                           <Text style={[styles.heading]}>Event Name</Text>
                           <Text style={[styles.smallGreyText]}>{eventName}</Text>
                        </View>
                        <View>
                           {/* <Image
                    style={{
                      height: moderateScale(45),
                      width: moderateScale(45),
                    }}
                    source={require('../../../assets/images/birthday-cake.png')}
                  /> */}
                        </View>
                     </View>
                     <View
                        style={[
                           styles.nameContainer,
                        ]}>
                        <View>
                           <Text style={[styles.heading]}>Event Description</Text>
                           <Text style={[styles.smallGreyText]}>{description}</Text>
                        </View>
                     </View>

                     {this.renderTimingsPolls()}
                     {this.renderLocationsPolls()}

                     {this.renderEventLocation()}
                     {this.renderEventTime()}

                     {/* <View
                        style={styles.nameContainer}
                    >
                        <AppText style={[styles.heading]}>Event Category</AppText>
                        <AppText style={[styles.smallGreyText]}>{selectedCategory}</AppText>

                    </View> */}
                     {this.renderGuests()}

                  </View>
               </ScrollView>
               <View
                  style={{
                     marginHorizontal: moderateScale(15),
                  }}>
                  <Button
                     title="Host Event"
                     containerStyle={
                        {
                           //flex: 1
                        }
                     }
                     buttonStyle={{
                        height: moderateScale(45),
                        padding: 4,
                        borderRadius: moderateScale(6),
                        //elevation: 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: moderateScale(13),
                        backgroundColor: '#355D9B',
                     }}
                     titleStyle={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontFamily: 'Mulish',
                        fontSize: moderateScale(18),
                     }}
                     onPress={() =>
                        this.submit()
                     }
                  />
               </View>
            </ImageBackground>
            {/* this.state.showModal &&
                <CustomModal
                    displayMessage={"Event Added successfully"}
                    showModal={this.state.showModal}
                    okHandler={() => {
                        this.setState({ showModal: false })
                        this.props.navigation.navigate('HomeScreen')

                        this.props.navigation.navigate("EventTabs", {
                            data: { id: this.state.eventId },
                            showConfirmModal: true
                        })
                    }} /> */}
         </>
      );
   }
}

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create<Styles>({
   container: {
      flexGrow: 1,
      paddingBottom: moderateScale(10),
   },
   heading: {
      fontFamily: 'Mulish-ExtraBold',
      color: '#355D9B',
      fontSize: moderateScale(15.5),
      marginBottom: moderateScale(5),
   },
   smallGreyText: {
      color: '#88879C',
      fontSize: moderateScale(13),
   },
   nameContainer: {
      backgroundColor: '#fff',
      borderRadius: moderateScale(10),
      marginBottom: moderateScale(11),
      //height: moderateScale(100),
      padding: moderateScale(15),
      //justifyContent: 'space-around',
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
});

const mapStateToProps = state => {
   const { eventsCategories } = state.events;
   //const eventCategoryState = eventsApi.endpoints.getEventCategories.select()(state)

   const { userData } = state.user;

   return {
      eventsCategories,
      userData,
   };
};

export default connect(mapStateToProps)(HostEventConfirm);
