import React, { SyntheticEvent} from "react";

type ControlledTextInputProps = {
    color?: string,
    text: string,
    placeholder?: string,
    onTextChange(value: string): void,
    onKeyDown?(e: SyntheticEvent): void
} & typeof defaultProps;

const defaultProps = {
    color: 'bg-primary',
    placeholder: '',
    onKeyDown(e: SyntheticEvent){console.log(`key down: ${e.target}`);}
}


export function TextInput(props : ControlledTextInputProps) {

    const handleTextChange = (e: SyntheticEvent) => {
        props.onTextChange(e.target.value);
    }

    const handleKeyDown = (e: SyntheticEvent) => {
        props.onKeyDown(e);
    }

    return (
        <input type="text" className={`h-8 w-full rounded ${props.color}`} value={props.text}
        placeholder={props.placeholder} onChange={handleTextChange} onKeyDown={handleKeyDown}/>
    );
}

TextInput.defaultProps = defaultProps;