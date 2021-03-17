import { useState, useEffect, RefObject } from 'react';

export default function useOffset(elementRef: RefObject<HTMLElement>, useParentOffset: boolean) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (useParentOffset) {
      setOffset(elementRef?.current?.offsetParent?.offsetTop || 0);
    } else {
      setOffset(elementRef?.current?.offsetTop || 0);
    }
  }, [elementRef.current]);

  return offset;
}
