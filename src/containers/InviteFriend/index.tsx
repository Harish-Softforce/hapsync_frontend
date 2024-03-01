import * as React from 'react';
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  ScrollView,
  ViewStyle,
  Dimensions,
  Pressable,
  PermissionsAndroid,
  Platform,
  TextStyle,
  TextInput,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
} from 'react-native';

import TopBar from '../../components/TopBar';
import AppButton from '../../components/UI/button';
import { moderateScale, verticalScale } from '../../utils/scalingUnits';

import * as SvgIcons from '../../assets/svg-icons';

import Contacts from 'react-native-contacts';

import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from '../../axios';
import { connect } from 'react-redux';
import { updateEvent } from '../../store/actionCreators';
import { Button } from 'react-native-elements';

type Styles = {
  container: ViewStyle;
  sourceSelector: ViewStyle;
  inputWrapper: TextStyle;
};

type Props = {};

enum Sources {
  'contacts',
  'hapsync',
}

type State = {
  selectedSource: Sources;
};
let inc = 1;

class InviteFriend extends React.Component<Props, State> {
  state: State = {
    selectedSource: 'contacts',
    //
    contacts: [],
    hapsyncContacts: [],
    filteredContacts: [],
    filteredHapsyncContacts: [],
    match: undefined,
    //
    guests: [],
    permissionDenied: true,
  };

