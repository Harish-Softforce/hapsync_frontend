import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  Image,
  TouchableHighlight,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';
import { moderateScale, verticalScale } from '../../utils/scalingUnits';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import instance from '../../axios';
import { store } from '../../store';
import Toast from 'react-native-toast-message';
import { showLoadingModal, hideLoadingModal } from '../../store/utilsSlice';
import { useDispatch } from 'react-redux';

const VideoItem = ({ uri }) => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <ActivityIndicator color="#355D9B" />}
      <ImageBackground
        style={{ width: '100%', height: 140 }}
        source={{ uri: uri }}
        imageStyle={{ borderRadius: moderateScale(4) }}
        onLoadEnd={() => setLoading(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={require('../../assets/images/playIcon.jpg')}
            style={{
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 0,
              borderColor: '#fff',
              borderRadius: 30,
            }}
          />
        </View>
      </ImageBackground>
    </>
  );
};

const ImageItem = ({ uri }) => {
  const [loading, setLoading] = useState(true);
  return (
    <>
      {loading && <ActivityIndicator color="#355D9B" />}
      <Image
        style={{
          width: '100%',
          height: 140,
          //borderWidth: 0.5,
          borderRadius: moderateScale(4),
        }}
        source={{ uri: uri }}
        onLoadEnd={() => setLoading(false)}
      />
    </>
  );
};

export default function ListGalleryItems({ DATA,hideReportOption }) {
  const galleryData = DATA.map(item => {
    return {
      id: item.id,
      url: item.filePath,
      fileType: item.fileType,
      thumbnail: item.thumbnailUrl,
      userId: item.userId
    };
  });
  const imageData = galleryData.filter(item => {
    if (item.fileType == 'image') {
      return item;
    }
  });

  const navigation = useNavigation();
  const dispatch = useDispatch()
  const [bgColor, setbgColor] = useState(null)
  const _renderItem = ({ item, index }) => (
    <View
      style={[
        { flex: 1, marginHorizontal: 20, marginBottom: 20 },
        { marginLeft: index % 2 == 0 ? 20 : 0 },
      ]}>

      <Menu
        onOpen={() => {
          setbgColor(0.5)
        }}
        onSelect={value => {
          if (value == "Report") {
            let obj = {
              "album_id": item.id,
              "chat_msg_id": null,
              "content": null,
              "event_id": null,
              "reporter_id": store.getState().user.userData.id,
              "user_id": null,
              "attachments": null
            }
            dispatch(showLoadingModal())
            instance.post("/sms/sendReportMail", obj)
              .then(r => {
                //console.log(r.data)
                dispatch(hideLoadingModal())
                Toast.show({
                  type: 'success',
                  text1: r.data
                })
              }).catch(e => {
                console.log("Report album api error " + e)
                dispatch(hideLoadingModal())
                Toast.show({
                  type: 'success',
                  text1: "Failed to report"
                })
              })
          }
        }}>
        <MenuTrigger triggerOnLongPress
          customStyles={{
            triggerTouchable: {
              onPress: () => {
                //console.log(item )

                if (item.fileType == 'image') {
                  var videoCount = 0;
                  galleryData.map((i, j) => {
                    if (i.fileType == 'video' && j <= index) {
                      videoCount++;
                    }
                  });
                  navigation.navigate('ImageGalleryDisplay', {
                    imageData: imageData,
                    currentIndex: index - videoCount,
                  });
                } else if (item.fileType == 'video') {
                  navigation.navigate('VideoDisplay', {
                    uri: item.url,
                  });
                }

              }
            }
          }}
        >

          {item.fileType == 'video' ? (
            <VideoItem uri={item.thumbnail} />
          ) : item.fileType == 'image' ? (
            <ImageItem uri={item.url} />
          ) : (
            <></>
          )}
        </MenuTrigger>
        {!hideReportOption && item.userId != store.getState().user.userData.id
          && <MenuOptions
            optionsContainerStyle={{
              //marginTop: 40 
              //backgroundColor: 'blue',
              //width:   "43%" ,
            }}
            customStyles={{
              optionText: {},
              optionWrapper: {
                //borderWidth: 1,
                //borderBottomWidth:1,
                paddingVertical: 10
              },

            }}
          >

            <MenuOption
              value="Report"
              // text="Report"
              style={{ flexDirection: 'row', alignItems: "center" }}
            >
              <MaterialIcons name="report" style={{ fontSize: verticalScale(18), color: 'red' }} />
              <Text style={{
                fontFamily: "Mulish-Bold",
                color: "red",
                paddingLeft: moderateScale(5),
                fontSize: moderateScale(16),
                letterSpacing: 1
              }}>Report</Text>
            </MenuOption>

          </MenuOptions>
        }
      </Menu>

      {/*  <Text style={{ textAlign: "center", marginTop: 8 }}>{item.fileType}</Text>  */}
    </View>
  );

  return (
    <MenuProvider style={{
      flexDirection: 'column',
      //opacity: bgColor,backgroundColor:bgColor?"rgba(0,0,0,0.5)":null
    }}>
      <SafeAreaView style={{ flex: 1, paddingBottom: 40 }}>
        {!hideReportOption &&<Text style={{
          marginHorizontal: moderateScale(20),
          fontFamily: 'Mulish-Regular',
          fontSize: moderateScale(14),
        }}>Note: press-and-hold to report image/video</Text>}
        <FlatList
          data={galleryData}
          renderItem={(item, index) => _renderItem(item, index)}
          keyExtractor={(item, index) => index}
          numColumns={2}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 20 }}
        />
      </SafeAreaView>
    </MenuProvider>
  );
}