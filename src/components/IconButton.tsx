import React, { ReactNode, MouseEvent } from 'react';

type IconButtonProps = {
  children: ReactNode;
  classNames?: string;
  onClick: (text: string) => void;
} & typeof defaultProps;

const defaultProps = {
  classNames: 'text-base text-secondary',
};

export default function IconButton(props: IconButtonProps) {
  const { classNames, children } = props;

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) =>
    props.onClick(e.currentTarget.innerHTML);

  return (
    <button
      type="button"
      className={`rounded py-1 px-2 material-icons bg-secondary ${classNames}`}
      onClick={handleButtonClick}
    >
      {children}
    </button>
  );
}

IconButton.defaultProps = defaultProps;
