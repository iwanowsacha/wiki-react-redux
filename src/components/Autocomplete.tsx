import React, { useState, KeyboardEvent } from 'react';
import TextInput from './UncontrolledTextInput';

export default function Autocomplete(props: any) {
  const [filteredSuggestions, setFilteredSuggestions] = useState<Array<string>>(
    []
  );
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const handleInputChange = (value: string) => {
    if (value) {
      const filtered = props.suggestions.filter(
        (s: string) => s.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
      setActiveSuggestion(0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = e.key.toLowerCase();
    if (key === 'enter') {
      setActiveSuggestion(0);
    } else if (key === 'up') {
      e.preventDefault();
      if (activeSuggestion === 0) {
        return;
      }
      setActiveSuggestion(activeSuggestion - 1);
    } else if (key === 'down') {
      e.preventDefault();
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      setActiveSuggestion(activeSuggestion + 1);
    }
  };

  return (
    <div className="autocomplete relative w-full">
      <TextInput
        color="bg-secondary"
        placeholder="Search"
        onTextChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <div
        className={filteredSuggestions.length ? 'autocomplete-items' : 'hidden'}
      >
        {filteredSuggestions.map((f, index) => {
          return (
            <div
              className={
                activeSuggestion === index ? 'autocomplete-active' : ''
              }
              key={f}
            >
              {f}
            </div>
          );
        })}
      </div>
    </div>
  );
}
