import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import tinymce from 'tinymce';
import Snackbar from '../../components/Snackbar';
import { ArticleQuickFact, ArticleSection as ArticleSectionT } from '../../types';
import useMounted from '../../utils/hooks/useMounted';
import useSnacbkbar from '../../utils/hooks/useSnackbar';
import { initSectionAnchor } from '../../utils/tinymcePlugin';
import {
  getIsEditing,
  getIsMenuOpen,
  getSnackbar,
  setSnackbar,
  toggleIsEditing,
} from '../general/generalSlice';
import ArticleIndex from './ArticleIndex';
import ArticleIntroduction from './ArticleIntroduction';
import ArticleSection from './ArticleSection';
import ArticleSectionAnchor from './ArticleSectionAnchor';
import {
  addSection,
  getArticleImage,
  getArticleIntroduction,
  getArticleQuickFacts,
  getArticleSections,
  getArticleTitle,
  getOpenEditorsTotal,
} from './articleSlice';

const getArticle = createSelector(
  [
    getArticleTitle,
    getArticleIntroduction,
    getArticleImage,
    getArticleSections,
    getArticleQuickFacts
  ],
  (title: string, introduction: string, image: string, sections: Array<ArticleSectionT>, quickFacts: Array<ArticleQuickFact>) => {
    return {
      title,
      introduction,
      image,
      sections,
      quickFacts
    }
  }
)

export default function PageArticle() {
  const dispatch = useDispatch();
  const isMounted = useMounted();
  const article = useSelector(getArticle);
  const { sections, title } = article;
  const isMenuOpen = useSelector(getIsMenuOpen);
  const snackbarMessage = useSelector(getSnackbar);
  const isEditing = useSelector(getIsEditing);
  const [isSnackbarOpen, openSnackbar] = useSnacbkbar(true);
  const [titleText, setTitleText] = useState(title);
  // const [sectionParents, setSectionParents] = useState([]);
  const openEditors = useSelector(getOpenEditorsTotal);

  const handleAddSection = () => {
    dispatch(addSection(''));   
  };

  useEffect(() => {
    initSectionAnchor(sections);
  }, [sections]);


  useEffect(() => {
    if (snackbarMessage[0]) openSnackbar();
  }, [snackbarMessage]);

  useEffect(() => {
    if (!isMounted) return;
    if (isEditing && snackbarMessage[0] !== 'There are unsaved changes' && title) {
      dispatch(setSnackbar(['Editing article', 'text-primary']));
    } else if (!isEditing) {
      if (openEditors > 0) {
        dispatch(setSnackbar(['There are unsaved changes', 'text-red-500']));
        dispatch(toggleIsEditing());
        return;
      }
      ipcRenderer.invoke('save-article', article, titleText);
    }
  }, [isEditing]);

  const handleTitleChange = (value: string) => {
    setTitleText(value);
  }

  return (
      <main className="flex flex-auto">
        {isMenuOpen && (
          <ArticleIndex articleTitle={title}>
            {sections &&
              sections.map((section: ArticleSectionT) => (
                <ArticleSectionAnchor
                  key={section.title}
                  section={section}
                  parent=""
                />
              ))}
          </ArticleIndex>
        )}
        <div className="flex-grow px-6 pt-4 relative">
          <ArticleIntroduction onTitleChange={handleTitleChange} titleText={titleText}/>
          {sections &&
            sections.map((section: ArticleSectionT, index: number) => (
              <ArticleSection
                key={index+section.title}
                section={section}
                isArticleEditing={isEditing}
                parent=""
              />
            ))}
          {isEditing && !sections?.find((s) => s.title === '') &&
            <aside className="pb-2 flex border-primary mb-2">
              <button
                className="bg-primary text-primary py-2 px-3"
                onClick={handleAddSection}
              >
                <span className="material-icons text-sm mr-2">add</span> Add
                Section
              </button>
            </aside>
          }
          <Snackbar
            isOpen={isSnackbarOpen}
            message={snackbarMessage[0]}
            className={snackbarMessage[1]}
          />
        </div>
      </main>
  );
}
