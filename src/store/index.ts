import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';

import {combineReducers} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {utilsSlice} from './utilsSlice';
import {userSlice} from './userSlice';
import {eventsSlice} from './eventsSlice';
import {draftsSlice} from './draftsSlice';

import {eventsApi} from './rtk-query/event';

const rootReducer = combineReducers({
  [eventsApi.reducerPath]: eventsApi.reducer,
  //
  user: userSlice.reducer,
  utils: utilsSlice.reducer,
  events: eventsSlice.reducer,
  drafts: draftsSlice.reducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  blacklist: [],
  whitelist: ['user', 'drafts'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(eventsApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
