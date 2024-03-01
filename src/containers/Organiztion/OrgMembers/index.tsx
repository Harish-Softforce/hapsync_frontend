import { View, Text, ImageBackground, ScrollView, RefreshControl, StyleSheet, TextInput, FlatList, Platform, Linking, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import TopBar from '../../../components/TopBar'
import { moderateScale, verticalScale } from '../../../utils/scalingUnits'
import Feather from 'react-native-vector-icons/Feather'
import { getOrgMembers } from '../../../store/actionCreators'
import { useSelector } from 'react-redux'
import { Avatar, ListItem } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default function OrgMembers() {

  const { userData, } = useSelector(state => state.user)
  const { orgMembers } = useSelector(state => state.events)

  const [refreshing, setRefreshing] = useState(false)
  const [allMembers, setAllMembers] = useState([])
  const [list, setList] = useState([])

  useEffect(() => {
    getOrgMembers(userData.orgId)
  }, [])

  useEffect(() => {
    if (allMembers !== orgMembers) {
      setAllMembers(orgMembers)
      setList(orgMembers)
    }
  }, [orgMembers])

  const onRefresh = async () => {
    setRefreshing(true)
    await getOrgMembers(userData.orgId)
    setRefreshing(false)
  }

  const renderSearchField = () => {
    return <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      height: verticalScale(43),
      borderRadius: verticalScale(6),
      paddingHorizontal: moderateScale(9),
      marginBottom: 10
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
          fontSize: verticalScale(13),
          color: '#404A69',
          fontFamily: 'Mulish-Light',
          flex: 1,
          marginLeft: moderateScale(5)
        }}
        onChangeText={(val) => {
          let arr = [...allMembers]
          arr = arr.filter(i => (i.name).toLowerCase().includes(val.toLowerCase()) || (i.phone).toLowerCase().includes(val.toLowerCase()))
          setList(arr)
        }}
      />
    </View>
  }

  const renderItem = ({ item }) => {
    return <>
      <View>
        <ListItem
          containerStyle={[
            {
              borderRadius: moderateScale(6), marginTop: moderateScale(6), minHeight: 70
            },
            {
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
              })
            }
          ]}
        >
          <Avatar rounded source={
            item.imageUrl
              ? { uri: item.imageUrl }
              : require("../../../assets/images/splashscreen.png")
          } size={'medium'} />
          <ListItem.Content>
            <ListItem.Title style={{ color: '#355D9B', fontFamily: 'Mulish', fontWeight: "700" }}>
              {item.name}
            </ListItem.Title>
            <ListItem.Subtitle style={{ color: '#88879C', fontFamily: 'Mulish', fontWeight: "600" }}>
              {item.phone}
            </ListItem.Subtitle>
          </ListItem.Content>
          <Pressable
            onPress={() => {
              if (item.phone) {
                Linking.openURL(`tel:${item.phone}`).catch(e => {
                  console.log(e)
                })
              }
            }}
            style={{ marginRight: 7 }}
          >
            <MaterialIcons name="call" size={24} color="#00ADEF" />
          </Pressable>
        </ListItem>
      </View>
    </>
  }

  return (
    <ImageBackground
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
        title="Members"
      // rightComponent={this.renderRightHeader()}
      />

      <View style={{ marginHorizontal: 20 }}>
        {renderSearchField()}
      </View>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />

    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    marginHorizontal: 20
  }
})