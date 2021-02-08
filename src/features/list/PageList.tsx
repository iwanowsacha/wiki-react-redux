import React, { useState, useEffect, useRef } from "react";
import { getSelectedTags, addSelectedTag, removeSelectedTag } from "./tags/tagsSlice";
import { getFormVisibility, getListTitle, setFormVisiblity, setListTitle } from "./listSlice";
import { getIsEditing, getSnackbar, setSnackbar } from "../general/generalSlice";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "../../components/Modal";
import { ItemModal } from "./items/ItemModal";
import { TagsModal } from "./tags/TagsModal";
import { List } from "./items/List";
import { ListForm } from "./items/ListForm";
import { LeftSidebar } from "./containers/LeftSidebar";
import { RightSidebar } from "./containers/RightSidebar";
import { Snackbar } from "../../components/Snackbar";
import { CSSTransition } from "react-transition-group";
import { ipcRenderer } from "electron";
import { getAllTags, selectAllItems, upsertMany, getImagesChanges } from "./items/itemsSlice";
import { selectAllGroups } from "./groups/groupsSlice";
import { createSelector } from "@reduxjs/toolkit";

const getList = createSelector(
    [
        getListTitle,
        selectAllItems,
        getAllTags,
        selectAllGroups
    ],
    (title: string, items: Array<any>, tags: Array<string>, groups: Array<any>) => {
        return {
            title: title,
            items: items,
            allTags: tags,
            tagGroups: groups
        }
    }
)

export function PageList() {
    const dispatch = useDispatch();
    const list = useSelector(getList);
    const isEditing = useSelector(getIsEditing);
    const isShowingForm = useSelector(getFormVisibility);
    const selectedTags = useSelector(getSelectedTags);
    const snackbarMessage = useSelector(getSnackbar);
    const isFirstRun = useRef(true);
    const itemsImageChanges = useSelector(getImagesChanges);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemInDisplay, setItemInDisplay] = useState('');
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [playFormAnimation, setPlayFormAnimation] = useState(false);
    const [listTitleText, setListTitleText] = useState('');

    useEffect(()=> {
        window.addEventListener('click', (event) => {
            if (event.target.id == "modal") {
                setIsModalOpen(false);
                setItemInDisplay('');
            }
        });
    }, []);

    useEffect(() => {
        setIsSnackbarOpen(true);
        setTimeout(() => setIsSnackbarOpen(false), 1000);
    }, [snackbarMessage]);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        if (isEditing) {
            dispatch(setSnackbar(['Editing list', 'text-primary']));
        }
        else if (!isEditing) {
            ipcRenderer.invoke('save-list', list, listTitleText, itemsImageChanges);
        }
    }, [isEditing]);

    ipcRenderer.on('list-saved', (e, items) => {
        if (listTitleText) dispatch(setListTitle(listTitleText));
        dispatch(setSnackbar(['List saved successfully', 'text-primary']));
        dispatch(upsertMany(items));
        setListTitleText('');
    });

    useEffect(() => {
        setPlayFormAnimation(true);
        setTimeout(() => setPlayFormAnimation(false), 500);
    }, [isShowingForm]);

    const handleModalCloseClick = () => {
        setIsModalOpen(false);
    }

    const handleDeleteItemClick = () => {
        handleModalCloseClick();
        setItemInDisplay('');
    }

    const handleLeftSidebarButtonClick = (id: string) => {
        dispatch(setFormVisiblity(id !== 'items'));
        setItemInDisplay('');
    }

    const handleRightSidebarButtonClick = () => {
        setIsModalOpen(true);
        setItemInDisplay('');
    }

    const handleTagClick = (title: string) => {
        if (selectedTags.includes(title)) {
            dispatch(removeSelectedTag(title));
        } else {
            dispatch(addSelectedTag(title));
        }
    }

    const handleItemClick = (title: string) => {
        setIsModalOpen(true);
        setItemInDisplay(title);
    }

    const handleListTitleChange = (value: string) => {
        setListTitleText(value);
    }

    return (
        <main className="flex relative flex-auto">
            <CSSTransition unmountOnExit in={playFormAnimation} timeout={500} classNames="slide-right">
                    <section className="absolute h-screen bg-primary left-0 z-100"></section>
            </CSSTransition>
            <CSSTransition unmountOnExit in={playFormAnimation} timeout={500} classNames="slide-right">
                    <section className="absolute h-screen bg-primary right-0 z-100"></section>
            </CSSTransition>
            {!playFormAnimation &&
                <>
                    <Modal isOpen={isModalOpen} onCloseClick={handleModalCloseClick}>
                        {itemInDisplay && !isShowingForm
                            ? <ItemModal itemTitle={itemInDisplay} onEditItemClick={handleModalCloseClick} onDeleteItem={handleDeleteItemClick}/>
                            : <TagsModal showFilter={!isShowingForm} onTagClick={handleTagClick}/>
                        }
                    </Modal>
                    <LeftSidebar isEditing={isEditing} isShowingForm={isShowingForm} onButtonClick={handleLeftSidebarButtonClick} itemInDisplay={itemInDisplay} onListTitleChange={handleListTitleChange} />
                    <section className="flex-1">
                        {!isShowingForm
                            ? <section className="h-full" id="bookshelf"><List onItemClick={handleItemClick}/></section>
                            : <ListForm item={itemInDisplay}/>
                        }
                        <Snackbar isOpen={isSnackbarOpen} message={snackbarMessage[0]} className={snackbarMessage[1]} />
                    </section>
                    <RightSidebar isShowingForm={isShowingForm} onButtonClick={handleRightSidebarButtonClick} onTagClick={handleTagClick} />
                </>
            }
        </main>
    );
}