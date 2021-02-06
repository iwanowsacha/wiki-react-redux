import React from "react";
import { getDocuments } from "../../features/general/generalSlice";
import { useSelector } from "react-redux";
import { ArticleCard } from "./ArticleCard";
import { ListCard } from "./ListCard";

export function PageIndex() {
    const documents = useSelector(getDocuments);
    return(      
        <main className="grid sm:grid-cols-2 lg:grid-cols-4 w-full h-full gap-5 px-6 mt-8 flex-auto">
            <section className="grid sm:grid-cols-2 lg:col-span-3 lg:grid-cols-4 gap-5 grid-rows-2">
                {documents.articles && 
                [...documents.articles].sort(() => 0.5 - Math.random()).slice(0, 8).map((a: string) => <ArticleCard key={a} title={a} />)
                }
            </section>
            <ListCard lists={documents.lists} />
        </main>
    );
}