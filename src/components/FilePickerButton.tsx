import React, { ReactNode, RefObject, useRef } from "react";

type FilePickerButtonProps = {
    children: ReactNode,
    fileTypes: string,
    onFileChange(path: string) : void
}

export function FilePickerButton(props: FilePickerButtonProps) {
    const inputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    
    const handleFileChanged = () => {
        if (inputRef && inputRef.current && inputRef.current.files) {
            props.onFileChange(inputRef.current.files[0].path);
        }
    }

    const handleClick = () => { 
        inputRef?.current?.click();
    }

    return(
        <span onClick={handleClick}>
            <input type="file" accept={props.fileTypes} hidden={true} ref={inputRef} onChange={handleFileChanged}/>
            {props.children}
        </span>
    );
}