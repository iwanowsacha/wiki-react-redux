export interface DirectoriesList {
    [key: string]: Array<string>
}

export interface List {
    title: string,
    items: Array<ListItem>,
    allTags: Array<string>,
    tagGroups: Array<TagGroup>
};

export interface ListItem {
    title: string,
    image: string,
    body: string,
    tags: Array<string>
};
  
export interface TagGroup {
    title: string,
    tags: Array<string>
};

export interface ListItemImageChanges {
    new: {
        [key: string]: string
    },
    rename: {
        [key: string]: string
    },
    delete: Array<string>
}