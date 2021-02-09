import React, { DragEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Droppable from '../../../components/Droppable';
import ModalContainer from '../../../components/ModalContainer';
import TagPill from '../tags/TagPill';
import {
  addTagCustomFilter,
  getCustomTags,
  removeTagCustomFilter,
} from '../tags/tagsSlice';

export default function CustomTagFilter() {
  const dispatch = useDispatch();
  const { customHas, customNot } = useSelector(getCustomTags);

  const handleCustomDrop = (e: DragEvent<HTMLDivElement>, zoneId: string) => {
    const tag = e.dataTransfer.getData('tag');
    if (!tag) return;
    if ([zoneId].includes(tag)) return;
    dispatch(addTagCustomFilter({ type: zoneId, tag }));
  };

  const handleCustomTagClick = (title: string) => {
    dispatch(
      removeTagCustomFilter({
        type: customHas.includes(title) ? 'customHas' : 'customNot',
        tag: title,
      })
    );
  };

  return (
    <div className="p-2">
      <Droppable droppableId="customHas" onDrop={handleCustomDrop}>
        <ModalContainer className="border" title="Has these">
          <div className="grid lg:grid-cols-2 p-1 lg:p-2">
            {customHas?.map((t: string) => {
              return (
                <TagPill
                  isDraggable
                  onTagClick={handleCustomTagClick}
                  key={t}
                  title={t}
                />
              );
            })}
          </div>
        </ModalContainer>
      </Droppable>
      <Droppable droppableId="customNot" onDrop={handleCustomDrop}>
        <ModalContainer className="border" title="Not these">
          <div className="grid lg:grid-cols-2 p-1 lg:p-2">
            {customNot?.map((t: string) => {
              return (
                <TagPill
                  isDraggable
                  onTagClick={handleCustomTagClick}
                  key={t}
                  title={t}
                />
              );
            })}
          </div>
        </ModalContainer>
      </Droppable>
    </div>
  );
}
