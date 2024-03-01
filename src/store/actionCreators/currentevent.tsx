import { store } from '../index'
import axios from '../../axios'
import {
   hideLoadingModal,
   showSuccessModalFunc,
   showErrorModalFunc,
   showLoadingModal,
} from '../utilsSlice'

import { changeChatWith, clearCurrentEventSuccess, clearCurrentTaskSuccess, getActivityTypesSuccess, getCurrentEventSuccess, getCurrentTaskSuccess } from '../eventsSlice'
import { getEvents, uploadEventAlbum } from './events'
import Toast from 'react-native-toast-message'
import moment from 'moment'

//getEventDetails
export const getCurrentEventDetails = async (eventId, showLoader) => {
   if (showLoader) {
      store.dispatch(showLoadingModal())
   }
   await axios.get('/event/' + eventId + '/getEventDetails').then((res) => {
      if (res.status == 200) {
         if (showLoader) {
            store.dispatch(hideLoadingModal())
         }
         // console.log("APi RES")
         // console.log(res.data)
         let a = false
         let localUid = store.getState().user.userData?.id

         let data = res.data
         if (data.timings.length > 0) {
            const eventTime = data.timings[0].slot + (data.timings[0].startTime ? (" " + data.timings[0].startTime) : '')
            const secondsTilEvent = moment(eventTime).diff(moment(), "seconds")
            if (secondsTilEvent > 0) {
               a = true
            }
         }

         let b = false
         res.data.activities.map(i => {
            i.assignees.map(j => {
               if (j.userId == localUid) {
                  b = true
                  return
               }
            })
            if (b) {
               return
            }
         })

         let finalData = res.data
         finalData.userAccess = localUid == res.data.owner
         finalData.eventEditAccess = a && localUid == res.data.owner
         finalData.tabAccess = b || localUid == res.data.owner
         finalData.taskAccess = (b || localUid == res.data.owner) && a

         store.dispatch(getCurrentEventSuccess(finalData))
      }
   })
      .catch(e => {
         console.log(e)
         if (showLoader) {
            store.dispatch(hideLoadingModal())
         }
         setTimeout(() => {
            store.dispatch(showErrorModalFunc("Error encountered"))
         }, 1000)

      })
}

export const clearCurrentEvent = () => {
   store.dispatch(clearCurrentEventSuccess(null))
}

export const addInviteeChat = (eventId, obj, navigation) => {
   store.dispatch(showLoadingModal())
   axios.post("/invitee/addInviteeChat", obj).then(r => {
      store.dispatch(hideLoadingModal())
      navigation.navigate("Chat")
      getCurrentEventDetails(eventId, false)
   }).catch(e => {
      console.log(e)
      store.dispatch(hideLoadingModal())
      Toast.show({
         type: 'error',
         text1: 'Error Encountered'
      })
   })
}

export const cancelEvent = (eventId, uid, navigation) => {
   axios.post("/event/" + eventId + "/cancelEvent")
      .then(r => {
         getEvents(uid, true)
         navigation.navigate("HomeScreen")
         Toast.show({
            type: 'success',
            text1: 'Cancelled Successfully'
         })
      })
      .catch(e => {
         Toast.show({
            type: 'error',
            text1: 'Failed to Cancel'
         })
      })
}

export const guestsToProposeBestDayAndTime = (eventId, val) => {
   axios.post("/event/" + eventId + "/guestsToProposeBestDayAndTime",
      {
         "allowSuggestMore": val,
         "eventId": eventId
      }
   ).then(r => {
      getCurrentEventDetails(eventId, false)
      /* Toast.show({
          type: 'success',
          text1: 'Updated Successfully'
      }) */
   }).catch(e => {
      console.log(e)
      Toast.show({
         type: 'error',
         text1: 'Error Encountered'
      })
   })
}

export const allowGuestsToSeeGuestlist = (eventId, val) => {
   store.dispatch(showLoadingModal())
   axios.post("/event/" + eventId + "/allowGuestsToSeeGuestlist",
      {
         "allowGuestList": val,
         "eventId": eventId
      }
   ).then(r => {
      store.dispatch(hideLoadingModal())
      getCurrentEventDetails(eventId, false)
      /* Toast.show({
          type: 'success',
          text1: 'Updated Successfully'
      }) */
   }).catch(e => {
      store.dispatch(hideLoadingModal())
      console.log(e)
      Toast.show({
         type: 'error',
         text1: 'Error Encountered'
      })
   })
}

export const inviteeVotingUpdate = async (data, eventId) => {

   await axios.post('/invitee/inviteeVotingUpdate', data).then((res) => {
      getCurrentEventDetails(eventId, false)
   })
      .catch(e => {
         console.log(e)
         store.dispatch(showErrorModalFunc("Error encountered"))
      })
}

