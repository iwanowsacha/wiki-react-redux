import React, { useState, SyntheticEvent } from "react";
import { TextInput } from "./UncontrolledTextInput";

export function Autocomplete(props: any) {
    const [filteredSuggestions, setFilteredSuggestions] = useState<Array<string>>([]);
    const [activeSuggestion, setActiveSuggestion] = useState(0);

    const handleInputChange = (value: string) => {
        if (value) {
            const filtered = props.suggestions.filter((s: string) => s.toLowerCase().indexOf(value.toLowerCase()) > -1);
            setFilteredSuggestions(filtered)
        } else {
            setFilteredSuggestions([]);
            setActiveSuggestion(0);
        }
    }

    const handleKeyDown = (e: SyntheticEvent) => {
        // 13 = Enter, 38 = up, 40 = down
        // Prevent default on 38/40 to avoid the cursor moving back and forth in the input
        if (e.keyCode === 13) {
            setActiveSuggestion(0);
        } else if(e.keyCode === 38) {
            e.preventDefault();
            if (activeSuggestion === 0) {
                return;
            }
            setActiveSuggestion(activeSuggestion-1);
        } else if (e.keyCode === 40) {
            e.preventDefault();
            if (activeSuggestion - 1 === filteredSuggestions.length) {
                return;
            }
            setActiveSuggestion(activeSuggestion+1);
        }
    }

    return (
        <div className="autocomplete relative w-full">
            <TextInput color="bg-secondary" placeholder="Search" onTextChange={handleInputChange} onKeyDown={handleKeyDown}/>
            <div className={filteredSuggestions.length ? "autocomplete-items" : "hidden"}>
                {
                filteredSuggestions.map((f, index) => {
                    return (
                        <div className={activeSuggestion === index ? "autocomplete-active" : ""} key={f}>
                            {f}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}   