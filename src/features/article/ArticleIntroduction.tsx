import React from 'react';
import { useSelector } from 'react-redux';
import ArticleImage from './ArticleImage';
import { getArticleIntroduction, getArticleTitle } from './articleSlice';
import OptionsButton from './OptionsButton';

export default function ArticleIntroduction() {
    const title = useSelector(getArticleTitle);
    const introduction = useSelector(getArticleIntroduction);

    return(
        <section className="py-2">
            <div className="border-b-2 pb-2 flex border-primary mb-2">
                <h2 className="text-primary text-xl font-bold">
                    {title}
                </h2>
                <OptionsButton isIntroduction buttonClassNames="ml-auto my-auto" menuClassNames="right-0" />
                {/* <input type="text" className="bg-primary text-secondary h-8 w-full p-2"
                placeholder="Article's title" value={title}/> */}
            </div>
            <div className="clearfix float-right p-2 ml-4 bg-primary my-2 text-center max-w-md z-100 rounded">
                <ArticleImage title={title}/>
                <div className="mt-2 border-t-2 border-primary">
                    <h2 className="text-primary mt-2 hidden">Quick Facts</h2>
                    <div id="facts">
                        -------quick facts---------
                    </div>
                    <button id="addFact"
                    className="mt-2 w-full p-2 text-primary nav-element material-icons hidden">add</button>
                </div>
            </div>
            <div className="break-all text-justify text-secondary py-2" dangerouslySetInnerHTML={{__html: introduction}}></div>
            <div className="my-2 flex justify-center hidden">
                <button className="uppercase text-red-500 hover:text-hover text-base py-2 px-3" name="cancel">Cancel</button>
                <button className="uppercase text-primary hover:text-hover text-base py-2 px-3 bg-primary" name="save">Save</button>
            </div>
        </section>
    );
}