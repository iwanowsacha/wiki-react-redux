import React from 'react';
import { useSelector } from 'react-redux';
import SidePanel from '../../../components/SidePanel';
import SidePanelButton from '../../../components/SidePanelButton';
import TextInput from '../../../components/UncontrolledTextInput';
import { getListTitle } from '../listSlice';

type LeftSidebarProps = {
  isShowingForm: boolean;
  isEditing: boolean;
  itemInDisplay: string;
  onButtonClick(id: string): void;
  onListTitleChange(value: string): void;
};

export default function LeftSidebar(props: LeftSidebarProps) {
  const {
    isShowingForm,
    isEditing,
    itemInDisplay,
    onButtonClick,
    onListTitleChange,
  } = props;
  const listTitle = useSelector(getListTitle);
  return (
    <SidePanel>
      <div className="p-2 sm:p-4 text-center my-4 border-b-2 border-dotted border-secondary">
        <h3>{listTitle}</h3>
        {isEditing && (
          <TextInput
            onTextChange={onListTitleChange}
            placeholder={listTitle}
            color="bg-secondary"
          />
        )}
      </div>
      <span>
        <SidePanelButton
          id="items"
          isSelected={!isShowingForm}
          onClick={onButtonClick}
        >
          Items
        </SidePanelButton>
        {isEditing && (
          <SidePanelButton
            id="new"
            isSelected={isShowingForm}
            onClick={onButtonClick}
          >
            {isShowingForm && itemInDisplay ? 'Edit' : 'New'}
          </SidePanelButton>
        )}
      </span>
    </SidePanel>
  );
}
