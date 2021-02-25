import React, { ReactNode, DragEvent } from 'react';

type DroppableProps = {
  children: ReactNode;
  droppableId: string;
  onDrop: (e: DragEvent<HTMLDivElement>, droppableId: string) => void;
};

export default function Droppable(props: DroppableProps) {
  const { children, droppableId } = props;

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    props.onDrop(e, droppableId);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver}>
      {children}
    </div>
  );
}
