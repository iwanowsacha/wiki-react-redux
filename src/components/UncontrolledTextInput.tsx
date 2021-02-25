import React, { ChangeEvent, KeyboardEvent } from 'react';

type UncontrolledTextInputProps = {
  color?: string;
  placeholder?: string;
  onTextChange(value: string): void;
  onKeyDown?(e: KeyboardEvent<HTMLInputElement>): void;
} & typeof defaultProps;

const defaultProps = {
  color: 'bg-primary',
  placeholder: '',
  onKeyDown: undefined,
};

export default function TextInput(props: UncontrolledTextInputProps) {
  const { color, placeholder, onTextChange, onKeyDown } = props;

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

TextInput.defaultProps = defaultProps;
