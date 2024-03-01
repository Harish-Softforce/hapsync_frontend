import { store } from '../index'
import axios from '../../axios'
import { hideLoadingModal, showSuccessModalFunc, showErrorModalFunc, showLoadingModal } from '../utilsSlice'
import {
  addEventSuccess,
  getEventCatsSuccess,
  getEventAlbumSuccess,
  getMyEventsSuccess,
  getUpcomingEventsSuccess,
  setIsLoading,
  getMemoriesEventsSuccess,
  getInvitationsSuccess,
  clearEventAlbumSuccess,
  getInterestedEventsSuccess,
  getRecommendedEventsSuccess,
  getOrgMembersSuccess,
  getVendorAlbumSuccess,
  clearVendorAlbumSuccess
} from '../eventsSlice'
import { removeFromDrafts } from '../draftsSlice'

import Config from "react-native-config";
//import {RNS3} from 'react-native-aws3';
import { createThumbnail } from 'react-native-create-thumbnail'

//import series from 'async/series';
import parallel from 'async/parallel';
import moment from 'moment'

import AWS from 'aws-sdk';

// Upload image to Aws S3 bucket

export const uploadFile = async (file, uid, cb) => {

  let res = await axios.get('/user/getAWSCredentials')
  if (res.status != 200) {
    cb("Failed")
    return
  }
  let region = res.data.region
  let accessKey = res.data.accessKey
  let bucketName = res.data.bucketName
  let secretKey = res.data.secretKey

  /* const s3bucket = new AWS.S3({
    region: Config.REGION,
    accessKeyId: Config.ACCESS_KEY,
    secretAccessKey: Config.SECRET_KEY,
    Bucket: Config.BUCKET_NAME,
    signatureVersion: 'v4',
  }); */
  const s3bucket = new AWS.S3({
    region: region,
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    Bucket: bucketName,
    signatureVersion: 'v4',
  });


  const contentType = file.mime;
  const contentDeposition = `inline;filename="${file.fileName}"`;
  const fPath = file.path;
  //const base64 = await fs.readFile(fPath, 'base64');
  const res1 = await fetch(fPath)
  const arrayBuffer = await res1.blob()
  //const arrayBuffer = decode(base64);

  const params = {
    Bucket: bucketName,
    Key: Config.BUCKET_FOLDER+"/"+uid + "/" + file.fileName,
    Body: arrayBuffer,
    ContentDisposition: contentDeposition,
    ContentType: contentType,
    ACL: 'public-read',
  };
  s3bucket.upload(params, (error, data) => {
    if (error) {
      console.log(error)
      cb(error)
    } else {
      //console.log(JSON.stringify(data));
      cb(null, data.Location)
    }
  });

};


export const getEvents = async (id: number, showLoader: boolean) => {
  if (showLoader != false) {
    store.dispatch(setIsLoading(true))
  }

  let role = store.getState().user.userData.role
  let uid = store.getState().user.userData.id

  await axios.get(`/user/${id}/events`).then((res) => {

    //console.log(res.data)

    if (role == "USER") {

      if (Array.isArray(res.data)) {
        let completedEvents = res.data.filter(each => moment(each.timings[0].slot+" "+String(each.timings[0].endTime?each.timings[0].endTime:"23:59:00")).isBefore(moment().format("YYYY-MM-DD HH:mm:ss")))
        let inCompleteEvents = res.data.filter(each => moment(each.timings[0].slot+" "+String(each.timings[0].endTime?each.timings[0].endTime:"23:59:00")).isSameOrAfter(moment().format("YYYY-MM-DD HH:mm:ss")))

        let upcoming = inCompleteEvents.filter(each =>
          each.owner == id || each.invitees.filter(item => item.userId == id)[0].response == 'ACCEPTED')

        let memories = completedEvents.filter(each =>
          each.owner == id || each.invitees.filter(item => item.userId == id)[0].response == 'ACCEPTED')

        upcoming.forEach(each => {
          if (each.owner == id) {
            each.invitationStatus = null
          } else {
            each.invitationStatus = 'ACCEPTED'
          }
        })

        memories.forEach(each => {
          if (each.owner == id) {
            each.invitationStatus = null
          } else {
            each.invitationStatus = 'ACCEPTED'
          }
        })

        let invitations = inCompleteEvents.filter(each =>
          each.owner != id && each.invitees.filter(item => item.userId == id)[0].response == 'PENDING')

        let mine = inCompleteEvents.filter(each => each.owner == id)

        store.dispatch(getMyEventsSuccess(mine))
        store.dispatch(getUpcomingEventsSuccess(upcoming))
        store.dispatch(getMemoriesEventsSuccess(memories))
        store.dispatch(getInvitationsSuccess(invitations))
      }
      //store.dispatch(hideLoadingModal())

    } else if (role == "VENDOR") {

      //console.log(res.data)

      if (Array.isArray(res.data)) {
        //let completedEvents = res.data.filter(each => moment(each.timings[0].slot).isBefore(moment().format("YYYY-MM-DD")))
        let inCompleteEvents = res.data.filter(each => moment(each.timings[0]?.slot).isSameOrAfter(moment().format("YYYY-MM-DD")))

        let upcoming = []
        let interested = []

        inCompleteEvents.forEach(event => {
          event.activities.forEach(task => {
            if (task.vendors?.find(vendor => vendor.userId == uid)?.status == "HIRED") {
              let obj = task
              obj.event = event
              obj.event.activities = undefined
              upcoming.push(obj)
            } else if (task.vendors?.find(vendor => vendor.userId == uid)?.status == "EVALUATING") {
              let obj = task
              obj.event = event
              obj.event.activities = undefined
              interested.push(obj)
            }
          })
        })

        let recommended = inCompleteEvents.filter(each =>
          each.activities?.find(i => i.vendors.filter(vendor => vendor.userId == uid).length == 0)
        )

        store.dispatch(getUpcomingEventsSuccess(upcoming))
        store.dispatch(getInterestedEventsSuccess(interested))
        store.dispatch(getRecommendedEventsSuccess(recommended))

      }

    } else if (role == "ORGANIZATION") {
      if (Array.isArray(res.data)) {
        let completedEvents = res.data.filter(each => moment(each.timings[0].slot).isBefore(moment().format("YYYY-MM-DD")))
        let inCompleteEvents = res.data.filter(each => moment(each.timings[0]?.slot).isSameOrAfter(moment().format("YYYY-MM-DD")))
        store.dispatch(getUpcomingEventsSuccess(inCompleteEvents))
        store.dispatch(getMemoriesEventsSuccess(completedEvents))
      }
    }

    store.dispatch(setIsLoading(false))

  }).catch((error) => {
    console.log('error login ', error)
    if (showLoader) {
      store.dispatch(showErrorModalFunc("Error encountered while getting events"))
    }
    //store.dispatch(hideLoadingModal())
    store.dispatch(setIsLoading(false))
  })
}

