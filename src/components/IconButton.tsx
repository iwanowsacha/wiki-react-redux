import React, { ReactNode, SyntheticEvent } from "react";

type IconButtonProps = {
    children: ReactNode,
    classNames?: string,
    onClick(text: string): void
} & typeof defaultProps;

const defaultProps = {
    classNames: 'text-base text-secondary'
}

export function IconButton(props: IconButtonProps) {
    const handleButtonClick = (e: SyntheticEvent) => {
        props.onClick(e.target.innerHTML);
    }

    return (
        <button className={`rounded py-1 px-2 material-icons bg-secondary ${props.classNames }`} onClick={handleButtonClick}>
            {props.children}
        </button>
    );
}

IconButton.defaultProps = defaultProps;