import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../../components/IconButton';
import { addQuickFact, getArticleQuickFacts } from './articleSlice';
import { ArticleQuickFact as ArticleQuickFactT } from '../../types';
import ArticleQuickFact from './ArticleQuickFact';

type ArticleListQuickFactsProps = {
  isArticleEditing: boolean;
}

export default function ArticleListQuickFacts(props: ArticleListQuickFactsProps) {
  const { isArticleEditing } = props;
  const dispatch = useDispatch();
  const facts = useSelector(getArticleQuickFacts);

  const handleAddFactClick = () => {
    dispatch(addQuickFact());
  };

  console.log(facts);
  return (
    <div className="mt-2 border-t-2 border-primary">
      <div className="flex flex-col w-full">
        {facts?.map((f: ArticleQuickFactT) => {
          return (
            <ArticleQuickFact
              key={f.title}
              title={f.title}
              body={f.body}
              isArticleEditing={isArticleEditing}
            />
          );
        })}
      </div>
      {isArticleEditing &&
        !facts?.some((f: ArticleQuickFactT) => f.title === '') && (
          <IconButton
            classNames="text-primary mt-2"
            onClick={handleAddFactClick}
          >
            add
          </IconButton>
        )}
    </div>
  );
}
