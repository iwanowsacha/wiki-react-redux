import React, { ReactNode } from 'react';

type SidePanelButtonProps = {
  children: ReactNode;
  isSelected?: boolean;
  id: string;
  onClick(id: string): void;
} & typeof defaultProps;

const defaultProps = {
  isSelected: false,
};

export default function SidePanelButton(props: SidePanelButtonProps) {
  const { isSelected, id, children } = props;

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

SidePanelButton.defaultProps = defaultProps;
