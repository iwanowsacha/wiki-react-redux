import React, { SyntheticEvent} from "react";

type UncontrolledTextInputProps = {
    color?: string,
    placeholder?: string,
    onTextChange(value: string): void,
    onKeyDown(e: SyntheticEvent): void
} & typeof defaultProps;

const defaultProps = {
    color: 'bg-primary',
    placeholder: '',
    onKeyDown(e: SyntheticEvent){console.log('key down');}
}

export function TextInput(props: UncontrolledTextInputProps) {

    const handleTextChange = (e: SyntheticEvent) => {
        props.onTextChange(e.target.value);
    }

    const handleKeyDown = (e: SyntheticEvent) => {
        props.onKeyDown(e);
    }

    return (
        <input type="text" className={`h-8 w-full rounded ${props.color}`}
        placeholder={props.placeholder} onChange={handleTextChange} onKeyDown={handleKeyDown}/>
    );
}

TextInput.defaultProps = defaultProps;