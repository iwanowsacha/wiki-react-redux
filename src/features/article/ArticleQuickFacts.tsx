import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../../components/IconButton';
import { addQuickFact, getArticleQuickFacts } from './articleSlice';
import { ArticleQuickFact } from '../../types';
import TextInput from '../../components/ControlledTextInput';
import { Editor } from '@tinymce/tinymce-react';

export default function ArticleQuickFacts(props: any) {
    const {isArticleEditing} = props;
    const dispatch = useDispatch();
    const facts = useSelector(getArticleQuickFacts);
    const [factTitle, setFactTitle] = useState('');

    const handleFactTitleChange = (value: string) => {
        setFactTitle(value);
    }

    const handleAddFactClick = () => {
        dispatch(addQuickFact());
    }

    return(
        <div className="mt-2 border-t-2 border-primary">
            <div className="flex flex-col w-full">
                {
                    facts?.map((f: ArticleQuickFact) => {
                        if (f.title) {
                            return (<div key={f.title} className="grid grid-cols-2 p-2 justify-items-start text-secondary">
                                <p>{f.title}</p>
                                <div dangerouslySetInnerHTML={{__html: f.body}} />
                            </div>)
                        } else {
                            return (
                                (<div key={f.title} className="grid grid-cols-2 p-2 justify-items-start text-secondary">
                                    <TextInput placeholder="Title" color="bg-secondary" text={factTitle} onTextChange={handleFactTitleChange} />
                                    <Editor inline={true} initialValue="click"/>
                                </div>)
                            )
                        }
                    })
                }
                {/* <div className="grid grid-cols-2 p-2 justify-items-start text-secondary">
                    <p>ass</p>
                    <p>ass</p>
                </div> */}
                
            </div>
            {isArticleEditing &&
                <IconButton classNames="text-primary mt-2" onClick={handleAddFactClick}>add</IconButton>
            }
        </div>
    );
}