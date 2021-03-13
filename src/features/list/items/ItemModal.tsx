import { basename } from 'path';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../../../components/IconButton';
import Snackbar from '../../../components/Snackbar';
import { DIRECTORIES } from '../../../directories';
import { sanitizeFilename } from '../../../utils/filenameSanitizer';
import useSnacbkbar from '../../../utils/hooks/useSnackbar';
import { getIsEditing, setSnackbar } from '../../general/generalSlice';
import { getListTitle, setBrowseImage, setFormVisiblity } from '../listSlice';
import { addManySelectedTags } from '../tags/tagsSlice';
import { removeItem, selectById } from './itemsSlice';

type ItemModalProps = {
  itemTitle: string;
  onEditItemClick(): void;
  onDeleteItem(): void;
};

export default function ItemModal(props: ItemModalProps) {
  const dispatch = useDispatch();
  const item = useSelector((state) => selectById(state, props.itemTitle));
  const isEditing = useSelector(getIsEditing);
  const listTitle = useSelector(getListTitle);
  const [isSnackbarOpen, toggleSnackbar] = useSnacbkbar(false);

  const image =
    basename(item?.image || '') === item?.image
      ? `${DIRECTORIES.lists}/${sanitizeFilename(listTitle)}/images/${item.image}`
      : item?.image;

  const handleEditItemClick = () => {
    dispatch(setFormVisiblity(true));
    if (item) dispatch(addManySelectedTags(item.tags));
    if (image) dispatch(setBrowseImage(image));
    props.onEditItemClick();
  };

  const handleDeleteItemClick = () => {
    toggleSnackbar();
  };

  const handleDeleteItemConfirmation = () => {
    toggleSnackbar();
    if (item) {
      dispatch(removeItem(item.title));
      dispatch(setSnackbar([`Item ${item.title} deleted`, 'text-red-500']));
    }
    props.onDeleteItem();
  };

  return (
    <>
      <div className="flex flex-col min-h-full bg-secondary">
        <div className="mb-2 p-2 relative fill flex bg-primary">
          <a target="_blank" rel="noreferrer" href={item?.link}>
            <p className="text-left text-primary mt-1" style={{ flex: '75%' }}>
              {item?.title}
            </p>
          </a>
          <div
            className="inline ml-2 mr-auto text-right pr-8"
            style={{ flex: '25%' }}
          >
            {isEditing && (
              <>
                <IconButton
                  onClick={handleDeleteItemClick}
                  classNames="py-2 px-3 mr-2 text-base text-red-500"
                >
                  delete
                </IconButton>
                <IconButton
                  onClick={handleEditItemClick}
                  classNames="py-2 px-3 text-base text-primary"
                >
                  edit
                </IconButton>
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 flex-grow">
          <div className="hidden md:flex px-2">
            <img
              src={image}
              alt=""
              className="modal-image bg-secondary rounded-md"
            />
          </div>
          <div
            className="col-span-4 px-2 md:col-span-3 text-secondary"
            dangerouslySetInnerHTML={{ __html: item?.body || '' }}
          />
        </div>
        <div className="p-2 bg-primary mt-2 text-secondary">
          Tags:{' '}
          <span id="itemDisplayTags">
            {item?.tags.join(', ').toUpperCase()}
          </span>
        </div>
      </div>
      <Snackbar
        isOpen={isSnackbarOpen}
        message="Are you sure you want to delete this item?"
        className="text-red-500"
      >
        <button
          className="text-red-500 mx-2 p-2"
          onClick={handleDeleteItemConfirmation}
        >
          Delete
        </button>
        <button
          className="text-primary mx-2 p-2 bg-secondary"
          onClick={handleDeleteItemClick}
        >
          Cancel
        </button>
      </Snackbar>
    </>
  );
}
