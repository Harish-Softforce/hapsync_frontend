import { View, Text } from 'react-native'
import React from 'react' 
import VideoPlayer from "react-native-video-controls"

export default function VideoDisplay({ route, navigation }) {
  const { uri } = route.params; 
  return (
    <VideoPlayer
      source={{uri:uri}}
      onBack={()=>navigation.goBack()}
    />
  )
}