  componentDidMount() {
    this.getDeviceContacts();
    this.getAllHapsyncUsers();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.match !== prevState.match) {
      this.filterContacts();
    }
    if (
      this.state.selectedSource !== prevState.selectedSource ||
      this.state.match !== prevState.match
    ) {
      this.filterHapsyncContacts();
    }
    if (this.props.route.params !== prevProps.route.params) {
      if (this.props.route.params.guests) {
        this.setState({ guests: this.props.route.params.guests });
      }
    }
  }

  getAllHapsyncUsers = async () => {
    await axios
      .get('/user/' + this.props.userData.id + '/hapSyncContacts')
      .then(res => {
        //console.log(res.data);
        let arr = [];
        res.data.map(item => {
          arr.push({
            userId: item.id,
            givenName: item.name,
            phoneNumber: item.phone,
            id: ++inc,
            imageUrl: item.imageUrl,
          });
        });
        //console.log(arr)
        this.setState({ hapsyncContacts: arr });
      })
      .catch(err => {
        console.log(err);
      });
  };

  getDeviceContacts = () => {
    if (Platform.OS == 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Please accept',
      })
        .then(permissions => {
          if (permissions == 'granted') {
            this.setState({ permissionDenied: false });
            Contacts.getAll()
              .then(contacts => {
                // this.setState({ contacts })
                this.getContactsWithUniqueNums(contacts);
              })
              .catch(e => console.log(e));
          } else {
            this.setState({ permissionDenied: true });
            return;
          }
        })
        .catch(e => console.log(e));
    } else {
      Contacts.getAll()
        .then(contacts => {
          this.getContactsWithUniqueNums(contacts);
          this.setState({ permissionDenied: false });
        })
        .catch(e => {
          console.log(e);
          this.setState({ permissionDenied: true });
        });
      /*  Contacts.checkPermission().then(permission => {
                 if (permission === 'authorized') {
                     // yay!
                     this.setState({ permissionDenied: false })
                     Contacts.getAll()
                         .then(contacts => {
                             this.getContactsWithUniqueNums(contacts)
                         }).catch(e => {
                             console.log(e)
                         })
                 } else {
                     
                 }
             }) */
    }
  };

  getContactsWithUniqueNums = (data: []) => {
    if (data.length > 0) {
      let contactsWithMultipleNum = [];
      //console.log(data)

      data.forEach(each => {
        if (each.phoneNumbers) {
          // else contact has multiple numbers
          each.phoneNumbers.map(phoneObj => {
            let num = phoneObj.number.replace(/\D/g, '');
            //console.log(num)
            let phoneNo = num.substr(num.length - 10);

            if (phoneNo != this.props.userData.phone) {
              let fullname = ''
              if (each.givenName) {
                fullname = each.givenName
              }
              if (each.middleName) {
                fullname = fullname + " " + each.middleName
              }
              if (each.familyName) {
                fullname = fullname + " " + each.familyName
              }
              let countryCode = num.replace(phoneNo, '')
              if (countryCode) {
                countryCode = "+" + countryCode
              } else {
                countryCode = this.props.userData.countryCode
              }
              let obj = {
                givenName: fullname,
                phoneNumber: phoneNo,
                countryCode: countryCode,
                id: ++inc,
              };
              contactsWithMultipleNum.push(obj);
            }
          });
        }
      });
      var uniques = contactsWithMultipleNum.reduce((unique, o) => {
        if (!unique.some(obj => obj.phoneNumber === o.phoneNumber)) {
          unique.push(o);
        }
        return unique;
      }, []);

      this.setState({ contacts: uniques }, () => {
        this.filterContacts();
      });
    }
  };

  filterContacts = () => {
    const { contacts, match } = this.state;

    if (!match) {
      this.setState({ filteredContacts: contacts });
      return;
    }

    if (match.trim() == '') {
      this.setState({ filteredContacts: contacts });
      return;
    }

    const result = contacts.filter(each => {
      return (
        String(each.givenName).toLowerCase().includes(match.toLowerCase().trim()) ||
        String(each.phoneNumber).toLowerCase().includes(match.toLowerCase().trim())
      );
    });

    this.setState({ filteredContacts: result });
  };

  filterHapsyncContacts = () => {
    const { hapsyncContacts, match } = this.state;

    if (!match) {
      this.setState({ filteredHapsyncContacts: hapsyncContacts });
      return;
    }

    if (match.trim() == '') {
      this.setState({ filteredHapsyncContacts: hapsyncContacts });
      return;
    }

    const result = hapsyncContacts.filter(each => {
      return (
        String(each.givenName).toLowerCase().includes(match.toLowerCase().trim()) ||
        String(each.phoneNumber).toLowerCase().includes(match.toLowerCase().trim())
      );
    });

    this.setState({ filteredHapsyncContacts: result });
  };

  onInvite = contact => {
    let guests = [...this.state.guests];

    const isGuest = this.isPartofGuests(contact);

    if (this.state.selectedSource == 'contacts') {
      contact.guestId = -1;
    } else {
      contact.guestId = contact.userId;
    }

    if (isGuest) {
      guests = guests.filter(each => {
        return each.id !== contact.id;
      });
    } else {
      guests.push(contact);
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

  renderSourceSelector = () => {
    const { selectedSource } = this.state;

    return (
      <View
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          marginBottom: moderateScale(15),
          //marginTop: moderateScale(7)
        }}>
        <Pressable
          onPress={() => this.setState({ selectedSource: 'hapsync' })}
          style={[
            styles.sourceSelector,
            {
              borderWidth: selectedSource == 'hapsync' ? 1 : 0,
              marginRight: moderateScale(4),
            },
          ]}>
          <View style={{ transform: [{ scale: moderateScale(0.8) }] }}>
            <SvgIcons.HapsyncIcon />
          </View>
        </Pressable>
        <Pressable
          onPress={() => this.setState({ selectedSource: 'contacts' })}
          style={[
            styles.sourceSelector,
            {
              borderWidth: selectedSource == 'contacts' ? 1 : 0,
            },
          ]}>
          <View style={{ transform: [{ scale: moderateScale(0.8) }] }}>
            <SvgIcons.CallIcon />
          </View>
        </Pressable>
      </View>
    );
  };

  renderContacts = () => {
    const {
      filteredContacts,
      match,
      selectedSource,
      filteredHapsyncContacts,
      permissionDenied,
    } = this.state;

    const dataToShow =
      selectedSource == 'contacts' ? filteredContacts : filteredHapsyncContacts;

    return (
      <View style={{ flex: 1 }}>
        <View
          style={[
            styles.inputWrapper,
            {
              //marginTop: 5,
              paddingHorizontal: moderateScale(15),
              justifyContent: 'space-between',
              flexDirection: 'row',
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
          ]}>
          <Ionicons name="ios-search" size={28} color="#355D9B" />

          <TextInput
            value={match}
            onChangeText={val => {
              this.setState({ match: val });
            }}
            placeholder="Search"
            style={{
              fontSize: moderateScale(17),
              flex: 1,
              paddingVertical: moderateScale(4),
              marginLeft: moderateScale(3),
              color: '#000',
            }}
          />
        </View>
        {selectedSource == 'contacts' && permissionDenied ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'rgba(53, 93, 155, 1)',
                fontSize: moderateScale(15),
                fontFamily: 'Mulish-Bold',
              }}>
              Under settings, Hapysync app,
            </Text>
            <Text
              style={{
                color: 'rgba(53, 93, 155, 1)',
                fontSize: moderateScale(15),
                fontFamily: 'Mulish-Bold',
              }}>
              Provide access to contacts for Hapsync.
            </Text>
            <Button
              onPress={() => {
                Linking.openSettings();
              }}
              title={"Open Settings"}
              type='clear'
              style={{ marginTop: 0 }}
              titleStyle={{ fontFamily: "Mulish-Bold" }}
            />
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{
              paddingBottom: 40,
            }}
            style={{ marginTop: 10 }}
            data={dataToShow}
            // data={contacts}
            renderItem={this.renderContactItem}
            keyExtractor={item => item.id}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    );
  };

  renderContactItem = ({ item }) => {
    const isGuest = this.isPartofGuests(item);

    return (
      <View
        // onPress={() => selectContact(item)}
        style={{
          flexDirection: 'row',
          backgroundColor: '#fff',
          //minHeight: verticalScale(100),
          borderRadius: moderateScale(10),
          marginBottom: moderateScale(10),
          padding: moderateScale(16),
          alignItems: 'center',
          // justifyContent: 'space-between'
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
            marginRight: moderateScale(7),
          }}>
          <Image
            style={{
              width: moderateScale(54),
              height: moderateScale(54),
              borderRadius: moderateScale(27),
              borderWidth: 0.5,
              borderColor: "black"
            }}
            source={
              item.imageUrl
                ? {
                  uri: item.imageUrl,
                }
                : require('../../assets/images/event.png')
            }
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            marginRight: 5,
          }}>
          <Text style={{ fontSize: moderateScale(14) }}>{item.givenName}</Text>
          {/* {item.phoneNumbers && (
                        <Text
                            style={{
                                fontSize: moderateScale(13),
                                color: "grey",
                            }}
                        >
                            {item.phoneNumbers.length > 0 && item.phoneNumbers[0].number}
                        </Text>
                    )} */}
          <Text
            style={{
              fontSize: moderateScale(13),
              color: 'grey',
            }}>
            {item.phoneNumber}
          </Text>
        </View>
        <AppButton
          style={{
            width: moderateScale(79),
            height: moderateScale(40),
            marginLeft: 'auto',
            borderRadius: moderateScale(6),
            backgroundColor: isGuest ? "#198754" : "#355D9B"
          }}
          title={isGuest ? 'Invited' : 'Invite'}
          clicked={() => this.onInvite(item)}
        />
        {/* <Button
                    containerStyle={{
                        flex: 0.6
                    }}
                    buttonStyle={{
                        //height: moderateScale(45),
                        paddingVertical: 15,
                        borderRadius: moderateScale(6),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#355D9B',

                    }}
                    titleStyle={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: moderateScale(15.5)
                    }}
                    title={isGuest ? "Invited" : "Invite"}
                    onPress={() => this.onInvite(item)}
                /> */}
      </View>
    );
  };

  renderNextButton = () => {
    const { guests } = this.state;

    const navParamData = {
      ...this.props.route.params,
      guests,
    };

    return (
      <>
        {this.props.route.params.editingEvent ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: moderateScale(15),
            }}>
            <AppButton
              title="Cancel"
              style={{ height: moderateScale(40), flex: 1, marginRight: 10 }}
              clicked={() => {
                this.props.navigation.pop();
              }}
            />
            <AppButton
              title="Confirm"
              style={{ height: moderateScale(40), flex: 1, marginLeft: 10 }}
              clicked={() => {
                let inviteesApiData = [];
                let obj = { ...this.props.route.params.eventData };

                //console.log(obj.invitees)
                //console.log(guests)

                guests.map((guest, index) => {
                  if (
                    obj.invitees &&
                    obj.invitees.find(i => i.phone == guest.phoneNumber)
                  ) {
                  } else {
                    inviteesApiData.push({
                      userId: guest.guestId,
                      // "email": "test@test.com",
                      countryCode: guest.countryCode,
                      phone: guest.phoneNumber,
                      name: guest.givenName,
                      status: 'ADD',
                    });
                  }
                });

                if (this.state.guests.length != 0) {
                  //let obj={...this.props.route.params.eventData}
                  obj.eventId = obj.id;
                  (obj.invitees = [...obj.invitees, ...inviteesApiData]),
                    //console.log(obj)
                    updateEvent(obj);
                  this.props.navigation.pop();
                }
              }}
            />
          </View>
        ) : (
          <>
            <Button
              title="Next"
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
                this.props.navigation.navigate('HostEventConfirm', navParamData)
              }
            />
            {/* <Pressable
                        style={{
                            alignSelf: 'flex-end',
                            padding: 10,
                            margin: 5,
                        }}
                        onPress={() => this.props.navigation.navigate("HostEventConfirm", navParamData)}
                    >
                        <Text
                            style={{
                                color: 'rgba(53, 93, 155, 1)',
                                fontSize: moderateScale(20),
                                fontFamily: 'Mulish-ExtraBold'
                            }}
                        >Next</Text>
                    </Pressable> */}
          </>
        )}
      </>
    );
  };

  render() {
    return (
      <ImageBackground
        source={require('../../assets/images/blurBG.png')}
        resizeMode="cover"
        imageStyle={{
          width: '100%',
          height: '100%',
        }}
        style={{
          // flex: 1,
          minWidth: '100%',
          minHeight: '100%',
        }}>
        <TopBar
          style={{ backgroundColor: 'transparent' }}
          title="Invite Guests"
        />
        <KeyboardAvoidingView
          style={{ flex: 1, marginHorizontal: moderateScale(19), }}
          behavior={Platform.OS == "ios" ? "padding" : undefined}
          keyboardVerticalOffset={moderateScale(40)}>
          {this.renderSourceSelector()}
          {this.renderContacts()}
          {this.renderNextButton()}
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create<Styles>({
  container: {
    flexGrow: 1,
  },
  sourceSelector: {
    justifyContent: 'center',
    alignItems: 'center',
    height: moderateScale(62),
    width: moderateScale(78),
    borderColor: '#355D9B',
    borderRadius: moderateScale(10),
  },
  inputWrapper: {
    borderRadius: moderateScale(6),
    // borderColor: '#D2D2D2',
    color: 'black',
    //padding: moderateScale(4),
    height: moderateScale(46),
    // borderWidth: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  const { userData } = state.user;

  return {
    userData,
  };
};

export default connect(mapStateToProps)(InviteFriend);
