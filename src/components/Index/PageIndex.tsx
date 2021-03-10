import React from 'react';
import { useSelector } from 'react-redux';
import { getDocuments } from '../../features/general/generalSlice';
import ArticleCard from './ArticleCard';
import ListCard from './ListCard';

export default function PageIndex() {
  const documents = useSelector(getDocuments);
  return (
    <main className="grid sm:grid-cols-2 lg:grid-cols-4 w-full h-full gap-5 px-6 mt-8 flex-auto">
      <section className="grid sm:grid-cols-2 lg:col-span-3 lg:grid-cols-4 gap-5 grid-rows-2">
        {documents.articles &&
          [...documents.articles]
            .sort(() => 0.5 - Math.random())
            .slice(0, 8)
            .map((a: string) => <ArticleCard key={a} title={a} />)}
      </section>
      <section className="bg-primary h-full rounded-md">
        <h1 className="text-primary text-center uppercase m-5 text-lg">Lists</h1>
        <ul className="text-primary text-center list-none">
          {documents.lists &&
            [...documents.lists].map((l: string) => {
            return (
              <ListCard key={l} title={l} />
            );
          })}
        </ul>
      </section>
    </main>
  );
}
