import React, { ReactNode, useRef } from 'react';
import useOffset from '../../utils/hooks/useOffset';

type ArticleIndexProps = {
  children: ReactNode;
  articleTitle: string;
};

export default function ArticleIndex(props: ArticleIndexProps) {
  const { articleTitle, children } = props;
  const indexRef = useRef<HTMLSpanElement>(null);
  const offsetTop = useOffset(indexRef, false);


  return (
    <span ref={indexRef}>
      <span className="bg-primary text-secondary p-2 fixed w-1/4 z-100 hidden-scrollbar overflow-y-auto" style={{top: offsetTop, bottom: 0}}>
        <h3 className="text-center text-xl text-primary">{articleTitle}</h3>
        <ol className="mt-2">{children}</ol>
      </span>
    </span>
  );
}
