import React from 'react';
import { useSelector } from 'react-redux';
import { getDocuments } from '../../features/general/generalSlice';
import ArticleCard from './ArticleCard';
import ListCard from './ListCard';

export default function PageIndex() {
  const documents = useSelector(getDocuments);
  return (
    <main className="grid sm:grid-cols-2 lg:grid-cols-4 w-full h-full gap-5 px-6 my-8 flex-auto overflow-auto hidden-scrollbar">
        <section className="grid sm:grid-cols-2 lg:col-span-3 lg:grid-cols-4 gap-5 grid-rows-2">
      
        {documents.articles.length > 0
          ? (
                [...documents.articles]
                .sort(() => 0.5 - Math.random())
                .slice(0, 8)
                .map((a: string) => <ArticleCard key={a} title={a} />)
              )
              : <div className="bg-primary row-span-2 sm:col-span-2 lg:col-span-4 flex flex-col text-center justify-center items-center text-primary rounded-md uppercase h-full w-full gap-2">
                  <div>No articles found</div>
                  <div className="text-sm normal-case">Press Ctrl+N or click the button "New article" in the menu on top to add a new one</div>
                </div>
            }
      
      </section>
      <section className="bg-primary h-full rounded-md">
        {documents.lists.length > 0  
            ? (<>
                <h1 className="text-primary text-center uppercase m-5 text-lg">Lists</h1>
                <ul className="text-primary text-center list-none">
                {[...documents.lists].map((l: string) => {
                  return (
                    <ListCard key={l} title={l} />
                  );
              })}
              </ul>
              </>)
            : <div className="h-full flex flex-col text-center justify-center items-center text-primary uppercase gap-2">
                <div>No lists found</div>
                <div className="text-sm normal-case px-2">Press Ctrl+L or click the button "New list" in the menu on top to add a new one.</div>
              </div>
        }
      </section>
    </main>
  );
}