export const getEventsCategories = async (uid, showModal) => {
  if (showModal) {
    store.dispatch(showLoadingModal())
  }

  await axios.get(`eventCategory/${uid}/getAllEventCategories`).then((res) => {
    if (showModal) {
      store.dispatch(hideLoadingModal())
    }

    store.dispatch(getEventCatsSuccess(res.data))
  }).catch((error) => {
    console.log('error login ', error)
    store.dispatch(showErrorModalFunc("Error encountered while getting events categories"))
    if (showModal) {
      store.dispatch(hideLoadingModal())
    }
  })
}

/**
 * ADD EVENT
 */
// passed navigation
export const addEvent = (data, img, callback) => {


  store.dispatch(showLoadingModal())
  //console.log(JSON.stringify(data))
  // console.log(img)
  const saveEventToDb = (data) => axios.post('/event/addevent', data).then((res) => {
    getEvents(data.userId, false)

    //console.log(res)
    // on success naviagting to homescreen and removing it from draft
    store.dispatch(hideLoadingModal())
    setTimeout(() => {
      callback(res.data.id)
    }, 1000)

  }).catch((error) => {
    console.log('error login ', error)
    store.dispatch(hideLoadingModal())
    setTimeout(() => {
      store.dispatch(showErrorModalFunc("Error encountered while adding event"))
    }, 1000)
  })

  const options = {
    headers: {
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    }
  }
  if (img !== undefined) {
    uploadFile(img, "User-" + data.userId, (err, imgLoc) => {
      data.imagePath = imgLoc
      data.imageFileName = img.fileName
      //console.log(imgLoc)
      saveEventToDb(data)
    })
  } else {
    // data.imagePath = null
    // data.imageFileName = null
    saveEventToDb(data)
  }
  // console.log(JSON.stringify(data))
  // console.log(data)


}

/**
 * INVITEE UPDATE
 */
export const inviteeUpdate = async (id) => {

  store.dispatch(showLoadingModal())

  return axios.post(`/event/${id}/inviteeUpdate`, data).then((res) => {
    store.dispatch(hideLoadingModal())

    getEvents(1, false)

  }).catch((error) => {
    console.log('error login ', error)
    store.dispatch(showErrorModalFunc("Error encountered while logging in"))

    store.dispatch(hideLoadingModal())
  })

}

export const getEventAlbum = (id) => {
  store.dispatch(showLoadingModal())

  axios.get(`/event/${id}/getEventAlbum`).then((res) => { // console.log(res)

    if (Array.isArray(res.data)) {
      store.dispatch(getEventAlbumSuccess(res.data))
    }
    store.dispatch(hideLoadingModal())
  }).catch((error) => {
    console.log('error login ', error)
    store.dispatch(hideLoadingModal())
    setTimeout(() => {
      store.dispatch(showErrorModalFunc("Error encountered while getting gallery"))
    }, 1000)
  })
}

