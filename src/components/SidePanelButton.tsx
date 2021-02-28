import React, { ReactNode } from 'react';

type SidePanelButtonProps = {
  children: ReactNode;
  isSelected?: boolean;
  id: string;
  onClick(id: string): void;
};

export default function SidePanelButton(props: SidePanelButtonProps) {
  const { isSelected = false, id, children } = props;

  const handleButtonClick = () => {
    props.onClick(props.id);
  };

  return (
    <div
      id={id}
      className={`p-2 text-center mt-8 border-b-2 sm:p-4 hover:text-primary hover:border-primary ${
        isSelected ? 'border-primary text-primary' : ''
      }`}
      onClick={handleButtonClick}
    >
      {children}
    </div>
  );
}
