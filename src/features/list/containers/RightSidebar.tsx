import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FilePickerButton } from "../../../components/FilePickerButton";
import { SidePanel } from "../../../components/SidePanel";
import { SidePanelButton } from "../../../components/SidePanelButton";
import { TextInput } from "../../../components/UncontrolledTextInput";
import { searchItem } from "../items/itemsSlice";
import { getBrowseImage, setBrowseImage } from "../listSlice";
import { TagPill } from "../tags/TagPill";
import { getSelectedTags } from "../tags/tagsSlice";

type RightSidebarProps = {
    isShowingForm: boolean,
    onButtonClick(id: string): void,
    onTagClick(title: string): void
}

export function RightSidebar(props: RightSidebarProps) {
    const dispatch = useDispatch();
    const selectedImage = useSelector(getBrowseImage);
    const selectedTags = useSelector(getSelectedTags);

    const handleImageFilePicked = (path: string) => {
        dispatch(setBrowseImage(path));
    }

    const delay = (fn: any, ms: number) => {
        let timer: any = 0;
        return function (...args: any[]) {
            clearTimeout(timer)
            timer = setTimeout(fn.bind(this, ...args), ms || 0)
        }
    }

    const handleItemSearch = (value: string) => {
        dispatch(searchItem(value));
    }

    return(
        <SidePanel>
            {!props.isShowingForm
                ?
                    (<>
                        <div className=" px-2 pb-2 text-center my-4 border-b-2 border-dotted border-secondary">
                            <div className="bg-secondary text-secondary py-2 px-3 rounded">
                                <TextInput color="bg-secondary" placeholder="Search items" onTextChange={delay(handleItemSearch, 500)} />
                            </div>
                        </div>
                        <SidePanelButton id="orderAsc" onClick={(id: string)=>console.log(id)}>Order Asc (A-Z)</SidePanelButton>
                        <SidePanelButton id="orderDesc" onClick={(id: string)=>console.log(id)}>Order Desc (Z-A)</SidePanelButton>
                    </>)
                :
                    (
                        <FilePickerButton fileTypes="image/*" onFileChange={handleImageFilePicked}>
                            {selectedImage &&                  
                                <img className="mx-auto mt-4 selected-image-list" src={selectedImage} />
                            }
                            <SidePanelButton id="image" onClick={(id: string) => console.log(id)}>
                                Image
                            </SidePanelButton>
                        </FilePickerButton>
                    )
            }
            <SidePanelButton onClick={props.onButtonClick} id={props.isShowingForm ? "tags" : "filter"}>{props.isShowingForm ? "Tags" : "Filter"}</SidePanelButton>
            <div className="hidden md:flex px-4 pb-4 flex-wrap flex-row mt-4">
                {selectedTags.length > 0 &&
                    selectedTags.map((t: string) => <TagPill onTagClick={props.onTagClick} isDraggable={false} key={t} title={t}/>)
                }
            </div>
        </SidePanel>
    );
}