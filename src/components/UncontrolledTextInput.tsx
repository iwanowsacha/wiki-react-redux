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
  onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    console.log(`${e.key}`);
  },
};

export default function TextInput(props: UncontrolledTextInputProps) {
  const { color, placeholder } = props;

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.onTextChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    props.onKeyDown(e);
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
