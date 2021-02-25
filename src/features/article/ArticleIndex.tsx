import React, { ReactNode } from 'react';

type ArticleIndexProps = {
  children: ReactNode;
  articleTitle: string;
};

export default function ArticleIndex(props: ArticleIndexProps) {
  const { articleTitle, children } = props;

  return (
    <span className="bg-primary text-secondary p-2 h-full fixed w-1/4 z-100">
      <h3 className="text-center text-xl text-primary">{articleTitle}</h3>
      <ol className="mt-2">{children}</ol>
    </span>
  );
}
