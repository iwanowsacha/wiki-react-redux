import { ListItem } from '../../../types';

export const filter = (
  filterType: string,
  items: Array<ListItem>,
  selectedTags: Array<string>
) => {
  const fn = filterTypes.get(filterType);
  if (
    !fn ||
    !items ||
    !selectedTags ||
    items?.length <= 0 ||
    selectedTags?.length <= 0
  )
    return;
  return items.filter((it) => fn(it, selectedTags));
};

export const filterByText = (items: Array<ListItem>, text: string) =>
  items.filter((it) => it.title.toLowerCase().indexOf(text.toLowerCase()) > -1);

const filterAny = (item: ListItem, selectedTags: Array<string>) =>
  selectedTags.some((t) => item.tags.includes(t));

const filterAll = (item: ListItem, selectedTags: Array<string>) =>
  selectedTags.every((t) => item.tags.includes(t));

const filterNone = (item: ListItem, selectedTags: Array<string>) =>
  !selectedTags.some((t) => item.tags.includes(t));

export const filterCustom = (items: Array<ListItem>, customTags: {[key: string]: Array<string>}) => {
  if (!items || !customTags || items?.length <= 0 || !customTags?.hasOwnProperty('customHas') || !customTags?.hasOwnProperty('customNot') || customTags?.customHas?.length <= 0 || customTags?.customNot?.length <= 0) return;
  return items.filter((it) => customTags.customHas.every(t => it.tags.includes(t)) && !customTags.customNot.some(t => it.tags.includes(t)));
}

const filterTypes = new Map([
  ['any', filterAny],
  ['all', filterAll],
  ['none', filterNone],
]);
