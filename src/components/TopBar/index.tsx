import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  ViewStyle,
  StatusBar
} from "react-native";
//import Icon from "react-native-vector-icons/Ionicons";
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useNavigation } from '@react-navigation/native';

import * as SvgIcons from '../../assets/svg-icons'
import Text from '../UI/AppText'
import { moderateScale } from "../../utils/scalingUnits";

type Props = {
  title: string,
  style: ViewStyle,
  contentColor: string,
  rightComponent: JSX.Element,
  leftComponent: JSX.Element,
}

function TopBar(props: Props) {
  const { title,
    style,
    rightComponent,
    leftComponent,
    middleComponent,
    backIcon,
    customBackFunction,
    contentColor } = props;


  const navigation = useNavigation()

  const goBack = () => {
    customBackFunction ? customBackFunction() : navigation.goBack()
  }

  return (
    <View>
      <StatusBar
      />
      <View style={[styles.container, style]}>
        {leftComponent ? leftComponent :
          <Pressable
            onPress={goBack}
            style={{
              position: 'absolute',
              left: moderateScale(10),
              zIndex: 20,
              padding: moderateScale(10),
              paddingRight: moderateScale(15),
              // marginLeft: moderateScale(20),
            }}
          >
            {backIcon ? backIcon :
              // <SvgIcons.BackIcon />
              <Ionicons name="ios-arrow-back-circle-outline" size={moderateScale(36)} color="rgba(53, 93, 155, 1)" />
            }
          </Pressable>

        }
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.title, {
              width: moderateScale(70)+"%",
              alignSelf: 'center',
              color: contentColor ? contentColor : styles.title.color
            }]}>{title}</Text>
        </View>
        {middleComponent && <View
          style={[{
            position: 'absolute', right: moderateScale(20),
          }, rightComponent && {
            left: "75%"
          }]}
        >{middleComponent}</View>}
        {
          rightComponent && <View style={{
            right: moderateScale(20),
            position: 'absolute'
          }}>
            {rightComponent}
          </View>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 63,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: "rgba(7,7,7,1)",
    fontSize: 25,
    padding: 11
  },
  title: {
    fontFamily: "Roboto-Bold",
    color: "rgba(53, 93, 155, 1)",
    fontSize: 20,
    // marginTop: 4,
    fontWeight: 'bold',
    // marginRight: 'auto',
    // marginLeft: 6,
    //position: 'absolute',
    textAlign: 'center',
    width: '100%'
  }
});

export default TopBar;
