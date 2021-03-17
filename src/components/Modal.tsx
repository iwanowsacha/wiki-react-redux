import React, { ReactNode } from 'react';
import { CSSTransition } from 'react-transition-group';

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onCloseClick(): void;
};

export default function Modal(props: ModalProps) {
  const { isOpen, children, onCloseClick } = props;

  return (
    <CSSTransition unmountOnExit in={isOpen} timeout={300} classNames="fade-in">
      <div id="modal" className="modal">
        <div className="modal-content hidden-scrollbar h-full rounded-md">
          <button
            type="button"
            className="absolute material-icons text-secondary z-100 text-2xl"
            style={{ top: 2, right: 2 }}
            onClick={onCloseClick}
          >
            cancel
          </button>
          {children}
        </div>
      </div>
    </CSSTransition>
  );
}
