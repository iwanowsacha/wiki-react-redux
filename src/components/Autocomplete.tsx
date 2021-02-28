import React, { useState, KeyboardEvent, MouseEvent } from 'react';
import TextInput from './ControlledTextInput';

type AutocompleteProps = {
  suggestions: Array<string>;
  onSuggestionSelected: (selected: string) => void;
};

export default function Autocomplete(props: AutocompleteProps) {
  const { suggestions } = props;
  const [filteredSuggestions, setFilteredSuggestions] = useState<Array<string>>(
    []
  );
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [searchText, setSearchText] = useState('');

  const handleInputChange = (value: string) => {
    if (value) {
      const filtered = suggestions.filter(
        (s) => s.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
      setActiveSuggestion(0);
    }
    setSearchText(value);
  };

  const resetState = () => {
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setSearchText('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = e.key.toLowerCase();
    if (key === 'enter') {
      const active = filteredSuggestions[activeSuggestion];
      resetState();
      props.onSuggestionSelected(active);
    } else if (key === 'arrowup') {
      e.preventDefault();
      if (activeSuggestion === 0) {
        return;
      }
      setActiveSuggestion(activeSuggestion - 1);
    } else if (key === 'arrowdown') {
      e.preventDefault();
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      setActiveSuggestion(activeSuggestion + 1);
    }
  };

  const handleSuggestionClick = (e: MouseEvent<HTMLDivElement>) => {
    const suggestion = e.currentTarget.innerHTML;
    resetState();
    props.onSuggestionSelected(suggestion);
  };

  return (
    <div className="autocomplete relative w-full">
      <TextInput
        text={searchText}
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
              onClick={handleSuggestionClick}
            >
              {f}
            </div>
          );
        })}
      </div>
    </div>
  );
}
