export interface DirectoriesList {
  [key: string]: Array<string>;
}

export interface List {
  title: string;
  items: Array<ListItem>;
  allTags: Array<string>;
  tagGroups: Array<TagGroup>;
}

export interface ListItem {
  title: string;
  image: string;
  body: string;
  link: string;
  tags: Array<string>;
}

export interface TagGroup {
  title: string;
  tags: Array<string>;
}

export interface ListItemImageChanges {
  new: {
    [key: string]: string;
  };
  rename: {
    [key: string]: string;
  };
  delete: Array<string>;
}

export interface Article {
  title: string;
  image: string;
  introduction: string;
  sections: Array<ArticleSection>
}

export interface ArticleSection {
  title: string;
  body: string;
  subsections: Array<ArticleSection>
}