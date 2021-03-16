import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import TextInput from '../../components/ControlledTextInput';
import TinymceEditor from '../../components/TinymceEditor';
import { ArticleSection as ArticleSectionType } from '../../types';
import { setSnackbar } from '../general/generalSlice';
import {
  addSection,
  decrementOpenEditors,
  deleteSection,
  incrementOpenEditors,
  moveSection,
  saveSection,
} from './articleSlice';
import OptionsMenu from './OptionsMenu';

type ArticleSectionProps = {
  section: ArticleSectionType;
  parent: string;
  isArticleEditing: boolean;
};

export default function ArticleSection(props: ArticleSectionProps) {
  const { parent, isArticleEditing, section } = props;
  const { title, body, sections } = section;
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
    dispatch(addSection(id));
    dispatch(setSnackbar([`Adding section: ${id}`, 'text-primary']));
  };

  const handleEditButtonClick = () => {
    setIsBeingEdited(true);
    dispatch(setSnackbar([`Editing: ${title}`, 'text-primary']));
    dispatch(incrementOpenEditors());
  };

  const handleDeleteButtonClick = () => {
    dispatch(deleteSection({ parent: id, title }));
    dispatch(setSnackbar([`Deleted: ${title}`, 'text-red-500']));
  };

  const handleMoveSectionClick = (direction: string) => {
    dispatch(moveSection({ parent: id, title, direction }));
  };

  const handleEditCancel = () => {
    setTitleText(title);
    if (!title) {
      dispatch(deleteSection({ parent: id, title: '' }));
    }
    dispatch(setSnackbar([`Editing canceled`, 'text-red-500']));
    dispatch(decrementOpenEditors());
    setIsBeingEdited(false);
  };

  const handleTitleChange = (value: string) => {
    setTitleText(value);
  };

  const handleEditorContentChange = (content: string) => {
    setEditorContent(content);
  };

  const handleEditSave = () => {
    if (!titleText) {
      dispatch(setSnackbar([`Section must have a title`, 'text-red-500']));
      return;
    }
    dispatch(
      saveSection({
        parent: id,
        newTitle: titleText,
        body: editorContent,
      })
    );
    dispatch(setSnackbar([`Saved: ${titleText}`, 'text-primary']));
    setIsBeingEdited(false);
  };

  return (
    <section className="my-4 pb-2" id={id}>
      <div
        className={`pb-2 flex border-primary font-bold ${
          !parent ? 'border-b-2 ' : 'subsection-border'
        }`}
      >
        {isBeingEdited ? (
          <TextInput
            text={titleText}
            placeholder="Section's title"
            onTextChange={handleTitleChange}
            color="p-2 bg-primary text-secondary"
          />
        ) : (
          <>
            <h2 className={`text-primary font-bold ${textClass}`}>
              {titleText}
            </h2>
            {isArticleEditing && (
              <OptionsMenu
                onEditClick={handleEditButtonClick}
                onDeleteClick={handleDeleteButtonClick}
                onMoveClick={handleMoveSectionClick}
                buttonClassNames={parent ? 'ml-10' : 'ml-auto my-auto'}
                menuPosition={parent ? 'left-0' : 'right-0'}
              />
            )}
          </>
        )}
      </div>
      {isBeingEdited ? (
        <>
          <TinymceEditor
            height='0'
            editorContent={editorContent}
            onEditorContentChange={handleEditorContentChange}
          />
          <div className="my-2 flex justify-center">
            <button
              className="uppercase text-red-500 hover:text-hover text-base py-2 px-3"
              onClick={handleEditCancel}
            >
              Cancel
            </button>
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
          className="mt-2 py-2 break-all text-justify text-secondary"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      )}
      {sections &&
        sections.map((s, index) => (
          <ArticleSection
            key={index+s.title}
            isArticleEditing={isArticleEditing}
            section={s}
            parent={id}
          />
        ))}
      {!sections.find((s) => s.title === '') && title && isArticleEditing && (
        <aside className="ml-4 pb-2 mb-2">
          <button
            className="bg-primary text-primary py-2 px-3"
            onClick={handleAddSectionClick}
          >
            <span className="material-icons text-sm mr-2">add</span>
            Add Section ({id.replaceAll('---', ' --- ')})
          </button>
        </aside>
      )}
    </section>
  );
}
