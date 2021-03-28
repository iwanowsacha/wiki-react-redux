import React from 'react';
import { basename } from 'path';
import { DIRECTORIES } from '../../../directories';
import { sanitizeFilename } from '../../../utils/filenameSanitizer';
import { useSortable } from '@dnd-kit/sortable';
import {CSS, Transition} from '@dnd-kit/utilities';

type SortableListItemProps = {
  title: string;
  image: string;
  listTitle: string;
  onItemClick(title: string): void;
};

export default function SortableListItem(props: SortableListItemProps) {
  const { title, image, listTitle } = props;
  const { attributes, listeners, setNodeRef, transform } = useSortable({id: title});

  const style = {transform: CSS.Transform.toString(transform) || '', transition: CSS.Transition.toString({duration: 250, easing: 'ease'} as Transition)}

  const handleItemClick = () => {
    props.onItemClick(props.title);
  };
  const imagePath =
    basename(image) === image ? `${DIRECTORIES.lists}/${sanitizeFilename(listTitle)}/images/${image}` : image;
    

  return (
    <div ref={setNodeRef} style={style}  className="list-item px-6" onClick={handleItemClick}>
      <div {...attributes} {...listeners} className="relative rounded-md bg-secondary" role="button">
        <img
          src={imagePath}
          alt=""
          className="lazy rounded-md list-item-image"
        />
        <div className="rounded-t rounded-b-md max-h-full break-all overflow-y-hidden list-item-overlay text-primary bg-primary py-6 text-center px-2">
          {title}
        </div>
      </div>
    </div>
  );
}