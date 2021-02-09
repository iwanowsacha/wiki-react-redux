import React, { ReactNode } from 'react';
import ModalContainer from '../../../components/ModalContainer';

type TagGroupProps = {
  children: ReactNode;
  title: string;
};

export default function TagGroup(props: TagGroupProps) {
  const { title, children } = props;

  return (
    <ModalContainer className="border-2 inline-block mb-6 w-full" title={title}>
      <div className="p-2">{children}</div>
    </ModalContainer>
  );
}
