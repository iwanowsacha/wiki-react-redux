import React, { ReactNode } from "react";

type SidePanelButtonProps = {
    children: ReactNode,
    isSelected?: boolean,
    id: string,
    onClick(id: string): void
}

export function SidePanelButton(props: SidePanelButtonProps) {
    const handleButtonClick = () => {
        props.onClick(props.id);
    }

    return (
        <div id={props.id} role="button" className={`p-2 text-center mt-8 border-b-2 sm:p-4 hover:text-primary hover:border-primary ${props.isSelected ? 'border-primary text-primary' : ''}`} onClick={handleButtonClick}>
            {props.children}
        </div>
    );
}