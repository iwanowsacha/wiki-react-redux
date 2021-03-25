import React from 'react';
import { basename } from 'path';
import { DIRECTORIES } from '../../../directories';
import { sanitizeFilename } from '../../../utils/filenameSanitizer';

type ListItemProps = {
  title: string;
  image: string;
  listTitle: string;
  onItemClick(title: string): void;
};

export default function ListItem(props: ListItemProps) {
  const { title, image, listTitle } = props;

  const handleItemClick = () => {
    props.onItemClick(props.title);
  };
  const imagePath =
    basename(image) === image ? `${DIRECTORIES.lists}/${sanitizeFilename(listTitle)}/images/${image}` : image;
    
  return (
    <div className="list-item px-6" onClick={handleItemClick}>
      <div className="relative rounded-md bg-secondary" role="button">
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
