import React from "react";
import { useSelector } from "react-redux";
import { SidePanel } from "../../../components/SidePanel";
import { SidePanelButton } from "../../../components/SidePanelButton";
import { TextInput } from "../../../components/UncontrolledTextInput";
import { getListTitle } from "../listSlice";

type LeftSidebarProps = {
    isShowingForm: boolean,
    isEditing: boolean,
    itemInDisplay: string,
    onButtonClick(id: string): void,
    onListTitleChange(value: string): void
}

export function LeftSidebar(props: LeftSidebarProps) {
    const listTitle = useSelector(getListTitle);
    return(
        <SidePanel>
            <div className="p-2 sm:p-4 text-center my-4 border-b-2 border-dotted border-secondary">
                <h3>{listTitle}</h3>
                {props.isEditing &&
                        <TextInput onTextChange={props.onListTitleChange} placeholder={listTitle} color="bg-secondary" />
                }
            </div>
            <span>
                <SidePanelButton id="items" isSelected={!props.isShowingForm} onClick={props.onButtonClick}>
                    Items
                </SidePanelButton>
                {props.isEditing &&
                    <SidePanelButton id="new" isSelected={props.isShowingForm} onClick={props.onButtonClick}>
                        {props.isShowingForm && props.itemInDisplay
                            ? "Edit"
                            : "New"
                        }
                    </SidePanelButton>
                }       
            </span>
        </SidePanel>
    );
}