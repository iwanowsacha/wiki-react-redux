import React from 'react';
import { useSelector } from 'react-redux';
import { getIsEditing } from '../../general/generalSlice';
import { getSelectedTags } from './tagsSlice';
import { selectTotalGroups } from '../groups/groupsSlice';
import TagList from './TagList';
import TagGroupList from '../groups/TagGroupList';
import FilterOptions from '../filter/FilterOptions';
import TagGroupOptions from '../groups/TagGroupOptions';

const Sizes = {
  Largest: ' col-span-4',
  Large: ' col-span-3',
  Medium: ' col-span-2',
  Small: '',
};

type TagsModalProps = {
  showFilter: boolean;
  onTagClick(title: string): void;
};

export default function TagsModal(props: TagsModalProps) {
  const { showFilter, onTagClick } = props;
  const selectedTags = useSelector(getSelectedTags);
  const isEditing = useSelector(getIsEditing);
  const tagGroupsLength = useSelector(selectTotalGroups);

  let size = Sizes.Small;
  let columns = '';
  if (tagGroupsLength > 0 && !showFilter) {
    size = Sizes.Medium;
    columns = ' grid-cols-2';
  } else if (tagGroupsLength <= 0 && showFilter) {
    size = Sizes.Large;
    columns = ' grid-cols-4';
  } else if (tagGroupsLength <= 0 && !showFilter) {
    size = Sizes.Largest;
    columns = ' grid-cols-4';
  }

  return (
    <div className="flex flex-col min-h-full bg-secondary">
      <div className="col-span-4 mb-2 p-2 bg-primary flex-initial">
        <p className="text-center text-secondary">Filter</p>
      </div>
      <div className="grid grid-cols-4">
        <div className={`my-6 mx-2 tag-container ${size}`}>
          <TagList
            className={columns}
            selectedTags={selectedTags}
            onTagClick={onTagClick}
          />
        </div>
        <TagGroupList onTagClick={onTagClick} />
        <div className="mt-6 mb-auto mx-2 sticky top-0">
          {isEditing && showFilter && <TagGroupOptions />}
          {showFilter && <FilterOptions />}
        </div>
      </div>
    </div>
  );
}
