import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDocuments, getIsEditing } from '../features/general/generalSlice';
import IconButton from './IconButton';
import Autocomplete from './Autocomplete';
import { loadArticle, loadList } from '../utils/loaders';
import useOnUnmount from '../utils/hooks/useOnUnmount';
import { initDocumentLink } from '../utils/tinymcePlugin';

type HeaderProps = {
  showMenuButton: boolean;
  showESButtons: boolean;
  onESButtonClick: (type: string) => void;
  onDeleteButtonClick: () => void;
  onMenuButtonClick: () => void;
};

export default function Header(props: HeaderProps) {
  const {
    showMenuButton,
    showESButtons,
    onESButtonClick,
    onDeleteButtonClick,
    onMenuButtonClick,
  } = props;
  const dispatch = useDispatch();
  const isEditing = useSelector(getIsEditing);
  const documents = useSelector(getDocuments);
  const shouldUnmount = useOnUnmount();
  const suggestions = [...Array.from(documents.articles, val => `(A) ${val}`), ...Array.from(documents.lists, val => `(L) ${val}`)];

  useEffect(() => {
    initDocumentLink(documents);
  }, [documents])

  const handleAutocompleteEnter = async (value: string) => {
    if (isEditing && !await shouldUnmount()) return;
    const type = value.slice(1, 2);
    const document = value.slice(3).trim();
    if (type === 'A' && documents.articles.includes(document)) {
      dispatch(loadArticle(document));
    } else if (type === 'L' && documents.lists.includes(document)) {
      dispatch(loadList(document));
    }
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
            onClick={onDeleteButtonClick}
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
