import * as React from 'react';
import {
  View,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  Switch,
  Modal,
  Image,
  RefreshControl,
} from 'react-native';

import Text from '../../../components/UI/AppText';
import TopBar from '../../../components/TopBar';
import { moderateScale, verticalScale } from '../../../utils/scalingUnits';

import {
  launchCamera,
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';

import * as SvgIcons from '../../../assets/svg-icons';
import { connect } from 'react-redux';
import {
  addEventAlbum,
  clearEventAlbum,
  getEventAlbum,
} from '../../../store/actionCreators';
import ImagePicker from 'react-native-image-crop-picker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import ListGalleryItems from '../../../components/Album/listGalleryItems';

class EventGallery extends React.Component {
  state = {
    showImageSourcePicker: false,
    refreshing: false
  };

  componentDidMount() {
    getEventAlbum(this.props.route.params?.eventId);
  }
  componentWillUnmount() {
    clearEventAlbum();
  }

  /** image picker code starts */

  handleImagePick = async (type: String) => {
    const { route, userData } = this.props;

    const options: ImageLibraryOptions = {
      mediaType: 'mixed',
      selectionLimit: 0,
    };

    if (type == 'gallery') {
      /* launchImageLibrary(options, (res) => {
               if (res.assets) {
                    addEventAlbum(res.assets,route.params?.eventId,userData.id)
                }
            }) */
      await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'any',
      })
        .then(async files => {
          console.log(files);
          if (
            files.length == 1 &&
            files[0].mime.substring(0, files[0].mime.indexOf('/')) == 'image'
          ) {
            await ImagePicker.openCropper({
              path: files[0].path,
              cropping: true,
              freeStyleCropEnabled: true,
              mediaType: 'photo',
            })
              .then(img => {
                let obj = [{ ...img }];
                obj[0].fileName = uuidv4();
                addEventAlbum(obj, route.params?.eventId, userData.id);
                //console.log(image);
              })
              .catch(e => {
                console.log(e);
              });
          } else {
            const arr = files.map(obj => {
              return { ...obj, fileName: uuidv4() };
            });
            addEventAlbum(arr, route.params?.eventId, userData.id);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }

    if (type == 'camera') {
      /* launchCamera(options, (res) => {
                if (res.assets) {
                    addEventAlbum(res.assets,route.params?.eventId,userData.id)
                }
            }) */

      await ImagePicker.openCamera({
        cropping: true,
        freeStyleCropEnabled: true,
      })
        .then(img => {
          let obj = [{ ...img }];
          obj[0].fileName = uuidv4();
          addEventAlbum(obj, route.params?.eventId, userData.id);
          console.log(img);
        })
        .catch(e => {
          //alert(e);
        });
    }

    this.setState({ showImageSourcePicker: false });
  };

  /** image picker code ends */

  renderTopRightIcon = () => {
    return (
      <Pressable
        onPress={() => {
          this.setState({ showImageSourcePicker: true });
        }}>
        <SvgIcons.PlusIcon
          style={{
            transform: [{ scale: moderateScale(0.8) }],
          }}
        />
      </Pressable>
    );
  };

  renderPhotos = () => {
    const { eventAlbum } = this.props;

    if (eventAlbum?.length < 1) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SvgIcons.GalleryEmptyImage
            fill="#355D9B"
            style={{
              transform: [{ scale: moderateScale(1) }],
            }}
          />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: verticalScale(16),
              color: '#355D9B',
              marginTop: verticalScale(11),
            }}>
            No Photos!
          </Text>
          <Text
            style={{
              fontWeight: '500',
              fontSize: 13,
              color: '#355D9B66',
              width: '70%',
              textAlign: 'center',
            }}>
            Add your amazing party photos here and share with all...
          </Text>
        </View>
      );
    }

    return <ListGalleryItems DATA={eventAlbum} hideReportOption={false}/>;
  };

  renderImageSourcePicker = () => {
    const { showImageSourcePicker } = this.state;

    const iconContainerStyle = {
      backgroundColor: '#355D9B',
      borderRadius: verticalScale(12),
      height: verticalScale(60),
      width: verticalScale(82),
      justifyContent: 'center',
      alignItems: 'center',
    };

    return (
      <Modal
        visible={showImageSourcePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => this.setState({ showImageSourcePicker: false })}>
        <Pressable
          onPress={() => this.setState({ showImageSourcePicker: false })}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'flex-end',
          }}>
          <Pressable
            style={{
              height: verticalScale(182),
              borderRadius: verticalScale(10),
              width: '100%',
              backgroundColor: '#fff',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View>
              <Pressable
                onPress={() => this.handleImagePick('camera')}
                style={iconContainerStyle}>
                <SvgIcons.CameraShutterIcon
                  style={{
                    transform: [{ scale: moderateScale(1) }],
                  }}
                />
              </Pressable>
              <Text
                style={{
                  color: '#88879C',
                  fontWeight: 'bold',
                  fontSize: verticalScale(12),
                  textAlign: 'center',
                  marginTop: verticalScale(5),
                }}>
                CAMERA
              </Text>
            </View>
            <View style={{ marginLeft: moderateScale(50) }}>
              <Pressable
                onPress={() => this.handleImagePick('gallery')}
                style={[iconContainerStyle]}>
                <SvgIcons.GalleryInvertIcon
                  style={{
                    transform: [{ scale: moderateScale(1) }],
                  }}
                />
              </Pressable>
              <Text
                style={{
                  color: '#88879C',
                  fontWeight: 'bold',
                  fontSize: verticalScale(12),
                  textAlign: 'center',
                  marginTop: verticalScale(5),
                }}>
                GALLERY
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  };

  render() {
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
          title="Album"
          rightComponent={this.renderTopRightIcon()}
        />
        <ScrollView
          refreshControl={<RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => {
              getEventAlbum(this.props.route.params?.eventId);
            }} />}
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          {this.renderPhotos()}
          {this.renderImageSourcePicker()}
        </ScrollView>
      </ImageBackground>
    );
  }
}

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  heading: {
    fontSize: moderateScale(22),
    marginVertical: verticalScale(20),
    marginHorizontal: moderateScale(11),
    color: '#355D9B',
    fontFamily: 'Mulish-ExtraBold',
  },
});

const mapStateToProps = state => {
  const { eventAlbum } = state.events;
  const { userData } = state.user;

  return {
    eventAlbum,
    userData,
  };
};

export default connect(mapStateToProps)(EventGallery);
