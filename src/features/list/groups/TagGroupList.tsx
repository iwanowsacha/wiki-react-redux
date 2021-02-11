import React, { DragEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIsEditing } from '../../general/generalSlice';
import { selectAllGroups, updateGroup, updateManyGroups } from './groupsSlice';
import Droppable from '../../../components/Droppable';
import TagGroup from './TagGroup';
import TagPill from '../tags/TagPill';
import { TagGroup as TagGroupT } from '../../../types';

type TagGroupListProps = {
  onTagClick(title: string): void;
};

export default function TagGroupList(props: TagGroupListProps) {
  const tagGroups = useSelector(selectAllGroups);
  const isEditing = useSelector(getIsEditing);
  const dispatch = useDispatch();

  const updateTagGroup = (dropGroup: TagGroupT, tag: string) => {
    const group = tagGroups.find((tg) => tg.tags.includes(tag));
    const updatableTargetGroup = {
      id: dropGroup.title,
      changes: {
        tags: [...dropGroup.tags, tag],
      },
    };
    if (group) {
      const updateGroups = [
        {
          id: group.title,
          changes: {
            tags: [...group.tags.filter((t: string) => t !== tag)],
          },
        },
        updatableTargetGroup,
      ];
      dispatch(updateManyGroups(updateGroups));
    } else {
      dispatch(updateGroup(updatableTargetGroup));
    }
  };

  const handleTagGroupDrop = (e: DragEvent<HTMLDivElement>, zoneId: string) => {
    const tag = e.dataTransfer.getData('tag');
    const dropGroup = tagGroups.find((tg) => tg.title === zoneId);
    if (!tag || !dropGroup || dropGroup.tags.includes(tag)) return;
    updateTagGroup(dropGroup, tag);
  };

  return (
    <>
      {tagGroups.length > 0 && (
        <div className="my-6 mx-2 col-span-2 overflow-y-auto filterGroup-wrapper sticky top-0">
          <div>
            {isEditing
              ? tagGroups.map((g) => (
                  <Droppable
                    key={g.title}
                    droppableId={g.title}
                    onDrop={handleTagGroupDrop}
                  >
                    <TagGroup title={g.title}>
                      {g.tags.map((t: string) => (
                        <TagPill
                          isDraggable
                          onTagClick={props.onTagClick}
                          key={t}
                          title={t}
                        />
                      ))}
                    </TagGroup>
                  </Droppable>
                ))
              : tagGroups.map((g) => (
                  <TagGroup key={g.title} title={g.title}>
                    {g.tags.map((t: string) => (
                      <TagPill
                        isDraggable
                        onTagClick={props.onTagClick}
                        key={t}
                        title={t}
                      />
                    ))}
                  </TagGroup>
                ))}
          </div>
        </div>
      )}
    </>
  );
}
