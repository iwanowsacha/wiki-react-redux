import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { ipcRenderer } from 'electron';
import { createSelector } from '@reduxjs/toolkit';
import {
  getSelectedTags,
  addSelectedTag,
  removeSelectedTag,
} from './tags/tagsSlice';
import {
  getFormVisibility,
  getListTitle,
  setFormVisiblity,
  setListTitle,
} from './listSlice';
import {
  getIsEditing,
  getSnackbar,
  setSnackbar,
} from '../general/generalSlice';
import Modal from '../../components/Modal';
import ItemModal from './items/ItemModal';
import TagsModal from './tags/TagsModal';
import List from './items/List';
import ListForm from './items/ListForm';
import LeftSidebar from './containers/LeftSidebar';
import RightSidebar from './containers/RightSidebar';
import Snackbar from '../../components/Snackbar';
import {
  getAllTags,
  selectAllItems,
  upsertMany,
  getImagesChanges,
} from './items/itemsSlice';
import { selectAllGroups } from './groups/groupsSlice';
import useMounted from '../../utils/hooks/useMounted';
import useModal from '../../utils/hooks/useModal';

const getList = createSelector(
  [getListTitle, selectAllItems, getAllTags, selectAllGroups],
  (
    title: string,
    items: Array<any>,
    tags: Array<string>,
    groups: Array<any>
  ) => {
    return {
      title,
      items,
      allTags: tags,
      tagGroups: groups,
    };
  }
);


export default function PageList() {
  const dispatch = useDispatch();
  const list = useSelector(getList);
  const isEditing = useSelector(getIsEditing);
  const isShowingForm = useSelector(getFormVisibility);
  const selectedTags = useSelector(getSelectedTags);
  const snackbarMessage = useSelector(getSnackbar);
  const itemsImageChanges = useSelector(getImagesChanges);
  const [isModalOpen, toggleModal] = useModal();
  const [itemInDisplay, setItemInDisplay] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [playFormAnimation, setPlayFormAnimation] = useState(false);
  const [listTitleText, setListTitleText] = useState('');
  const isMounted = useMounted();

  useEffect(() => {
    if (!isMounted) return;
    if (isEditing) {
      dispatch(setSnackbar(['Editing list', 'text-primary']));
    } else if (!isEditing) {
      dispatch(setSnackbar(['List saved succesfully', 'text-primary']));
      ipcRenderer.invoke('save-list', list, listTitleText, itemsImageChanges);
    }
  }, [isEditing]);

  useEffect(() => {
    if (snackbarMessage[0]) {
      setIsSnackbarOpen(true);
      setTimeout(() => {
        setIsSnackbarOpen(false);
      }, 1000);
    }
  }, [snackbarMessage]);


  ipcRenderer.on('list-saved', (_e, items) => {
    if (listTitleText) dispatch(setListTitle(listTitleText));
    dispatch(setSnackbar(['List saved successfully', 'text-primary']));
    dispatch(upsertMany(items));
    setListTitleText('');
  });

  useEffect(() => {
    setPlayFormAnimation(true);
    setTimeout(() => setPlayFormAnimation(false), 500);
    if (!isShowingForm) setItemInDisplay('');
  }, [isShowingForm]);

  const toggleModalAndResetItemInDisplay = () => {
    toggleModal();
    setItemInDisplay('');
  };

  const handleLeftSidebarButtonClick = (id: string) => {
    if (isShowingForm && id !== 'items') return;
    if (id === 'items') {
      setItemInDisplay('');
    }
    dispatch(setFormVisiblity(id !== 'items'));
  };

  const handleTagClick = (title: string) => {
    if (selectedTags.includes(title)) {
      dispatch(removeSelectedTag(title));
    } else {
      dispatch(addSelectedTag(title));
    }
  };

  const handleItemClick = (title: string) => {
    toggleModal();
    setItemInDisplay(title);
  };

  const handleListTitleChange = (value: string) => setListTitleText(value);

  const handleFormEmpty = () => setItemInDisplay('');

  return (
    <main className="flex relative flex-auto">
      <CSSTransition
        unmountOnExit
        in={playFormAnimation}
        timeout={500}
        classNames="slide-right"
      >
        <section className="absolute h-screen bg-primary left-0 z-100" />
      </CSSTransition>
      <CSSTransition
        unmountOnExit
        in={playFormAnimation}
        timeout={500}
        classNames="slide-right"
      >
        <section className="absolute h-screen bg-primary right-0 z-100" />
      </CSSTransition>
      <LeftSidebar
            isEditing={isEditing}
            isShowingForm={isShowingForm}
            onButtonClick={handleLeftSidebarButtonClick}
            itemInDisplay={itemInDisplay}
            onListTitleChange={handleListTitleChange}
          />
      {!playFormAnimation && (
        <>
          <Modal isOpen={isModalOpen} onCloseClick={toggleModal}>
            {itemInDisplay && !isShowingForm ? (
              <ItemModal
                itemTitle={itemInDisplay}
                onEditItemClick={toggleModal}
                onDeleteItem={toggleModalAndResetItemInDisplay}
              />
            ) : (
              <TagsModal
                showFilter={!isShowingForm}
                onTagClick={handleTagClick}
              />
            )}
          </Modal>
          <section className="flex-1">
            {!isShowingForm ? (
              <section className="h-full" id="bookshelf">
                <List onItemClick={handleItemClick} />
              </section>
            ) : (
              <ListForm item={itemInDisplay} onFormEmptying={handleFormEmpty}/>
            )}
            <Snackbar
              isOpen={isSnackbarOpen}
              message={snackbarMessage[0]}
              className={snackbarMessage[1]}
            />
          </section>
          <RightSidebar
            isShowingForm={isShowingForm}
            onButtonClick={toggleModalAndResetItemInDisplay}
            onTagClick={handleTagClick}
          />
        </>
      )}
    </main>
  );
}
