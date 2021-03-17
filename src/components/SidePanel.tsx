import React, { ReactNode, useRef } from 'react';
import useOffset from '../utils/hooks/useOffset';

type SidePanelProps = {
  children: ReactNode;
};

export default function SidePanel(props: SidePanelProps) {
  const { children } = props;
  const panelRef = useRef<HTMLSpanElement>(null);
  const offset = useOffset(panelRef, true);

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
