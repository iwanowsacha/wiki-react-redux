import { createSelector } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllItems } from "./itemsSlice";
import { getListTitle } from "../listSlice";
import { getFilterType, getSelectedTags } from "../tags/tagsSlice";
import { ListItem } from "./ListItem";
import InfiniteScroll from "react-infinite-scroll-component";

const getFilteredItems = createSelector(
    [state => state.list.items.searchText,
    getSelectedTags,
    getFilterType,
    selectAllItems
    ],
    (searchText, selectedTags, filterType, items) => {
        let filtered;
        if (selectedTags.length > 0) {
            switch(filterType) {
                case "any":
                    filtered = items.filter((it: any) => selectedTags.some((t: string) => it.tags.includes(t)));
                    break;
                case "all":
                    filtered = items.filter((it: any) => selectedTags.every((t: string) => it.tags.includes(t)));
                    break;
                case "none":
                    filtered = items.filter((it: any) => !selectedTags.some((t: string) => it.tags.includes(t)));
                    break;
            }
            if (searchText) {
                filtered = filtered?.filter((it: any) => it.title.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
            }
        } else if (searchText) {
            filtered = items.filter((it: any) => it.title.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
        }
        return filtered || items;
    }
)

type ListProps = {
    onItemClick(title: string): void
}

export const List = React.memo(function List(props: ListProps) {
    const items = useSelector(getFilteredItems);
    const title = useSelector(getListTitle);
    const [renderItems, setRenderItems] = useState(items.slice(0, 30));
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setHasMore(true);
        setRenderItems(items.slice(0, 30));
    }, [items]);

    const next = () => {
        if (renderItems.length == items.length) {
            setHasMore(false);
        } else {
            setTimeout(() => setRenderItems(renderItems.concat(items.slice(renderItems.length, renderItems.length+30))), 500);
        }
    }

    return(
        <InfiniteScroll
            dataLength={renderItems.length}
            next={next}
            hasMore={hasMore}
            loader={<></>}
        >
            <span className="flex flex-wrap pt-4 justify-evenly">
                {   
                    renderItems?.map((i: any) => <ListItem onItemClick={props.onItemClick} listTitle={title} title={i.title} image={i.image} key={i.title} />)
                }
            </span>
        </InfiniteScroll>
    );
});