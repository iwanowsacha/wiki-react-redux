import { ipcRenderer } from 'electron/renderer';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '../../components/Snackbar';
import { ArticleSection as ArticleSectionT } from '../../types';
import useMounted from '../../utils/hooks/useMounted';
import useSnacbkbar from '../../utils/hooks/useSnackbar';
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
  getArticleSections,
  getArticleTitle,
  getOpenEditorsTotal,
} from './articleSlice';

export default function PageArticle() {
  const dispatch = useDispatch();
  const isMounted = useMounted();
  const sections = useSelector(getArticleSections);
  const articleTitle = useSelector(getArticleTitle);
  const isMenuOpen = useSelector(getIsMenuOpen);
  const snackbarMessage = useSelector(getSnackbar);
  const isEditing = useSelector(getIsEditing);
  const [isSnackbarOpen, openSnackbar] = useSnacbkbar(true);
  const openEditors = useSelector(getOpenEditorsTotal);

  const handleAddSection = () => {
    dispatch(addSection(''));
  };

  useEffect(() => {
    if (snackbarMessage[0]) openSnackbar();
  }, [snackbarMessage]);

  useEffect(() => {
    if (!isMounted) return;
    if (isEditing && snackbarMessage[0] !== 'There are unsaved changes' && articleTitle) {
      dispatch(setSnackbar(['Editing article', 'text-primary']));
    } else if (!isEditing) {
      if (openEditors > 0) {
        dispatch(setSnackbar(['There are unsaved changes', 'text-red-500']));
        dispatch(toggleIsEditing());
        return;
      }
      dispatch(setSnackbar(['Article saved succesfully', 'text-primary']));
      // ipcRenderer.invoke('save-article', );
    }
  }, [isEditing]);

  return (
    <>
      <main className="flex flex-auto">
        {isMenuOpen && (
          <ArticleIndex articleTitle={articleTitle}>
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
          <ArticleIntroduction />
          {sections &&
            sections.map((section: ArticleSectionT) => (
              <ArticleSection
                key={section.title}
                section={section}
                isArticleEditing={isEditing}
                parent=""
              />
            ))}
          <aside className="pb-2 flex border-primary mb-2">
            <button
              className="bg-primary text-primary py-2 px-3"
              onClick={handleAddSection}
            >
              <span className="material-icons text-sm mr-2">add</span> Add
              Section
            </button>
          </aside>
          <Snackbar
            isOpen={isSnackbarOpen}
            message={snackbarMessage[0]}
            className={snackbarMessage[1]}
          />
        </div>
      </main>
    </>
  );
}
