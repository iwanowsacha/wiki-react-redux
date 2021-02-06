import React, { useState } from "react";
import {TextInput} from "../../../components/ControlledTextInput";
import { RadioButton } from "../../../components/RadioButton";
import { Editor } from "@tinymce/tinymce-react";
import { useDispatch, useSelector } from "react-redux";
import { getDocuments, setSnackbar } from "../../general/generalSlice";
import { getSelectedTags, resetSelectedTags } from "../tags/tagsSlice";
import { addItem, selectById, selectIds, updateItem } from "./itemsSlice";
import { getBrowseImage, setBrowseImage } from "../listSlice";

export function ListForm(props: any) {
    const dispatch = useDispatch();
    const allItems = useSelector(selectIds);
    const item = useSelector(state => selectById(state, props.item));
    const documents = useSelector(getDocuments);
    const selectedTags = useSelector(getSelectedTags);
    const selectedImage = useSelector(getBrowseImage);
    const [linkType, setLinkType] = useState('local');
    const [itemTitle, setItemTitle] = useState(item?.title || '');
    const [editorContent, setEditorContent] = useState(item?.body || '');
    const [newTags, setNewTags] = useState('');
    const [isUpdatingItem, setIsUpdatingItem] = useState(!!item);

    const handleEditorContentChange = (content: any) => {
        setEditorContent(content);
    }


    const handleItemTitleChange = (value: string) => {
        setItemTitle(value);
    }

    const handleExternalLinkChange = (value: string) => {
        console.log(value);
    }

    const handleNewTagsChange = (value: string) => {
        setNewTags(value);
    }

    const handleKeyDown = () => {
        console.log('hey');
    }

    const handleRadioChange = (value: string) => {
        setLinkType(value);
    }

    const handleSaveButtonClick = () => {
        if (!itemTitle || !selectedImage) {
            dispatch(setSnackbar(['Item must have title and image', 'text-red-500']));
            return;
        }
        if (doesItemExist()) {
            dispatch(setSnackbar(['An item with that title already exists', 'text-red-500']));
            return;
        }

        const newItem = {
            title: itemTitle,
            image: selectedImage,
            body: editorContent,
            link: '',
            tags: sanitizeTags()
        };
        isUpdatingItem ? updateCurrentItem(newItem) : addCurrentItem(newItem)
        emptyForm();
    }

    const updateCurrentItem = (updatedItem: any) => {
        dispatch(setSnackbar(['Item updated correctly', 'text-primary']));
        dispatch(updateItem({
            id: item.title,
            changes: updatedItem
        }));

        setIsUpdatingItem(false);
    }

    const addCurrentItem = (newItem: any) => {
        dispatch(setSnackbar(['Item saved correctly', 'text-primary']));
        dispatch(addItem(newItem));
    }
    
    const sanitizeTags = (): Array<string> => {
        const separateNewTags = newTags ? newTags.split(',').map((t: string) => t.trim().toLowerCase()) : [];
        const tags = new Set([...separateNewTags, ...selectedTags]); // Avoid repeats
        return Array.from(tags);
    }

    const emptyForm = () => {
        setLinkType('local');
        setItemTitle('');
        setEditorContent('');
        setNewTags('');
        dispatch(resetSelectedTags());
        dispatch(setBrowseImage(''));
    }

    const doesItemExist = () => {
        if ((isUpdatingItem && item.title !== itemTitle) || !isUpdatingItem) {
            const itemExists = allItems.find((it: any) => it.title == itemTitle);
            if (itemExists) {
                return true;
            }
            return false;
        }
        return false;
    }

    return(
        <section className="h-full bg-secondary">
            <div className="grid grid-cols-8 new-item-form h-full gap-x-2 p-4 items-center">
                <div className="col-span-3 my-2 bg-primary py-2 px-6 text-secondary">
                    <TextInput text={itemTitle} color="bg-primary" placeholder="Title" onTextChange={handleItemTitleChange} onKeyDown={handleKeyDown} />
                </div>
                <div className="col-span-5 my-2 py-2 px-3 grid grid-cols-4 gap-4">
                    <div className="w-full my-2 py-2 px-6 relative inline-block col-span-3 bg-primary text-secondary">
                        {linkType == 'external'
                            ? <TextInput text={newTags} color="bg-primary" placeholder="Link to" onTextChange={handleExternalLinkChange} onKeyDown={handleKeyDown} />
                            : (
                                <select className="bg-primary text-secondary w-full h-8" defaultValue=''>
                                    <option disabled={true} value="">Link to</option>
                                    {
                                        [...documents.articles, ...documents.lists].map((art) => <option key={art} value={art}>{art}</option>)
                                    }
                                </select>
                            )
                        }
                    </div>
                    <div className="my-2">
                        <RadioButton onChange={handleRadioChange} group="link" title="Article link" value="local" checked={true} />
                        <RadioButton onChange={handleRadioChange} group="link" title="External link" value="external" checked={false} />
                    </div>
                </div>
                <span className="col-span-8 row-span-5 self-stretch">
                    <Editor value={editorContent} onEditorChange={handleEditorContentChange}/>
                </span>
                <div className="col-span-8">
                    <div className="my-2 bg-primary py-2 px-3 text-secondary">
                        <TextInput text={newTags} color="bg-primary" placeholder="New tags" onTextChange={handleNewTagsChange} onKeyDown={handleKeyDown} />
                    </div>
                    <small className="text-xs text-secondary">Separate new tags by using commas (,)</small>
                </div>
                <div className="col-span-4 my-2 py-2 px-3 justify-self-end">
                    <button className="text-secondary" onClick={emptyForm}>Empty</button>
                </div>
                <div className="col-span-4 my-2 py-2 px-3 justify-self-start">
                    <button className="uppercase text-primary hover:text-hover text-base py-2 px-3 bg-primary" onClick={handleSaveButtonClick}>Save</button>
                </div>
            </div>
        </section>
    );
}