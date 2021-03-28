import React, { ChangeEvent, DragEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addGroup,
  removeGroup,
  selectAllGroups,
  updateGroup,
} from './groupsSlice';
import Droppable from '../../../components/Droppable';
import ModalContainer from '../../../components/ModalContainer';
import TextInput from '../../../components/ControlledTextInput';

export default function TagGroupOptions() {
  const [textAddGroup, setTextAddGroup] = useState('');
  const tagGroups = useSelector(selectAllGroups);
  const [selectedRemoveGroup, setSelectedRemoveGroup] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedRemoveGroup(tagGroups[0]?.title);
  }, [tagGroups.length]);

  const handleTextAddGroupChange = (value: string) => {
    setTextAddGroup(value);
  };

  const handleAddGroupButtonClick = () => {
    if (!textAddGroup) return;
    const insertableGroup = {
      title: textAddGroup,
      tags: [],
    };
    dispatch(addGroup(insertableGroup));
  };

  const handleTagRemoveDrop = (e: DragEvent<HTMLDivElement>) => {
    const tag = e.dataTransfer.getData('tag');
    const group = tagGroups.find((tg) => tg.tags.includes(tag));
    if (!group) return;
    const updetableGroup = {
      id: group.title,
      changes: {
        tags: [...group.tags.filter((t: string) => t !== tag)],
      },
    };
    dispatch(updateGroup(updetableGroup));
  };

  const handleSelectedRemoveGroupChange = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedRemoveGroup(e.target.value);
  };

  const handleRemoveGroupButtonClick = () => {
    dispatch(removeGroup(selectedRemoveGroup));
  };

  return (
    <ModalContainer className="border-2" title="Group options">
      <div className="p-2">
        <h1 className="mb-2 underline text-secondary">Group options</h1>
        <div className="m-2 flex bg-primary p-2 text-secondary">
          <TextInput
            placeholder="New group"
            text={textAddGroup}
            onTextChange={handleTextAddGroupChange}
            color="bg-primary"
          />
          <button
            onClick={handleAddGroupButtonClick}
            className="hidden ml-2 lg:block text-base text-primary lg:text-2xl material-icons self-center justify-self-center lg:justify-self-end pl-1 lg:border-l-2 border-secondary"
          >
            add
          </button>
        </div>
        <div className="m-2 grid grid-col-1 md:grid-cols-4 bg-primary text-secondary p-2">
          <h1 className="col-span-4">Remove group</h1>
          <select
            className="bg-primary h-8 w-full col-span-4 md:col-span-3"
            placeholder="Remove group"
            value={selectedRemoveGroup}
            onChange={handleSelectedRemoveGroupChange}
          >
            {tagGroups.map((g) => (
              <option key={g.title} value={g.title}>
                {g.title}
              </option>
            ))}
          </select>
          <button
            onClick={handleRemoveGroupButtonClick}
            className="col-span-4 md:col-span-1 text-base lg:text-2xl material-icons self-center justify-self-center lg:justify-self-end pl-1 lg:border-l-2 border-secondary text-red-500"
          >
            delete
          </button>
        </div>
        <Droppable onDrop={handleTagRemoveDrop} droppableId="removeTag">
          <div className="my-4 py-4 px-2 text-center w-full bg-primary text-red-500 border-dashed border-secondary border-2">
            Drag tag here to remove from group
          </div>
        </Droppable>
      </div>
    </ModalContainer>
  );
}
