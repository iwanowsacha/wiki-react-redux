import React, { MouseEvent } from 'react';

type ArticleCardProps = {
  title: string;
};

export default function ArticleCard(props: ArticleCardProps) {
  const { title } = props;

  const handleOpenArticle = (e: MouseEvent<HTMLButtonElement>) => {
    console.log(`open: ${e.currentTarget.innerHTML}`);
  };

  return (
    <div className="bg-primary rounded-md flex flex-col">
      <img
        src={`./articles/${title}/image.jpg`}
        alt=""
        className="object-cover h-p-75 rounded-t-md"
        onError={(e) => {
          // Prevent infinite loop if article-placeholder doesn't exist
          e.target.onerror = null;
          e.target.src = '../assets/article-placeholder.png';
        }}
      />
      <button
        onClick={handleOpenArticle}
        className="m-8 mb-3 uppercase text-primary whitespace-no-wrap truncate hover:text-hover text-base"
      >
        {title}
      </button>
    </div>
  );
}
