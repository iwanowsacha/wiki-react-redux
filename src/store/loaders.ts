import { createAsyncThunk } from "@reduxjs/toolkit";
import { ipcRenderer } from "electron";

export const loadList = createAsyncThunk(
    'list/loadList',
    async (title: string) => {
        const data = ipcRenderer.invoke('read-list', title);
        return data;
    }
)