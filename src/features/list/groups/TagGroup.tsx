import React, { ReactNode } from "react";
import { ModalContainer } from "../../../components/ModalContainer";

type TagGroupProps = {
    children: ReactNode,
    title: string
}

export function TagGroup(props: TagGroupProps) {
    return(
        <ModalContainer className="border-2 inline-block mb-6 w-full" title={props.title}>
            <div className="p-2">
                {props.children}
            </div>
        </ModalContainer>
    );
}