export const updateEvent = async (data) => {
   //console.log(JSON.stringify(data))
   console.log(data)
   store.dispatch(showLoadingModal())
   await axios.put('/event/updateEvent', data).then((res) => {
      store.dispatch(hideLoadingModal())
      getCurrentEventDetails(data.id, false)
      getEvents(data.owner, false)
      Toast.show({
         type: 'success',
         text1: 'Updated Successfully'
      })
   })
      .catch(e => {
         store.dispatch(hideLoadingModal())
         console.log(e)
         Toast.show({
            type: 'error',
            text1: 'Failed to Update'
         })
      })
}

export const endVoting = async (finalDate, finalLoc, eventId) => {

   let obj = {
      eventId: eventId,
      timingId: finalDate.id,
      locationId: finalLoc.id,
   }
   //store.dispatch(showLoadingModal())

   await axios.post('/polling/endVoting', obj).then((res) => {
      //console.log(res)
      getCurrentEventDetails(eventId, false)
      store.dispatch(showSuccessModalFunc("Polling Ended successfully"))
      //store.dispatch(hideLoadingModal())
   })
      .catch(e => {
         console.log(e)
         store.dispatch(showSuccessModalFunc("Failed to Ended Polling"))
         //store.dispatch(hideLoadingModal())
      })
}

export const getAllActivityTypes = async () => {

   await axios.get('/activityCategory/getAllActivityTypes').then((res) => {
      store.dispatch(getActivityTypesSuccess(res.data))
   }).catch(e => {
      console.log(e)
   })
}

export const addActivity = (obj, navigation) => {
   store.dispatch(showLoadingModal())
   axios.post('/activity/addActivity', obj).then(res => {
      //console.log(res)
      navigation.pop()
      getCurrentEventDetails(obj.eventId, false)
      store.dispatch(hideLoadingModal())
   }).catch(e => {
      console.log(e)
      store.dispatch(showSuccessModalFunc("Failed to Add Task"))
      store.dispatch(hideLoadingModal())
   })
}

export const addTemplateActivity = (obj, eventId) => {
   //console.log(obj)
   axios.post('/activity/addTemplateActivity', obj).then(res => {
      //console.log(res)
      getCurrentEventDetails(eventId, false)
   }).catch(e => {
      console.log(e)
   })
}

export const updateActivity = (obj) => {

   store.dispatch(showLoadingModal())
   axios.put('/activity/updateActivity', obj).then(res => {
      //console.log(res)
      //store.dispatch(getCurrentTaskSuccess(res.data))
      getCurrentEventDetails(obj.eventId, false).then(() =>
         getCurrentTask(obj.id)
      )
      store.dispatch(hideLoadingModal())
      Toast.show({
         type: 'success',
         text1: 'Updated successfully'
      })
   }).catch(e => {
      console.log(e)
      Toast.show({
         type: 'error',
         text1: 'Failed to Update'
      })
      store.dispatch(hideLoadingModal())
   })
}

export const deleteActivity = (taskId, eventId) => {

   axios.delete("/activity/deleteActivity/" + taskId).then(res => {

      getCurrentEventDetails(eventId, false)
      Toast.show({
         type: 'success',
         text1: 'Deleted successfully'
      })
   }).catch(e => {
      console.log(e)
      Toast.show({
         type: 'error',
         text1: 'Error Encountered'
      })
   })
}

export const addActivityVendor = (obj, eventId, taskId) => {
   //console.log(obj)
   store.dispatch(showLoadingModal())
   axios.post('/activity/addActivityVendor', obj).then(res => {
      getCurrentEventDetails(eventId, false).then(() =>
         getCurrentTask(taskId)
      )
      store.dispatch(hideLoadingModal())
   }).catch(e => {
      console.log(e)
      store.dispatch(hideLoadingModal())
   })
}

export const updateActivityVendor = (obj, eventId) => {

   //store.dispatch(showLoadingModal())
   axios.put('/activity/updateActivityVendor', obj).then(res => {
      getCurrentEventDetails(eventId, false).then(() =>
         getCurrentTask(obj.activityId)
      )
      //store.dispatch(hideLoadingModal())
      Toast.show({
         type: 'success',
         text1: 'Updated successfully'
      })
   }).catch(e => {
      console.log(e)
      Toast.show({
         type: 'error',
         text1: 'Failed to Update'
      })
      //store.dispatch(hideLoadingModal())
   })
}


