import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import React from 'react';
import { LogBox, SafeAreaView, View } from 'react-native'
import Text from './src/components/UI/AppText'

import SplashScreen from 'react-native-splash-screen'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './src/store';

import AppRouter from './src/navigation/AppRouter'


LogBox.ignoreLogs(['VirtualizedLists should never be nested inside'])

const App = () => {
  React.useEffect(() => {
    SplashScreen.hide()
  }, [])



  return (

    <Provider
      store={store}
    >
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }} >
          <SafeAreaView style={{ flex: 1 }}>
            <AppRouter />
          </SafeAreaView>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};


export default App;