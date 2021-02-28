import React, { ChangeEvent, KeyboardEvent } from 'react';

type UncontrolledTextInputProps = {
  color?: string;
  placeholder?: string;
  onTextChange(value: string): void;
  onKeyDown?(e: KeyboardEvent<HTMLInputElement>): void;
};

export default function TextInput(props: UncontrolledTextInputProps) {
  const {
    color = 'bg-primary',
    placeholder = '',
    onTextChange,
    onKeyDown = null,
  } = props;

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    onTextChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!onKeyDown) return;
    onKeyDown(e);
  };

  return (
    <input
      type="text"
      className={`h-8 w-full rounded ${color}`}
      placeholder={placeholder}
      onChange={handleTextChange}
      onKeyDown={handleKeyDown}
    />
  );
}
