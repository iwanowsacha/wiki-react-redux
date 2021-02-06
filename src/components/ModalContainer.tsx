import React, { ReactNode } from "react";

type ModalContainerProps = {
    children: ReactNode,
    className?: string
    title: string
}

export function ModalContainer(props: ModalContainerProps) {
    return (
        <div className={`border-secondary box mb-2 ${props.className}`}>
            <h1 className="h-4 leading-4 text-center font-bold mt-2 text-secondary">{props.title}</h1>
            {props.children}
        </div>
    );
}