export const clearEventAlbum = () => {
  store.dispatch(clearEventAlbumSuccess(null))
}
export const clearVendorAlbum = () => {
  store.dispatch(clearVendorAlbumSuccess(null))
}

export const addEventAlbum = (data, eventId, userId) => {
  //console.log("In addEventAlbum")
  store.dispatch(showLoadingModal())
  uploadEventAlbum(data, eventId, userId, "EVENT").then((res) => {
    axios.post('/event/addEventAlbum', res).then((res) => { // console.log(res)
      //console.log("Successfully uploaded")
      getEventAlbum(eventId)
      //store.dispatch(hideLoadingModal())
    }).catch((error) => {
      console.log('error login ', error)
      store.dispatch(hideLoadingModal())
      store.dispatch(showErrorModalFunc("Error encountered while adding"))
    })
  }).catch(e => {
    console.log(e)
    store.dispatch(hideLoadingModal())
  });
}

export const uploadEventAlbum = (data, eventId, userId, albumType) => { // const arr=[]
  //console.log("Input Data")
  //console.log(data)

  let keyName = ""
  if (albumType == "EVENT") {
    keyName = "Event-" + eventId
  } else if (albumType == "VENDOR") {
    keyName = "Vendor-" + userId
  }

  return new Promise((resolve, reject) => {
    let itemList = []
    parallel(data.map((file) => {
      return (callback) => {
        uploadFile(file, keyName, (err, filePath) => {
          const fileType = file.mime.substring(0, file.mime.indexOf('/'))
          //console.log("uploaded " + fileType + " " + filePath)
          if (filePath == null) {
            throw "Failed to upload image to S3"
          }
          if (fileType == "video") {
            //console.log("If video")

            createThumbnail({ url: filePath, timeStamp: 1000 }).then((response) => { // console.log({ response })
              //console.log("Thumbnail path "+response.path)
              const file1 = {
                fileName: response.path.substring(response.path.lastIndexOf('/') + 1, response.path.length),
                mime: response.mime,
                path: response.path
              }
              uploadFile(file1, keyName, (err, filePath1) => {
                if (filePath1 == null) {
                  throw "Failed to upload image to S3"
                }
                // console.log(filePath1)
                //console.log("Uploaded Thumbnail " + filePath1);
                itemList.push({
                  filePath: filePath,
                  fileType: fileType,
                  thumbnailUrl: filePath1,
                  eventId: eventId,
                  albumType: albumType,
                  userId: userId
                });
                callback();
              });
            }).catch(e => {
              console.log("err in thumbnail", e)
            })

          } else if (fileType == "image") {
            itemList.push({
              filePath: filePath,
              fileType: fileType,
              eventId: eventId,
              albumType: albumType,
              userId: userId
            });
            callback();
          }
        })
      }
    }), (err) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(itemList);
    });
  })

}

export const inviteeEventConfirmation = async (obj, navigation) => {
  store.dispatch(showLoadingModal())

  await axios.post(`/invitee/inviteeEventConfirmation`, obj).
    then(async (res) => {
      if (res.status == 200) {
        await getEvents(obj.userId, false)
        navigation.navigate("HomeScreen")
        store.dispatch(hideLoadingModal())
      }
    }).catch((error) => {
      console.log('error login ', error)
      store.dispatch(showErrorModalFunc("Error encountered"))
      store.dispatch(hideLoadingModal())
    })
}


export const getVendorAlbum = (id) => {
  store.dispatch(showLoadingModal())

  axios.get(`/event/${id}/getVendorAlbum`).then((res) => { // console.log(res)

    if (Array.isArray(res.data)) {
      store.dispatch(getVendorAlbumSuccess(res.data))
    }
    store.dispatch(hideLoadingModal())
  }).catch((error) => {
    console.log('error login ', error)
    store.dispatch(hideLoadingModal())
    setTimeout(() => {
      //store.dispatch(showErrorModalFunc("Error encountered while getting gallery"))
    }, 1000)
  })
}


export const addVendorAlbum = (data, userId) => {
  //console.log("In addEventAlbum")
  store.dispatch(showLoadingModal())
  uploadEventAlbum(data, null, userId, "VENDOR").then((res) => {
    axios.post('/event/addEventAlbum', res).then((res) => { // console.log(res)
      //console.log("Successfully uploaded")
      getVendorAlbum(userId)
      //store.dispatch(hideLoadingModal())
    }).catch((error) => {
      console.log('error login ', error)
      store.dispatch(hideLoadingModal())
      store.dispatch(showErrorModalFunc("Error encountered while adding"))
    })
  }).catch(e => {
    console.log(e)
    store.dispatch(hideLoadingModal())
  });
}

export const getOrgMembers = async (orgId) => {
  await axios.get(`/user/${orgId}/getOrgMembers`).then((res) => {
    store.dispatch(getOrgMembersSuccess(res.data))
  }).catch((error) => {
    console.log('error login ', error)
    store.dispatch(showErrorModalFunc("Error encountered"))
  })
}