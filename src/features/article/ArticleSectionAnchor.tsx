import React from 'react';
import { ArticleSection } from '../../types';

type ArticleSectionAnchorProps = {
    section: ArticleSection;
    parent: string;
}

export default function ArticleSectionAnchor(props: ArticleSectionAnchorProps) {
    const { title, sections } = props.section;
    const { parent } = props;
    const href = parent ? `${parent}---${title}` : title;

    return(
        <li className="p-1">
            <a className="text-primary hover:underline" href={`#${href}`}>
                {title}
            </a>
            <ol className="ml-2">
                {sections &&
                    sections.map((section) => <ArticleSectionAnchor key={section.title} section={section} parent={href}/>)
                }
            </ol>
        </li>
    );
}