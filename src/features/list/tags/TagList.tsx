import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllTags } from '../items/itemsSlice';
import ModalContainer from '../../../components/ModalContainer';
import TextInput from '../../../components/UncontrolledTextInput';
import TagPill from './TagPill';

type TagListProps = {
  className: string;
  selectedTags: Array<string>;
  onTagClick(title: string): void;
};

export default function TagList(props: TagListProps) {
  const { className, selectedTags, onTagClick } = props;
  const [isSearching, setIsSearching] = useState(false);
  const [filteredTags, setFilteredTags] = useState([]);
  const tags = useSelector(getAllTags);

  const handleTagSearch = (value: string) => {
    if (value) {
      const title = value.toLowerCase().trim();
      setFilteredTags(tags.filter((t: string) => t.indexOf(title) > -1));
      setIsSearching(true);
    } else {
      setFilteredTags([]);
      setIsSearching(false);
    }
  };

  return (
    <ModalContainer className="border-2" title="All tags">
      <div className="m-2 flex bg-primary p-2 text-secondary">
        <TextInput color="bg-primary" onTextChange={handleTagSearch} />
        <div className="hidden ml-2 lg:block text-base text-secondary lg:text-2xl material-icons self-center justify-self-center lg:justify-self-end pl-1 lg:border-l-2 border-secondary">
          search
        </div>
      </div>
      <div className={`grid p-2 ${className}`}>
        {isSearching
          ? filteredTags.map((f: string) => (
              <TagPill
                onTagClick={onTagClick}
                isDraggable
                isSelected={selectedTags.includes(f.toLowerCase())}
                key={f}
                title={f}
              />
            ))
          : tags.map((t: string) => (
              <TagPill
                onTagClick={onTagClick}
                isDraggable
                isSelected={selectedTags.includes(t.toLowerCase())}
                key={t}
                title={t}
              />
            ))}
      </div>
    </ModalContainer>
  );
}
