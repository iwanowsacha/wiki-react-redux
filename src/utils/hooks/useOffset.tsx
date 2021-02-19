import { useState, useEffect, RefObject } from 'react';

export default function useOffset(elementRef: RefObject<HTMLElement>) {
    const [offset, setOffset] = useState(0);


    useEffect(() => {
        setOffset(elementRef?.current?.offsetParent?.offsetTop || 0);
    }, [elementRef.current]);

    return offset;
}  