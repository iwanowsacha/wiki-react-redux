import React from 'react';
import { useSelector } from 'react-redux';
import { getIsMenuOpen } from '../general/generalSlice';
import ArticleIndex from './ArticleIndex';
import ArticleIntroduction from './ArticleIntroduction';
import ArticleSection from './ArticleSection';
import ArticleSectionAnchor from './ArticleSectionAnchor';
import { getArticleSections, getArticleTitle } from './articleSlice';

export default function PageArticle() {
    const sections = useSelector(getArticleSections);
    const articleTitle = useSelector(getArticleTitle);
    const isMenuOpen = useSelector(getIsMenuOpen);

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
                </div>
            </main>
        </>
    );
}