import { View, Text, Pressable } from 'react-native'
import React from 'react'
import ImageViewer from 'react-native-image-zoom-viewer';

import Fontisto from 'react-native-vector-icons/Fontisto'

export default function ImageGalleryDisplay({ route, navigation }) {
  const { imageData, currentIndex } = route.params;

  return (
    <>

      <ImageViewer
        renderHeader={() =>
          <View><Pressable
            onPress={() => {
              navigation.goBack()
            }}
            style={{
              padding: 20,
              width: '30%'
            }}
          >
            <Fontisto name="close-a" size={18} color="white" />
          </Pressable>
          </View>}
        imageUrls={imageData}
        enableSwipeDown={true}
        onSwipeDown={() => { navigation.goBack(); }}
        index={currentIndex}
        saveToLocalByLongPress={false}
      />
    </>
  )
}