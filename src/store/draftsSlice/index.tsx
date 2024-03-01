import { createSlice } from "@reduxjs/toolkit";

type DraftItem = {

}

type Drafts = {
    [key: string]: DraftItem
}

type DraftsState = {
    drafts: Drafts
}

let initialState: DraftsState = {
    drafts: undefined
}

export const draftsSlice = createSlice({
    name: 'draftsReducer',
    initialState,
    reducers: {
        addToDrafts: (state, action) => {
            let newDrafts = { ...state.drafts }
            let id = action.payload.id;

            newDrafts[id] = action.payload?.data

            state.drafts = newDrafts

        },
        removeFromDrafts: (state, action) => {
            let newDrafts = { ...state.drafts }
            let idToRemove = action.payload.id;

            delete newDrafts[idToRemove]
            state.drafts = newDrafts
        },
        clearAllDrafts: () => initialState
    }
})

export const { addToDrafts, removeFromDrafts, clearAllDrafts } = draftsSlice.actions