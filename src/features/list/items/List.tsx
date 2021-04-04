import { createSelector } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getSearchText, selectAllItems, setItemCount, sortItems } from './itemsSlice';
import { getListTitle } from '../listSlice';
import { getCustomTags, getFilterType, getSelectedTags } from '../tags/tagsSlice';
import { ListItem as ListItemT } from '../../../types';
import { filter, filterByText, filterCustom } from '../../../utils/list/filters/filters';
import { DragOverlay, DragStartEvent, DragEndEvent, useSensor, useSensors, DndContext, closestCenter, PointerSensor } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import SortableListItem from './SortableListItem';
import { getIsEditing } from '../../general/generalSlice';
import ListItem from './ListItem';

const getFilteredItems = createSelector(
  [getSearchText, getSelectedTags, getFilterType, getCustomTags, selectAllItems],
  (
    searchText: string,
    selectedTags: Array<string>,
    filterType: string,
    customTags: {[key: string]: Array<string>},
    items: Array<ListItemT>
  ) => {
    let filtered;
    if (selectedTags.length > 0) {
      if (filterType !== 'custom') {
        filtered = filter(filterType, items, selectedTags);
      } else {
        filtered = filterCustom(items, customTags);
      }
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
  const isEditing = useSelector(getIsEditing);
  const title = useSelector(getListTitle);
  const [renderItems, setRenderItems] = useState(items.slice(0, 30));
  const [hasMore, setHasMore] = useState(true);
  const [currentDrag, setCurrentDrag] = useState({} as typeof items[0]);
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor, {activationConstraint: {delay:100, tolerance: 3}})
  );

  useEffect(() => {
    dispatch(setItemCount(items.length));
  }, [items.length]);

  useEffect(() => {
    setHasMore(true);
    setRenderItems(items.slice(0, renderItems.length < 30 ? 30 : renderItems.length));
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

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    setCurrentDrag({} as typeof items[0]);
    if (over && active.id !== over.id) {
      dispatch(sortItems([active.id, over.id]))
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const {active} = event;
    setCurrentDrag(items.find((i) => active.id === i.title) || {} as typeof items[0]);
  }

  return (

    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      autoScroll={true}

    >
      <SortableContext
        items={items.map((i)=> i.title)}
        strategy={rectSortingStrategy}
      >
        <InfiniteScroll
          dataLength={renderItems.length}
          next={next}
          hasMore={hasMore}
          loader={<></>}
        >
          <span className="flex flex-wrap pt-4 justify-evenly">
            {isEditing
              ? (renderItems?.map((i) => (
                <SortableListItem
                  onItemClick={onItemClick}
                  listTitle={title}
                  title={i.title}
                  image={i.image}
                  key={i.title}
                />
              )))
              : (renderItems?.map((i) => (
                <ListItem
                  onItemClick={onItemClick}
                  listTitle={title}
                  title={i.title}
                  image={i.image}
                  key={i.title}
                />
              )))
            }
          </span>
        </InfiniteScroll>
      </SortableContext>
      {isEditing &&
          (<DragOverlay adjustScale={true} className='opacity-60'>
            {currentDrag.title ? <ListItem onItemClick={onItemClick} listTitle={title} title={currentDrag.title} image={currentDrag.image} key={currentDrag.title}/> : null}
          </DragOverlay>)
      }
    </DndContext>

  );
});

export default List;
