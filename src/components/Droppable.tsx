import React, { ReactNode, SyntheticEvent } from "react";

type DroppableProps = {
    children: ReactNode,
    droppableId: string,
    onDrop(e: SyntheticEvent, droppableId: string): void
}

export function Droppable(props: DroppableProps) {

    const handleDrop = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        props.onDrop(e, props.droppableId);
    }

    const handleDragOver = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }

    return(
        <div onDrop={handleDrop} onDragOver={handleDragOver}>
            {props.children}
        </div>
    );
}