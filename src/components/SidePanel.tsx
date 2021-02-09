import React, { ReactNode, useEffect, useRef, useState } from 'react';

type SidePanelProps = {
  children: ReactNode;
};

export default function SidePanel(props: SidePanelProps) {
  const { children } = props;
  const panelRef = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(panelRef?.current?.offsetTop || 0);
  }, [panelRef]);

  return (
    <span
      className="bg-primary text-secondary border-t-2 border-secondary"
      ref={panelRef}
      style={{ flex: '0 0 10%' }}
    >
      <div className="sticky" style={{ top: offset }}>
        {children}
      </div>
    </span>
  );
}
