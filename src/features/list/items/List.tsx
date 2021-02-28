import { createSelector } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getSearchText, selectAllItems } from './itemsSlice';
import { getListTitle } from '../listSlice';
import { getFilterType, getSelectedTags } from '../tags/tagsSlice';
import ListItem from './ListItem';
import { ListItem as ListItemT } from '../../../types';
import { filter, filterByText } from '../../../utils/filters/filters';

const getFilteredItems = createSelector(
  [
    getSearchText,
    getSelectedTags,
    getFilterType,
    selectAllItems,
  ],
  (
    searchText: string,
    selectedTags: Array<string>,
    filterType: string,
    items: Array<ListItemT>
  ) => {
    let filtered;
    if (selectedTags.length > 0) {
      filtered = filter(filterType, items, selectedTags);
    }
    if (searchText) filtered = filterByText(filtered || items, searchText);
    return filtered || items;
  }
);

type ListProps = {
  onItemClick(title: string): void;
};

const List = React.memo(function List(props: ListProps) {
  const { onItemClick } = props;
  const items = useSelector(getFilteredItems);
  const title = useSelector(getListTitle);
  const [renderItems, setRenderItems] = useState(items.slice(0, 30));
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setHasMore(true);
    setRenderItems(items.slice(0, 30));
  }, [items]);

  const next = () => {
    if (renderItems.length === items.length) {
      setHasMore(false);
    } else {
      setTimeout(
        () =>
          setRenderItems(
            renderItems.concat(
              items.slice(renderItems.length, renderItems.length + 30)
            )
          ),
        500
      );
    }
  };

  return (
    <InfiniteScroll
      dataLength={renderItems.length}
      next={next}
      hasMore={hasMore}
      loader={<></>}
    >
      <span className="flex flex-wrap pt-4 justify-evenly">
        {renderItems?.map((i: any) => (
          <ListItem
            onItemClick={onItemClick}
            listTitle={title}
            title={i.title}
            image={i.image}
            key={i.title}
          />
        ))}
      </span>
    </InfiniteScroll>
  );
});

export default List;
