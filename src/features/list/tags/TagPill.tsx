import React, { DragEvent } from 'react';
import { useSelector } from 'react-redux';

type TagPillProps = {
  title: string;
  isDraggable: boolean;
  onTagClick(title: string): void;
};

export default function TagPill(props: TagPillProps) {
  const { title, isDraggable } = props;

  const isSelected = useSelector((state) =>
    state.list.tags.selectedTags.includes(props.title)
  );

  const handleTagClick = () => {
    props.onTagClick(props.title);
  };

  const handleTagDrag = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('tag', props.title);
  };

  return (
    <div
      draggable={isDraggable}
      className={`rounded-full py-1 px-2 m-1 inline-block truncate uppercase text-sm ${
        isSelected ? 'bg-select text-inverse' : 'bg-primary text-secondary'
      }`}
      onClick={handleTagClick}
      onDragStart={handleTagDrag}
    >
      {title}
    </div>
  );
}
