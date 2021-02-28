import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDocuments, getIsEditing } from '../features/general/generalSlice';
import IconButton from './IconButton';
import Autocomplete from './Autocomplete';
import { loadArticle, loadList } from '../utils/loaders';

type HeaderProps = {
  showMenuButton: boolean;
  showESButtons: boolean;
  onESButtonClick: (type: string) => void;
  onMenuButtonClick: () => void;
};

export default function Header(props: HeaderProps) {
  const {
    showMenuButton,
    showESButtons,
    onESButtonClick,
    onMenuButtonClick,
  } = props;
  const dispatch = useDispatch();
  const isEditing = useSelector(getIsEditing);
  const documents = useSelector(getDocuments);
  const suggestions = [...documents.articles, ...documents.lists];

  const handleAutocompleteEnter = (value: string) => {
    if (documents.lists.includes(value)) dispatch(loadList(value));
    if (documents.articles.includes(value)) dispatch(loadArticle(value));
  };

  return (
    <header className="grid grid-cols-4 w-full gap-4 items-center bg-primary sticky top-0 z-100">
      <div className="ml-6 justify-self-start flex flex-wrap gap-2">
        {showMenuButton && (
          <IconButton
            classNames="text-base md:py-2 md:px-4 md:text-2xl text-secondary"
            onClick={onMenuButtonClick}
          >
            menu
          </IconButton>
        )}
      </div>
      <div className="col-span-2 self-stretch my-2 bg-secondary text-secondary py-2 px-3 inline-flex rounded">
        <Autocomplete
          suggestions={suggestions}
          onSuggestionSelected={handleAutocompleteEnter}
        />
        <div className="hidden sm:block text-base md:text-2xl material-icons self-center ml-2 pl-2 border-l-2 border-secondary">
          search
        </div>
      </div>
      {showESButtons && (
        <div className="mr-6 justify-self-end flex flex-wrap gap-2">
          <IconButton
            classNames="text-base md:py-2 md:px-4 md:text-2xl text-red-500"
            onClick={onESButtonClick}
          >
            delete
          </IconButton>
          <IconButton
            classNames="text-base md:py-2 md:px-4 md:text-2xl text-primary"
            onClick={onESButtonClick}
          >
            {isEditing ? 'save' : 'edit'}
          </IconButton>
        </div>
      )}
    </header>
  );
}
