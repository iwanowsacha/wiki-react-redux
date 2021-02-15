import React, { ReactNode, useEffect, useRef, useState } from 'react';

type ArticleIndexProps = {
    children: ReactNode;
    articleTitle: string;
}

export default function ArticleIndex(props: ArticleIndexProps) {
    const { articleTitle, children } = props;
    const indexRef = useRef<HTMLSpanElement>();
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        setOffset(indexRef?.current?.offsetParent?.offsetTop || 0);
    }, [indexRef])

    return(
        <span className="bg-primary text-secondary p-2 h-full fixed w-1/4 z-100" style={{marginTop: offset}}>
            <h3 className="text-center text-xl text-primary">
                {articleTitle}
            </h3>
            <ol className="mt-2">
                {children}
            </ol>
        </span>
    );
}