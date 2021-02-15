import React from 'react';
import { ArticleSection as ArticleSectionType } from '../../types';

type ArticleSectionProps = {
    section: ArticleSectionType;
    parent: string
}

export default function ArticleSection(props: ArticleSectionProps) {
    const { title, body, subsections } = props.section;
    const { parent } = props;
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

    return(
        <section className="my-4 pb-2" id={id}>
            <div className={`pb-2 flex border-primary font-bold ${!parent ? 'border-b-2 ' : 'subsection-border'}`}>
                <h2 className={`text-primary font-bold ${textClass}`}>{title}</h2>
                <button className="material-icons ml-auto my-auto text-primary hidden" name="opts">more_vert</button>   
            </div>
            <div className="mt-2 py-2 break-all text-justify text-secondary" dangerouslySetInnerHTML={{__html: body}}></div>
            <div className="my-2 flex justify-center hidden">
                <button className="uppercase text-red-500 hover:text-hover text-base py-2 px-3" name="cancel">Cancel</button>
                <button className="uppercase text-primary hover:text-hover text-base py-2 px-3 bg-primary" name="save">Save</button>
            </div>
            {subsections &&
                subsections.map((section) => <ArticleSection key={section.title} section={section} parent={id}/>)
            }
            <aside className="ml-4 pb-2 mb-2 hidden">
                <button className="bg-primary text-primary py-2 px-3" name="add">
                    <span className="material-icons text-sm mr-2">add</span>
                    Add Section ({id.replaceAll('---', ' --- ')})
                </button>
            </aside>
        </section>
    );
}