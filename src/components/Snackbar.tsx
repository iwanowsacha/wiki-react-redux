import React, { ReactNode } from 'react';
import { CSSTransition } from 'react-transition-group';

type SnackbarProps = {
  children?: ReactNode | undefined;
  isOpen: boolean;
  className?: string;
  message: string;
};

export default function Snackbar(props: SnackbarProps) {
  const {
    isOpen,
    className = 'text-primary',
    message,
    children = null,
  } = props;

  return (
    <CSSTransition in={isOpen} timeout={300} unmountOnExit classNames="fade-in">
      <div
        className={`text-center m-2 fixed px-4 py-4 bg-primary text-xl snackbar ${className}`}
      >
        {message}
        {children && (
          <div className="flex flex-wrap justify-center my-2">{children}</div>
        )}
      </div>
    </CSSTransition>
  );
}
