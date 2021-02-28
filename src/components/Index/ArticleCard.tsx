import React, { MouseEvent, SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';
import { loadArticle } from '../../utils/loaders';

type ArticleCardProps = {
  title: string;
};

export default function ArticleCard(props: ArticleCardProps) {
  const { title } = props;
  const dispatch = useDispatch();

  const handleOpenArticle = (e: MouseEvent<HTMLButtonElement>) => {
    dispatch(loadArticle(e.currentTarget.innerHTML));
  };

  const handleImageError = (e: SyntheticEvent<HTMLImageElement>) => {
    // Prevent infinite loop if article-placeholder doesn't exist
    e.currentTarget.onerror = null;
    e.currentTarget.src = '../assets/article-placeholder.png';
  };

  return (
    <div className="bg-primary rounded-md flex flex-col">
      <img
        src={`./articles/${title}/image.jpg`}
        alt=""
        className="object-cover h-p-75 rounded-t-md"
        onError={handleImageError}
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
