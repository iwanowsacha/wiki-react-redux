import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { basename } from 'path';
import TextInput from '../../../components/ControlledTextInput';
import RadioButton from '../../../components/RadioButton';
import { getDocuments, setSnackbar } from '../../general/generalSlice';
import { getSelectedTags, resetSelectedTags } from '../tags/tagsSlice';
import { addItem, selectById, selectIds, updateItem } from './itemsSlice';
import { getBrowseImage, getListTitle, setBrowseImage } from '../listSlice';
import TinymceEditor from '../../../components/TinymceEditor';

type ListFormProps = {
  item: string;
  onFormEmptying(): void;
};

export default function ListForm(props: ListFormProps) {
  const dispatch = useDispatch();
  const allItems = useSelector(selectIds);
  const item = useSelector((state) => selectById(state, props.item));
  const documents = useSelector(getDocuments);
  const selectedTags = useSelector(getSelectedTags);
  const selectedImage = useSelector(getBrowseImage);
  const listTitle = useSelector(getListTitle);
  const [itemTitle, setItemTitle] = useState(item?.title || '');
  const [editorContent, setEditorContent] = useState(item?.body || '');
  const [newTags, setNewTags] = useState('');
  const [isUpdatingItem, setIsUpdatingItem] = useState(!!item);

  const linkPathInitialValue = () => {
    if (item?.link.startsWith('locala://') && documents.articles.includes(item?.link.replace('locala://', ''))) {
      return item.link.replace('locala://', 'A');
    } else if (item?.link.startsWith('locall://') && documents.lists.includes(item?.link.replace('locall://', ''))) {
      return item.link.replace('locall://', 'L');
    }
    return '';
  }

  const [linkPath, setLinkPath] = useState(
    item?.link.startsWith('local')
      ? linkPathInitialValue()
      : item?.link || ''
  );

  console.log(linkPath);

  const [linkType, setLinkType] = useState(
    !item?.link?.startsWith('local') && linkPath ? 'external' : 'local'
  );


  const handleEditorContentChange = (content: string) => {
    setEditorContent(content);
  };

  const handleItemTitleChange = (value: string) => {
    setItemTitle(value);
  };

  const handleExternalLinkChange = (value: string) => {
    setLinkPath(value);
  };

  const handleLocalLinkChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLinkPath(e.target.value);
  };

  const handleRadioChange = (value: string) => {
    setLinkType(value);
    if (
      value === 'local' &&
      isUpdatingItem &&
      item?.link.startsWith('local')
    ) {
      setLinkPath(linkPathInitialValue());
    } else if (
      value === 'external' &&
      isUpdatingItem &&
      !item?.link.startsWith('local')
    ) {
      setLinkPath(item?.link || '');
    } else {
      setLinkPath('');
    } 
  };

  const handleNewTagsChange = (value: string) => {
    setNewTags(value);
  };

  const doesItemExist = () => {
    if ((isUpdatingItem && item?.title !== itemTitle) || !isUpdatingItem) {
      const itemExists = allItems.find((it: any) => it.title === itemTitle);
      if (itemExists) {
        return true;
      }
      return false;
    }
    return false;
  };

  const sanitizeTags = (): Array<string> => {
    const separateNewTags = newTags
      ? newTags.split(',').map((t: string) => t.trim().toLowerCase())
      : [];
    const tags = new Set([...separateNewTags, ...selectedTags]); // Avoid repeats
    return Array.from(tags);
  };

  const updateCurrentItem = (updatedItem: any) => {
    if (!item) return;
    if (item.image === basename(updatedItem.image))
      updatedItem.image = item.image;
    dispatch(
      updateItem({
        id: item.title,
        changes: updatedItem,
      })
    );

    dispatch(setSnackbar(['Item updated correctly', 'text-primary']));
    setIsUpdatingItem(false);
  };

  const addCurrentItem = (newItem: any) => {
    dispatch(setSnackbar(['Item saved correctly', 'text-primary']));
    dispatch(addItem(newItem));
  };

  const emptyForm = () => {
    setIsUpdatingItem(false);
    setItemTitle('');
    setLinkType('external');
    setLinkPath('');
    setEditorContent('');
    setNewTags('');
    dispatch(resetSelectedTags());
    dispatch(setBrowseImage(''));
    props.onFormEmptying();
  };

  const sanitizeLink = () => {
    let link = '';
    if (!linkPath) return link;
    if (linkType === 'local') {
      const isArticle = linkPath.startsWith('A') ? true : false;
      if (isArticle) {
        link = `locala://${linkPath.substr(1)}`;
      } else {
        link = `locall://${linkPath.substr(1)}`;
      }
    } else if (linkType === 'external' && !linkPath.startsWith('http://') && !linkPath.startsWith('https://')) {
      link = `http://${linkPath}`;
    } else {
      link = linkPath;
    }
    return link;
  };

  const handleSaveButtonClick = () => {
    if (!itemTitle || !selectedImage) {
      dispatch(setSnackbar(['Item must have title and image', 'text-red-500']));
      return;
    }
    if (doesItemExist()) {
      dispatch(
        setSnackbar(['An item with that title already exists', 'text-red-500'])
      );
      return;
    }

    const newItem = {
      title: itemTitle,
      image: selectedImage,
      body: editorContent,
      link: sanitizeLink(),
      tags: sanitizeTags(),
    };
    isUpdatingItem ? updateCurrentItem(newItem) : addCurrentItem(newItem);
    emptyForm();
  };

  return (
    <section className="h-full bg-secondary">
      <div className="grid grid-cols-8 new-item-form h-full gap-x-2 p-4 items-center">
        <div className="col-span-3 my-2 bg-primary py-2 px-6 text-secondary">
          <TextInput
            text={itemTitle}
            color="bg-primary"
            placeholder="Title"
            onTextChange={handleItemTitleChange}
          />
        </div>
        <div className="col-span-5 my-2 py-2 px-3 grid grid-cols-4 gap-4">
          <div className="w-full my-2 py-2 px-6 relative inline-block col-span-3 bg-primary text-secondary">
            {linkType === 'external' ? (
              <TextInput
                text={linkPath}
                color="bg-primary"
                placeholder="Link to"
                onTextChange={handleExternalLinkChange}
              />
            ) : (
              <select
                className="bg-primary text-secondary w-full h-8"
                defaultValue={linkPath}
                onChange={handleLocalLinkChange}
              >
                <option value="">Link to</option>
                <optgroup label="Articles">
                  {
                    documents.articles.map((a: string) => <option key={a} value={`A${a}`}>{a}</option>)
                  }
                </optgroup>
                <optgroup label="Lists">
                  {
                    documents.lists.map((l: string) => {
                      if (l === listTitle) return;
                      return (
                        <option key={l} value={`L${l}`}>
                          {l}
                        </option>
                      )
                    })
                  }
                </optgroup>
              </select>
            )}
          </div>
          <div className="my-2">
            <RadioButton
              onChange={handleRadioChange}
              group="link"
              title="Article link"
              value="local"
              checked={linkType === 'local'}
            />
            <RadioButton
              onChange={handleRadioChange}
              group="link"
              title="External link"
              value="external"
              checked={linkType === 'external'}
            />
          </div>
        </div>
        <span className="col-span-8 row-span-5 self-stretch text-secondary">
          <TinymceEditor editorContent={editorContent} onEditorContentChange={handleEditorContentChange} />
        </span>
        <div className="col-span-8">
          <div className="my-2 bg-primary py-2 px-3 text-secondary">
            <TextInput
              text={newTags}
              color="bg-primary"
              placeholder="New tags"
              onTextChange={handleNewTagsChange}
            />
          </div>
          <small className="text-xs text-secondary">
            Separate new tags by using commas (,)
          </small>
        </div>
        <div className="col-span-4 my-2 py-2 px-3 justify-self-end">
          <button className="text-secondary" onClick={emptyForm}>
            Empty
          </button>
        </div>
        <div className="col-span-4 my-2 py-2 px-3 justify-self-start">
          <button
            className="uppercase text-primary hover:text-hover text-base py-2 px-3 bg-primary"
            onClick={handleSaveButtonClick}
          >
            Save
          </button>
        </div>
      </div>
    </section>
  );
}
