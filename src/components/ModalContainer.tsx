import React, { ReactNode } from 'react';

type ModalContainerProps = {
  children: ReactNode;
  className?: string;
  title: string;
} & typeof defaultProps;

const defaultProps = {
  className: '',
};

export default function ModalContainer(props: ModalContainerProps) {
  const { className, title, children } = props;

  return (
    <div className={`border-secondary box mb-2 ${className}`}>
      <h1 className="h-4 leading-4 text-center font-bold mt-2 text-secondary">
        {title}
      </h1>
      {children}
    </div>
  );
}

ModalContainer.defaultProps = defaultProps;
