import { createSlice } from "@reduxjs/toolkit";
import { loadList } from "../../store/loaders";

export const slice = createSlice({
    name: 'general',
    initialState: {
        documents: {},
        isEditing: false,
        documentType: 'index',
        snackbar: ['', '']
    },
    reducers: {
        loadDocuments: (state, action) => {
            Object.assign(state.documents, action.payload);
        },
        toggleIsEditing: state => {
            state.isEditing = !state.isEditing;
        },
        setSnackbar: (state, action) => {
            state.snackbar = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadList.fulfilled, (state, action) => {
            state.documentType = 'list';
            if (!action.payload.document.hasOwnProperty('title')) state.isEditing = true;
        })
    }
});

export const { loadDocuments, toggleIsEditing, setSnackbar } = slice.actions;

export const getDocuments = (state: any) => state.general.documents;
export const getIsEditing = (state: any) => state.general.isEditing;
export const getDocumentType = (state: any) => state.general.documentType;
export const getSnackbar = (state: any) => state.general.snackbar;

export default slice.reducer;