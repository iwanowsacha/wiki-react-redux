import React, { SyntheticEvent } from "react";

type ArticleCardProps = {
    title: string
}

export function ArticleCard(props: ArticleCardProps) {
    const handleOpenArticle = (e: SyntheticEvent) => {
        console.log(`open: ${e.target.innerHTML}`);
    }
    return (
        <div className="bg-primary rounded-md flex flex-col">
            <img src={`./articles/${props.title}/image.jpg`} alt="" className="object-cover h-p-75 rounded-t-md" onError={(e) => {
                // Prevent infinite loop if article-placeholder doesn't exist
                e.target.onerror=null; 
                e.target.src='../assets/article-placeholder.png';
            }} />
            <button onClick={handleOpenArticle} className="m-8 mb-3 uppercase text-primary whitespace-no-wrap truncate hover:text-hover text-base">{props.title}</button>
        </div>
    );
}