export const updateVendorInvoice = (obj, eventId) => {

   axios.put('/vendor/updateVendorInvoice', obj).then(res => {
      getCurrentEventDetails(eventId, false)

      Toast.show({
         type: 'success',
         text1: 'Updated successfully'
      })
   }).catch(e => {
      console.log(e)
      Toast.show({
         type: 'error',
         text1: 'Failed to Update'
      })

   })
}


export const addGoogleVendor = (obj, taskId, eventId) => {
   store.dispatch(showLoadingModal())
   axios.post('/vendor/addGoogleVendor', obj).then(res => {
      //console.log(res)
      getCurrentEventDetails(eventId, false).then(() =>
         getCurrentTask(taskId)
      )
      store.dispatch(hideLoadingModal())
   }).catch(e => {
      console.log(e)
      store.dispatch(hideLoadingModal())
   })
}

export const customVendor = (obj, navigation, eventId) => {
   store.dispatch(showLoadingModal())
   axios.post('/vendor/addVendor', obj).then(res => {
      //console.log(res.data)
      getCurrentEventDetails(eventId, false).then(() =>
         getCurrentTask(obj.activityId)
      )
      navigation.goBack()
      store.dispatch(hideLoadingModal())
   }).catch(e => {
      console.log(e)
      store.dispatch(hideLoadingModal())
   })
}

export const activityStatusUpdate = (obj, eventId) => {
   axios.post('/activity/activityStatusUpdate', obj).then(res => {
      getCurrentEventDetails(eventId, false)
   }).catch(e => {
      console.log(e)
   })
}

export const getCurrentTask = async (id) => {
   //console.log(id)
   await getCurrentEventDetails(store.getState().events.currentEvent.id, false)
   let event = store.getState().events.currentEvent
   const task = event.activities.find(item => item.id == id)
   if (task) {
      store.dispatch(getCurrentTaskSuccess(task))
   }
}

export const clearCurrentTask = () => {
   store.dispatch(clearCurrentTaskSuccess(null))
}

export const updateBudget = (obj) => {
   const data = obj.budgetRequest.receipts
   const eventId = obj.eventId
   const userId = obj.userId

   store.dispatch(showLoadingModal())

   if (data.length > 0 && data[0].fileName) {
      uploadEventAlbum(data, eventId, userId, "EVENT").then((res: any) => {
         let recipts: any = []
         if (res) {
            res.map(i => {
               recipts.push({
                  receiptUrl: i.filePath
               })
            })
         }
         let obj2 = {
            ...obj,
            budgetRequest: {
               ...obj.budgetRequest,
               receipts: [...recipts],
            }
         }
         updateActivity(obj2)

      }).catch(e => {
         console.log(e)
      })
   } else {
      updateActivity(obj)
   }
}

//Vendor apis

export const addVendorInvoice = (obj, eventId) => {
   //console.log(obj)
   axios.post('/vendor/addVendorInvoice', obj).then(res => {
      getCurrentEventDetails(eventId, false)

      Toast.show({
         type: 'success',
         text1: 'Updated successfully'
      })
   }).catch(e => {
      console.log(e)
      Toast.show({
         type: 'error',
         text1: 'Failed to Update'
      })
      //store.dispatch(hideLoadingModal())
   })
}

export const copyEvent = (obj, callback) => {
   //console.log(obj)
   axios.post('/event/copyEvent', obj).then(res => {
      callback(res, null)
   }).catch(e => {
      callback(null, e)
      //store.dispatch(hideLoadingModal())
   })
}

export const deleteInvitee = (guestId, eventId) => {

   axios.delete('/event/deleteInvitee/' + guestId).then(res => {
      getCurrentEventDetails(eventId, false)

      Toast.show({
         type: 'success',
         text1: 'Removed Successfully'
      })
   }).catch(e => {
      console.log(e)
      Toast.show({
         type: 'error',
         text1: 'Failed to Remove'
      })

   })
}

export const deleteDateforCustomEvent = (pollId, eventId) => {

   axios.delete('/event/deleteDate/' + pollId).then(res => {
      getCurrentEventDetails(eventId, false)

      Toast.show({
         type: 'success',
         text1: 'Removed Successfully'
      })
   }).catch(e => {
      console.log(e)
      Toast.show({
         type: 'error',
         text1: 'Failed to Remove'
      })

   })
}

export const deleteLocationforCustomEvent = (pollId, eventId) => {

   axios.delete('/event/deleteLocation/' + pollId).then(res => {
      getCurrentEventDetails(eventId, false)

      Toast.show({
         type: 'success',
         text1: 'Removed Successfully'
      })
   }).catch(e => {
      console.log(e)
      Toast.show({
         type: 'error',
         text1: 'Failed to Remove'
      })

   })
}
