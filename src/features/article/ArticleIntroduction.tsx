import { Editor } from '@tinymce/tinymce-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from '../../components/ControlledTextInput';
import TinymceEditor from '../../components/TinymceEditor';
import {
  getDocuments,
  getIsEditing,
  setSnackbar,
} from '../general/generalSlice';
import ArticleImage from './ArticleImage';
import ArticleListQuickFacts from './ArticleListQuickFacts';
import {
  decrementOpenEditors,
  getArticleIntroduction,
  getArticleTitle,
  incrementOpenEditors,
  saveArticleIntroduction,
} from './articleSlice';
import OptionsMenu from './OptionsMenu';

type ArticleIntroductionProps = {
  onTitleChange: (value: string) => void;
  titleText: string;
}

export default function ArticleIntroduction(props: ArticleIntroductionProps) {
  const dispatch = useDispatch();
  const { onTitleChange, titleText } = props;
  const title = useSelector(getArticleTitle);
  const introduction = useSelector(getArticleIntroduction);
  const isArticleEditing = useSelector(getIsEditing);
  const [isBeingEdited, setIsBeingEdited] = useState(title === '');
  const [editorContent, setEditorContent] = useState(introduction);
  const { articles } = useSelector(getDocuments);

  const handleIntroductionEdit = () => {
    setIsBeingEdited(true);
    dispatch(incrementOpenEditors());
  };

  const handleEditCancel = () => {
    setIsBeingEdited(false);
    dispatch(decrementOpenEditors());
    onTitleChange('');
  };

  const handleEditorContentChange = (content: string) => {
    setEditorContent(content);
  };

  const handleEditSave = () => {
    if (titleText !== title && articles.includes(titleText)) {
      dispatch(
        setSnackbar([
          'A document with that name already exists',
          'text-red-500',
        ])
      );
      return;
    }
    if (!titleText) {
      dispatch(setSnackbar(['Article must have a title', 'text-red-500']));
      return;
    }
    dispatch(saveArticleIntroduction(editorContent));
    dispatch(decrementOpenEditors());
    dispatch(setSnackbar(['Article introduction saved', 'text-primary']));
    setIsBeingEdited(false);
  };

  return (
    <section className="py-2">
      <div className="border-b-2 pb-2 flex border-primary mb-2">
        {isBeingEdited ? (
          <TextInput
            onTextChange={onTitleChange}
            text={titleText}
            color="p-2 bg-primary text-secondary"
            placeholder="Article's title"
          />
        ) : (
          <>
            <h2 className="text-primary text-xl font-bold">{titleText}</h2>
            {isArticleEditing && (
              <OptionsMenu
                buttonClassNames="ml-auto my-auto"
                menuPosition="right-0"
                onEditClick={handleIntroductionEdit}
              />
            )}
          </>
        )}
      </div>
      <div className="clearfix float-right p-2 ml-4 bg-primary my-2 text-center max-w-md z-100 rounded">
        <ArticleImage title={title} isArticleEditing={isArticleEditing} />
        <ArticleListQuickFacts isArticleEditing={isArticleEditing} />
      </div>
      {isBeingEdited ? (
        <>
          <TinymceEditor
            height='0'
            editorContent={editorContent}
            onEditorContentChange={handleEditorContentChange}
          />
          <div className="my-2 flex justify-center">
            {title &&
              <button
                className="uppercase text-red-500 hover:text-hover text-base py-2 px-3"
                onClick={handleEditCancel}
              >
                Cancel
              </button>
            }
            <button
              className="uppercase text-primary hover:text-hover text-base py-2 px-3 bg-primary"
              onClick={handleEditSave}
            >
              Save
            </button>
          </div>
        </>
      ) : (
        <div
          className="break-all text-justify text-secondary py-2"
          dangerouslySetInnerHTML={{ __html: introduction }}
        />
      )}
    </section>
  );
}
