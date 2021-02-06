import React, { SyntheticEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIsEditing } from "../../general/generalSlice";
import { selectAllGroups, updateGroup, updateManyGroups } from "./groupsSlice";
import { Droppable } from "../../../components/Droppable";
import { TagGroup } from "./TagGroup";
import { TagPill } from "../../../features/list/tags/TagPill";
// import { getAllTags } from "../items/itemsSlice";

type TagGroupListProps = {
    onTagClick(title: string): void,
}

export function TagGroupList(props: TagGroupListProps) {
    const tagGroups = useSelector(selectAllGroups);
    const isEditing = useSelector(getIsEditing);
    // const allTags = useSelector(getAllTags);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     console.log('effect');
    //     const updatableGroups: Array<any> = [];
    //     tagGroups.forEach((tg) => {
    //         tg.tags.forEach((t: string) => {
    //             const updatableTags: Array<string> = [];
    //             if (!allTags.includes(t)) {
    //                 updatableTags.push(t);
    //             }
    //             if (updatableTags) updatableGroups.push({id: tg.title, tags: [...tg.tags.filter((t: string) => !updatableTags.includes(t))]})
    //         })
    //     });
    //     if (updatableGroups) dispatch(updateManyGroups(updatableGroups));
    // }, [allTags]);


    const handleTagGroupDrop = (e: SyntheticEvent, zoneId: string) => {
        const tag = e.dataTransfer.getData('tag');
        const dropGroup = tagGroups.find((t) => t.title == zoneId);
        if (!tag || dropGroup.tags.includes(tag)) return;
        updateTagGroup(dropGroup, tag);
    }

    const updateTagGroup = (dropGroup: any, tag: string) => {
        const group = tagGroups.find((tg) => tg.tags.includes(tag));
        const updatableTargetGroup = {
            id: dropGroup.title,
            changes: {
                tags: [...dropGroup.tags, tag]
            }
        }
        if (group) {
            const updateGroups: any = [{
                id: group.title,
                changes: {
                    tags: [...group.tags.filter((t: string) => t !== tag)]
                }
            }, updatableTargetGroup];
            dispatch(updateManyGroups(updateGroups));
        } else {
            dispatch(updateGroup(updatableTargetGroup));
        }
    }

    return(
        <>
            {tagGroups.length > 0 &&
                <div className="my-6 mx-2 col-span-2 overflow-y-auto filterGroup-wrapper sticky top-0">
                    <div>
                        {isEditing
                            ? tagGroups.map((g) => (
                                    <Droppable key={g.title} droppableId={g.title} onDrop={handleTagGroupDrop}>
                                        <TagGroup title={g.title}>
                                            {g.tags.map((t: string) => <TagPill isDraggable={true} onTagClick={props.onTagClick} key={t} title={t} />)}
                                        </TagGroup>
                                    </Droppable>
                                ))
                            : tagGroups.map((g) => (
                                    <TagGroup key={g.title} title={g.title}>
                                            {g.tags.map((t: string) => <TagPill isDraggable={true} onTagClick={props.onTagClick} key={t} title={t} />)}
                                    </TagGroup>
                                ))
                        }
                    </div>
                </div>
            }
        </>
    );
}