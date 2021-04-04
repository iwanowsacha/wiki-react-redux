import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilePickerButton from '../../../components/FilePickerButton';
import SidePanel from '../../../components/SidePanel';
import SidePanelButton from '../../../components/SidePanelButton';
import TextInput from '../../../components/UncontrolledTextInput';
import delay from '../../../utils/inputDelay';
import {
  getItemCount,
  getSearchText,
  orderItemsAsc,
  orderItemsDesc,
  orderItemsRevert,
  searchItem,
} from '../items/itemsSlice';
import { getBrowseImage, setBrowseImage } from '../listSlice';
import TagPill from '../tags/TagPill';
import { getSelectedTags } from '../tags/tagsSlice';

type RightSidebarProps = {
  isShowingForm: boolean;
  onButtonClick(id: string): void;
  onTagClick(title: string): void;
};

export default function RightSidebar(props: RightSidebarProps) {
  const dispatch = useDispatch();
  const { isShowingForm, onButtonClick, onTagClick } = props;
  const selectedImage = useSelector(getBrowseImage);
  const selectedTags = useSelector(getSelectedTags);
  const searchText = useSelector(getSearchText);
  const itemCount = useSelector(getItemCount);
  const [showOrderButtons, setShowOrderButtons] = useState(false);

  const handleImageFilePicked = (path: string) => {
    dispatch(setBrowseImage(path));
  };

  const handleItemSearch = (value: string) => {
    dispatch(searchItem(value));
  };

  const handleOrderAsc = () => {
    dispatch(orderItemsAsc());
  };

  const handleOrderDesc = () => {
    dispatch(orderItemsDesc());
  };

  const handleOriginalOrder = () => {
    dispatch(orderItemsRevert());
  };

  const handleOrderClick = () => {
    setShowOrderButtons(!showOrderButtons);
  }

  return (
    <SidePanel>
      {!isShowingForm ? (
        <>
          <div className=" px-2 pb-2 text-center my-4 border-b-2 border-dotted border-secondary">
            <div className="bg-secondary text-secondary py-2 px-3 rounded">
              <TextInput
                initialValue={searchText}
                color="bg-secondary"
                placeholder="Search items"
                onTextChange={delay(handleItemSearch, 500)}
              />
            </div>
          </div>
          <SidePanelButton id="order" onClick={handleOrderClick}>
            Order List
          </SidePanelButton>
          {showOrderButtons &&    
            <div className="mx-3">
              <SidePanelButton id="orderAsc" onClick={handleOrderAsc}>
                Order Asc (A-Z)
              </SidePanelButton>
              <SidePanelButton id="orderDesc" onClick={handleOrderDesc}>
                Order Desc (Z-A)
              </SidePanelButton>
              <SidePanelButton id="orderOriginal" onClick={handleOriginalOrder}>
                Original Order
              </SidePanelButton>
            </div>
          }
        </>
      ) : (
        <FilePickerButton
          fileTypes="image/*"
          onFileChange={handleImageFilePicked}
        >
          {selectedImage && (
            <img
              alt=""
              className="mx-auto mt-4 selected-image-list"
              src={selectedImage}
            />
          )}
          <SidePanelButton id="image" onClick={console.log}>
            Image
          </SidePanelButton>
        </FilePickerButton>
      )}
      <SidePanelButton
        onClick={onButtonClick}
        id={isShowingForm ? 'tags' : 'filter'}
      >
        {isShowingForm ? 'Tags' : 'Filter'}
      </SidePanelButton>
      {!isShowingForm &&
        <h2 className="mt-4 mx-3 text-primary text-center">{itemCount} item(s)</h2>
      }
      <div className="hidden md:flex px-4 pb-4 flex-wrap flex-row mt-4">
        {selectedTags.length > 0 &&
          selectedTags.map((t: string) => (
            <TagPill
              onTagClick={onTagClick}
              isDraggable={false}
              key={t}
              title={t}
            />
          ))}
      </div>
    </SidePanel>
  );
}
