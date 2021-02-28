import React, { KeyboardEvent, ChangeEvent } from 'react';

type ControlledTextInputProps = {
  color?: string;
  text: string;
  placeholder?: string;
  onTextChange: (value: string) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
};

export default function TextInput(props: ControlledTextInputProps) {
  const { color = 'bg-primary', text, placeholder = '' } = props;

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) =>
    props.onTextChange(e.target.value);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!props.onKeyDown) return;
    props.onKeyDown(e);
  };

  return (
    <input
      type="text"
      className={`h-8 w-full rounded ${color}`}
      value={text}
      placeholder={placeholder}
      onChange={handleTextChange}
      onKeyDown={handleKeyDown}
    />
  );
}
