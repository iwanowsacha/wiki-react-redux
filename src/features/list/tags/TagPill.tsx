import React, { SyntheticEvent } from "react";
import { useSelector } from "react-redux";

type TagPillProps = {
    title: string,
    isSelected?: boolean,
    isDraggable?: boolean,
    onTagClick(title: string): void
}

export function TagPill(props: TagPillProps) {

    const isSelected = useSelector(state => state.list.tags.selectedTags.includes(props.title));

    const handleTagClick = () => {
       props.onTagClick(props.title);
    }

    const handleTagDrag = (e: SyntheticEvent) => {  
        e.dataTransfer.setData('tag', props.title);
    }

    return (
        <div draggable={props.isDraggable} className={`rounded-full py-1 px-2 text-xs m-1 inline-block truncate uppercase relative ${isSelected ? 'bg-select text-inverse' : 'bg-primary text-secondary'}`} onClick={handleTagClick} onDragStart={handleTagDrag}>
            <span className="mr-4 uppercase">{props.title}</span>
        </div>
    );
}