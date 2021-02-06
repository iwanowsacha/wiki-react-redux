import React, { useEffect} from "react";
import { loadDocuments, toggleIsEditing, getDocumentType} from "../features/general/generalSlice";
import { ipcRenderer } from "electron";
import { useDispatch, useSelector } from "react-redux";
import { PageIndex } from "./Index/PageIndex";
import { Header } from "./Header";
import { PageList } from "../features/list/PageList";
import { loadList } from "../store/loaders";

export function PageController() {
    const dispatch = useDispatch();
    const documentType = useSelector(getDocumentType);
    useEffect(() => {
        ipcRenderer.invoke('documents').then(result => {
            dispatch(loadDocuments(result));
        });
    });

    const handleEditSaveClick = (type: string) => {
        if (type == "save" || type == "edit") dispatch(toggleIsEditing());
    }

    ipcRenderer.on('new-list', () => {
        dispatch(loadList(''));
    });

    let page = null;
    switch(documentType) {
        case "index":
            page = <PageIndex />
            break;
        case "list":
            page = <PageList />
            break;
    }

    return(
        <div className="flex flex-col min-h-full">
            <Header showESButtons={true} showMenuButton={true} onHeaderButtonClick={handleEditSaveClick}/>
            {page}
        </div>
    );
}
