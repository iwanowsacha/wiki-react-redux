import React, { ChangeEvent } from 'react';

type RadioButtonProps = {
  group: string;
  title: string;
  value: string;
  checked: boolean;
  onChange(value: string): void;
};

export default function RadioButton(props: RadioButtonProps) {
  const { group, title, value, checked } = props;

  const handleOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.value);
  };

  return (
    <span className="block">
      <input
        onChange={handleOptionChange}
        type="radio"
        name={group}
        title={title}
        defaultValue={value}
        defaultChecked={checked}
      />
      <span className="hidden md:inline text-secondary ml-2">{title}</span>
    </span>
  );
}
