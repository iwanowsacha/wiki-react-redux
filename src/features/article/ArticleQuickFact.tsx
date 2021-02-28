import { Editor } from '@tinymce/tinymce-react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import TextInput from '../../components/ControlledTextInput';
import IconButton from '../../components/IconButton';
import {
  saveQuickFact,
  deleteQuickFact,
  moveQuickFact,
  incrementOpenEditors,
} from './articleSlice';
import OptionsMenu from './OptionsMenu';

export default function ArticleQuickFact(props: any) {
  const { title, body, isArticleEditing } = props;
  const dispatch = useDispatch();
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [factTitle, setFactTitle] = useState(title);
  const [factBody, setFactBody] = useState(body);

  const handleFactTitleChange = (value: string) => {
    setFactTitle(value);
  };

  const handleSaveFactClick = () => {
    if (!factTitle) return;
    dispatch(
      saveQuickFact({
        oldTitle: title,
        quickFact: { title: factTitle, body: factBody },
      })
    );
    setIsBeingEdited(false);
  };

  const handleEditorContentChange = (value: string) => {
    setFactBody(value);
  };

  const handleEditButtonClick = () => {
    setIsBeingEdited(true);
    dispatch(incrementOpenEditors());
  };

  const handleMoveButtonClick = (direction: string) => {
    dispatch(moveQuickFact({ direction, title }));
  };

  const handleDeleteButtonClick = () => {
    dispatch(deleteQuickFact(title));
  };

  return (
    <>
      {!isBeingEdited && title ? (
        <div className="flex p-2 justify-items-start text-secondary">
          <p className="flex-1">{title}</p>
          <div
            className="flex-1 break-all"
            dangerouslySetInnerHTML={{ __html: body }}
          />
          {isArticleEditing && (
            <OptionsMenu
              menuPosition="right-0"
              onEditClick={handleEditButtonClick}
              onMoveClick={handleMoveButtonClick}
              onDeleteClick={handleDeleteButtonClick}
            />
          )}
        </div>
      ) : (
        <div className="flex p-2 justify-items-start text-secondary">
          <TextInput
            placeholder="Title"
            color="bg-secondary flex-1"
            text={factTitle}
            onTextChange={handleFactTitleChange}
          />
          <span className="flex-1 break-all">
            <Editor
              inline
              value={factBody}
              onEditorChange={handleEditorContentChange}
            />
          </span>
        </div>
      )}
      {isArticleEditing && (isBeingEdited || !title) && (
        <IconButton
          classNames="text-primary mt-2 self-center"
          onClick={handleSaveFactClick}
        >
          save
        </IconButton>
      )}
    </>
  );
}
