import { createSlice } from '@reduxjs/toolkit';

export type eventsState = {
  myEvents: undefined | [],
  upcomingEvents: undefined | [],
  invitations: undefined | [],
  memories: undefined | [],
  interested: undefined | [],
  recommendedEvents: undefined | [],
  eventsCategories: undefined | [],
  eventAlbum: undefined | [],
  vendorAlbum: undefined | [],
  isLoading: undefined | false,
  activityTypes: undefined | [],
  currentEvent: null,
  chatWith: null,
  currentTask: null,
  orgMembers: undefined | []
};
//made empty array 
let initialState: eventsState = {

  myEvents: [],
  upcomingEvents: [],
  invitations: [],
  memories: [],

  //of vendor
  interested: [],
  recommendedEvents: [],

  eventsCategories: [],
  eventAlbum: [], //added
  vendorAlbum:[],
  isLoading: false,//added 
  activityTypes: [],
  currentEvent: null,
  chatWith: null,
  currentTask: null,
  orgMembers:[]
};

export const eventsSlice = createSlice({
  name: 'eventsReducer',
  initialState,
  reducers: {

    getMyEventsSuccess: (state, action) => {
      state.myEvents = action.payload;
    },
    getUpcomingEventsSuccess: (state, action) => {
      state.upcomingEvents = action.payload
    },
    getInvitationsSuccess: (state, action) => {
      state.invitations = action.payload
    },
    getMemoriesEventsSuccess: (state, action) => {
      state.memories = action.payload
    },

    //of vendor
    getInterestedEventsSuccess: (state, action) => {
      state.interested = action.payload
    },
    getRecommendedEventsSuccess: (state, action) => {
      state.recommendedEvents = action.payload
    },

    getEventCatsSuccess: (state, action) => {
      state.eventsCategories = action.payload
    },
    //hosted event is added 
    addEventSuccess: (state, action) => {
      state.myEvents?.push(action.payload)
    },
    getEventAlbumSuccess: (state, action) => {
      state.eventAlbum = action.payload
    },
    clearEventAlbumSuccess: (state, action) => {
      state.eventAlbum = []
    },

    getVendorAlbumSuccess: (state, action) => {
      state.vendorAlbum = action.payload
    },
    clearVendorAlbumSuccess: (state, action) => {
      state.vendorAlbum = []
    },

    //added for loading view
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    /* Current Selected Event */
    getCurrentEventSuccess: (state, action) => {
      state.currentEvent = action.payload
    },
    clearCurrentEventSuccess: (state, action) => {
      state.currentEvent = null
    },
    getActivityTypesSuccess: (state, action) => {
      state.activityTypes = action.payload
    },
    //currentTask
    getCurrentTaskSuccess: (state, action) => {
      state.currentTask = action.payload
    },
    clearCurrentTaskSuccess: (state, action) => {
      state.currentTask = null
    },
    //Org Members
    getOrgMembersSuccess: (state, action)=>{
      state.orgMembers=action.payload
    },
    clearAllEvents: () => initialState,
    changeChatWith:(state, action)=>{
      state.chatWith=action.payload
    }
  },
});

export const { getMyEventsSuccess,
  getUpcomingEventsSuccess,
  getInvitationsSuccess,
  getMemoriesEventsSuccess,

  getInterestedEventsSuccess,
  getRecommendedEventsSuccess,

  getEventCatsSuccess,
  addEventSuccess,
  getEventAlbumSuccess,
  clearEventAlbumSuccess,

  getVendorAlbumSuccess,
  clearVendorAlbumSuccess,
  
  setIsLoading,
  getCurrentEventSuccess,
  clearCurrentEventSuccess,
  getActivityTypesSuccess,
  getCurrentTaskSuccess,
  clearCurrentTaskSuccess,
  clearAllEvents,
  changeChatWith,
  getOrgMembersSuccess
  
} = eventsSlice.actions;
