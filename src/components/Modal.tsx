import React, { ReactNode } from "react";
import { CSSTransition } from "react-transition-group";

type ModalProps = {
    children: ReactNode,
    isOpen: boolean,
    onCloseClick(): void
}

export function Modal(props: ModalProps) {

    return (
        <CSSTransition unmountOnExit in={props.isOpen} timeout={300} classNames="fade-in">
            <div id="modal" className="modal">
                <div className="modal-content h-full rounded-md">
                    <button className="absolute material-icons text-secondary z-100 text-2xl" style={{top: 2, right: 2}} onClick={props.onCloseClick}>cancel</button>
                    {props.children}
                </div>
            </div>
        </CSSTransition>
    );
}