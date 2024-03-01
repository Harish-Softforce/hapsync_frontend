import { store } from '../index'
import axios from '../../axios'
import {
    hideLoadingModal,
    showSuccessModalFunc,
    showErrorModalFunc,
    showLoadingModal,
} from '../utilsSlice'
import { loginSuccess } from '../userSlice'
import { uploadFile } from './events'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * login
 */

export const login = async data => {

    store.dispatch(showLoadingModal())

    console.log('login called ', data)
    return axios.post('/user/login', data)
        .then((res) => {
            //console.log(res.data)
            store.dispatch(hideLoadingModal())

            if (res?.data?.status=="success") {
                store.dispatch(loginSuccess(res.data))
            } else {
                setTimeout(() => {
                    store.dispatch(showErrorModalFunc(res.data.status))
                }, 1000)

            }

            console.log('login data ', res.data)

        }).catch((error) => {
            console.log('error login ', error)
            store.dispatch(showErrorModalFunc('Error encountered while logging in'
            ))

            store.dispatch(hideLoadingModal())
        })

}

/**
 * Register
 */

export const register = async (data, navigation) => {
    console.log('register called ', data)
    store.dispatch(showLoadingModal())

    return axios.post('/user/signup', data)
        .then((res) => {

            store.dispatch(hideLoadingModal())

            if (res) {
                setTimeout(() => {
                    store.dispatch(showSuccessModalFunc(res.data.status))
                }, 1000)

                if (res.data.status == 'You have registered successfully') {
                    navigation.navigate("LoginScreen")
                }
            }

        }).catch((error) => {
            console.log('error register ', error)
            store.dispatch(hideLoadingModal())
            setTimeout(() => {
                store.dispatch(showErrorModalFunc("Error encountered while registering "))
            }, 1000)
        })
}

export const updateUser = (obj, image, showLoader, chatClient) => {
    if (showLoader || chatClient) {
        store.dispatch(showLoadingModal())
    }
    let data = obj
    //console.log(data)

    const updateUserApi = (data) => axios.put('/user/updateUser', data)
        .then((res) => {
            if (showLoader) {
                store.dispatch(hideLoadingModal())
                Toast.show({
                    type: 'success',
                    text1: 'Updated Successfully'
                })
            }
            //console.log(res)
            store.dispatch(loginSuccess(res.data))
            let userData = res.data
            console.log(res.data.id)
            if (chatClient) {
                (async () => {
                    let userToken = await AsyncStorage.getItem('@stream_push_token')
                    const user = {
                        id: `${userData?.id}_user`,
                        name: userData?.name,
                        phone: userData?.phone,
                        role: String(userData?.role).toLowerCase(),
                        event_notification: String(userData?.eventNotification),
                        event_sound: String(userData?.eventSound),
                        task_notification: String(userData?.taskNotification),
                        task_sound: String(userData?.taskSound),
                    }
                    await chatClient?.chatClient?.disconnectUser()
                    console.log(userToken)
                    await chatClient?.chatClient?.connectUser(user, userToken)
                        .then(r => {
                            console.log(r)
                        }).catch(e => {
                            console.log(e)
                        })
                    store.dispatch(hideLoadingModal())
                })()
            }
        }).catch((error) => {
            console.log('error ', error)
            store.dispatch(hideLoadingModal())
            Toast.show({
                type: 'error',
                text1: 'Error Encountered'
            })
        })

    if (image.mime) {
        uploadFile(image, "User-"+data.id, (err, imgLoc) => {
            if (err) {
                Toast.show({
                    type: 'error',
                    text1: 'Error Encountered'
                })
                return
            } else {
                data.imageUrl = imgLoc
                updateUserApi(data)
            }
        })
    } else {
        updateUserApi(data)
    }

}

export const changePassword = async (obj, navigation) => {

    store.dispatch(showLoadingModal())

    await axios.put('/user/changePassword', obj)
        .then((res) => {
            store.dispatch(hideLoadingModal())
            Toast.show({
                type: 'success',
                text1: 'Updated Successfully'
            })
            navigation.pop()
        }).catch((error) => {
            console.log(error)
            store.dispatch(hideLoadingModal())
            Toast.show({
                type: 'error',
                text1: 'Error Encountered'
            })
        })
}

export const sendUserFeedback = async (obj, navigation) => {

    store.dispatch(showLoadingModal())

    await axios.post('/sms/sendFeedbackMail', obj)
        .then((res) => {
            store.dispatch(hideLoadingModal())
            Toast.show({
                type: 'success',
                text1: 'Feedback Sent'
            })
            navigation.pop(2)
        }).catch((error) => {
            console.log(error)
            store.dispatch(hideLoadingModal())
            Toast.show({
                type: 'error',
                text1: 'Error Encountered'
            })
        })
}

export const addUserToOrg = (obj) => {

    axios.post('/user/addUserToOrg', obj)
        .then((res) => {
            if (res.data.status) {
                Toast.show({
                    type: 'error',
                    text1: res.data.status
                })
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'Associated Successfully'
                })
                //console.log(res)
                store.dispatch(loginSuccess(res.data))
            }

        }).catch((error) => {
            console.log('error ', error)
            Toast.show({
                type: 'error',
                text1: 'Error Encountered'
            })
        })
}

export const removeUserFromOrg = (id) => {

    store.dispatch(showLoadingModal())

    axios.delete(`/user/${id}/removeUserFromOrg`)
        .then((res) => {
            store.dispatch(hideLoadingModal())
            console.log(res.data)
            Toast.show({
                type: 'success',
                text1: 'Removed Successfully'
            })
            store.dispatch(loginSuccess(res.data))
        }).catch((error) => {
            store.dispatch(hideLoadingModal())
            console.log('error ', error)
            Toast.show({
                type: 'error',
                text1: 'Error Encountered'
            })
        })
}