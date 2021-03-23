import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import TextInput from './UncontrolledTextInput';
import IconButton from './IconButton';
import delay from '../utils/inputDelay';
import { useDispatch, useSelector } from 'react-redux';
import { getDocumentTitle, toggleSearchPage } from '../features/general/generalSlice';

export default function SearchPage() {
    const dispatch = useDispatch();
    const changedDocument = useSelector(getDocumentTitle);
    const [matches, setMatches] = useState(0);
    const [currentMatch, setCurrentMatch] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [isCaseSensitive, setIsCaseSensitive] = useState(false);

    const handleTextChange = (value: string) => {
        setSearchText(value);
        if (!value) {
            setMatches(0);
            setCurrentMatch(0);
            ipcRenderer.send('stop-page-search', 'clearSelection');
            return;
        }
        ipcRenderer.send('search-in-page', value, {matchCase: isCaseSensitive});
    }

    const handleForwardClick = () => {
        ipcRenderer.send('search-in-page', searchText, {forward: false, matchCase: isCaseSensitive});
    }

    const handleBackwardClick = () => {
        ipcRenderer.send('search-in-page', searchText, {findNext: true, matchCase: isCaseSensitive});
    }

    const handleCloseClick = () => {
        ipcRenderer.send('stop-page-search', 'clearSelection');
        dispatch(toggleSearchPage());
    }

    const handleCaseSensitiveChange = () => {
        setIsCaseSensitive(!isCaseSensitive);
        ipcRenderer.send('search-in-page', searchText, {matchCase: !isCaseSensitive});
    }

    useEffect(() => {
        ipcRenderer.on('found-in-page', (_event, result) => {
            setMatches(result.matches);
            setCurrentMatch(result.activeMatchOrdinal);
        });
    }, []);

    useEffect(() => {
        if (!searchText) return;
        ipcRenderer.send('search-in-page', searchText, {matchCase: isCaseSensitive});
    }, [changedDocument]);

    return(
        <div className="bg-secondary fixed top-0 right-0 p-2 border-2 border-secondary rounded-md" style={{zIndex: 1000}}>
            <div className="flex">
                <TextInput color="flex-1 bg-primary" onTextChange={delay(handleTextChange, 500)} />
                <IconButton onClick={handleForwardClick}>chevron_left</IconButton>
                <IconButton onClick={handleBackwardClick}>chevron_right</IconButton>
                <IconButton onClick={handleCloseClick}>close</IconButton>
            </div>
            <div className="flex">
                <p className="text-sm mt-2 justify-self-start flex-1">{currentMatch} of {matches} matches</p>
                <label htmlFor="" className="text-sm mt-2 justify-self-end">
                    <input type="checkbox" defaultChecked={false} className="mr-2" onChange={handleCaseSensitiveChange}/>
                    aA
                </label>
            </div>
        </div>
    );
}