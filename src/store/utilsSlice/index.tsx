import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    showSuccessModal: false,
    successMessage: undefined,
    //
    showErrorModal: false,
    errorMessage: undefined,
    //
    showLoadingModal: false
}

export const utilsSlice = createSlice({
    name: 'utilsReducer',
    initialState,
    reducers: {
        showErrorModalFunc: (state, action) => {
            state.showErrorModal = true
            state.errorMessage = action.payload
        },
        hideErrorModalFunc: (state) => {
            state.showErrorModal = false
            state.errorMessage = undefined
        },
        //
        showSuccessModalFunc: (state, action) => {
            state.showLoadingModal = false
            state.showSuccessModal = true
            state.successMessage = action.payload
        },
        hideSuccessModalFunc: (state) => {
            state.showSuccessModal = false
            state.successMessage = undefined
        },
        //
        showLoadingModal: (state) => {
            state.showLoadingModal = true
        },
        hideLoadingModal: state => {
            state.showLoadingModal = false
        }
    }
})

export const { showErrorModalFunc,
    showLoadingModal,
    hideLoadingModal,
    hideErrorModalFunc,
    showSuccessModalFunc, hideSuccessModalFunc } = utilsSlice.actions