import React, { SyntheticEvent } from "react";

type RadioButtonProps = {
    group: string,
    title: string,
    value: string,
    checked: boolean,
    onChange(value: string): void
}

export function RadioButton(props: RadioButtonProps) {
    const handleOptionChange = (e: SyntheticEvent) => {
        props.onChange(e.target.value);
    }
    return(
        <label className="block">
            <input onChange={handleOptionChange} type="radio" name={props.group} title={props.title} defaultValue={props.value} defaultChecked={props.checked} />
            <span className="hidden md:inline text-secondary ml-2">{props.title}</span>
        </label>
    );
}