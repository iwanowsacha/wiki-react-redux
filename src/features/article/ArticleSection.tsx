import { Editor } from '@tinymce/tinymce-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from '../../components/ControlledTextInput';
import { ArticleSection as ArticleSectionType } from '../../types';
import { addSubsection, saveSubsection } from './articleSlice';
import OptionsMenu from './OptionsMenu';

type ArticleSectionProps = {
    section: ArticleSectionType;
    parent: string;
}

export default function ArticleSection(props: ArticleSectionProps) {
    const { title, body, subsections } = props.section;
    const { parent } = props;
    const [isBeingEdited, setIsBeingEdited] = useState(title === '');
    const [titleText, setTitleText] = useState(title);
    const [editorContent, setEditorContent] = useState(body);
    const dispatch = useDispatch();
    
    const id = parent ? `${parent}---${title}` : title;
    let textClass = 'text-xl';
    const level = parent.split('---').length;

    if (level >= 4) {
        textClass = 'text-sm';
    } else if (level === 3) {
        textClass = 'text-base';
    } else if (level === 2 || parent) {
        textClass = 'text-lg';
    }

    const handleAddSectionClick = () => {
        dispatch(addSubsection(id));
    }

    const handleEditButtonClick = () => {
        setIsBeingEdited(true);
    }
    
    const handleEditCancel = () => {
        setTitleText(title);
        setIsBeingEdited(false);
    }

    const handleTitleChange = (value: string) => {
        setTitleText(value);
    }

    const handleEditorContentChange = (content: string) => {
        setEditorContent(content);
    }

    const handleEditSave = () => {
        dispatch(saveSubsection({
            title: title,
            parent: id,
            newTitle: titleText,
            body: editorContent
        }));
        setIsBeingEdited(false);
    }



    return(
        <section className="my-4 pb-2" id={id}>
            <div className={`pb-2 flex border-primary font-bold ${!parent ? 'border-b-2 ' : 'subsection-border'}`}>
                {isBeingEdited
                    ? <TextInput text={titleText} onTextChange={handleTitleChange} color="p-2 bg-primary text-secondary" />
                    :   (<>
                            <h2 className={`text-primary font-bold ${textClass}`}>{titleText}</h2>
                            <OptionsMenu onEditClick={handleEditButtonClick} isIntroduction={false} buttonClassNames={parent ? 'ml-10' : 'ml-auto my-auto'} menuPosition={parent ? 'left-0' : 'right-0'}/>
                        </>)
                }
            </div>
            {isBeingEdited
                ?   (<>
                        <Editor value={editorContent} onEditorChange={handleEditorContentChange}/>
                        <div className="my-2 flex justify-center">
                            <button className="uppercase text-red-500 hover:text-hover text-base py-2 px-3" onClick={handleEditCancel}>Cancel</button>
                            <button className="uppercase text-primary hover:text-hover text-base py-2 px-3 bg-primary" onClick={handleEditSave}>Save</button>
                        </div>
                    </>)
                : <div className="mt-2 py-2 break-all text-justify text-secondary" dangerouslySetInnerHTML={{__html: body}}></div>
            }
            {subsections &&
                subsections.map((section, index) => <ArticleSection key={section.title+index} section={section} parent={id}/>)
            }
            {!subsections.find((s) => s.title === '') && title &&
                <aside className="ml-4 pb-2 mb-2">
                    <button className="bg-primary text-primary py-2 px-3" onClick={handleAddSectionClick}>
                        <span className="material-icons text-sm mr-2">add</span>
                        Add Section ({id.replaceAll('---', ' --- ')})
                    </button>
                </aside>
            }
        </section>
    );
}