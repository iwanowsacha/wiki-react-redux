import React from "react";
import {basename} from "path";

type ListItemProps = {
    title: string,
    image: string,
    listTitle: string,
    onItemClick(title: string): void
}

export function ListItem(props: ListItemProps) {
    const handleItemClick = () => {
        props.onItemClick(props.title);
    }
    const image = basename(props.image) == props.image ? `lists/${props.listTitle}/images/${props.image}` : props.image;
    return (
        <div className="list-item px-6" onClick={handleItemClick}>
            <div className="relative rounded-md bg-secondary" role="button">
                <img src={image} alt="" className="lazy rounded-md list-item-image" data-src="../../wiki-electron/src/articles/InuYasha/image.jpg"/>
                <div className="rounded-t rounded-b-md max-h-full break-all overflow-y-hidden list-item-overlay text-primary bg-primary py-6 text-center px-2">
                    {props.title}
                </div>
            </div>
        </div>
    );
}