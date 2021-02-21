import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '../../components/Snackbar';
import { getIsMenuOpen, getSnackbar } from '../general/generalSlice';
import ArticleIndex from './ArticleIndex';
import ArticleIntroduction from './ArticleIntroduction';
import ArticleSection from './ArticleSection';
import ArticleSectionAnchor from './ArticleSectionAnchor';
import { addSection, getArticleSections, getArticleTitle } from './articleSlice';

export default function PageArticle() {
    const dispatch = useDispatch();
    const sections = useSelector(getArticleSections);
    const articleTitle = useSelector(getArticleTitle);
    const isMenuOpen = useSelector(getIsMenuOpen);
    const snackbarMessage = useSelector(getSnackbar);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);


    const handleAddSection = () => {
        dispatch(addSection(''));
    }

    useEffect(() => {
        if (snackbarMessage[0]) {
          setIsSnackbarOpen(true);
          setTimeout(() => {
            setIsSnackbarOpen(false);
          }, 1000);
        }
      }, [snackbarMessage]);

    return(
        <>
            <main className="flex flex-auto">
                {isMenuOpen &&          
                    <ArticleIndex articleTitle={articleTitle}>
                            {sections &&
                                sections.map((section: any) => <ArticleSectionAnchor key={section.title} section={section} parent='' />)
                            }
                    </ArticleIndex>
                }
                <div className="flex-grow px-6 pt-4 relative">
                    <ArticleIntroduction />
                    {sections &&
                        sections.map((section: any) => <ArticleSection key={section.title} section={section} parent='' />)
                    }
                    <aside className="pb-2 flex border-primary mb-2">
                        <button className="bg-primary text-primary py-2 px-3" onClick={handleAddSection}>
                            <span className="material-icons text-sm mr-2">add</span> Add Section
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