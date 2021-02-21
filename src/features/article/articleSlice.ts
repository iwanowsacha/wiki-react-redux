import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article, ArticleSection } from '../../types';
import { loadArticle } from '../../utils/loaders';

function findSection(state, parent: string, returnParent: boolean = false): ArticleSection {
  const parents = parent.split('---');
  let section = state.sections.find((s: ArticleSection) => s.title === parents[0]);
  const index = returnParent ? parents.length -1 : parents.length;
  for (let i = 1; i < index; i++) {
    section = section.sections.find((s: ArticleSection) => s.title === parents[i]);
  }
  return section || state;
}

const initialState: Article = {
  title: '',
  introduction: '',
  image: '',
  sections: []
};

export const slice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    setArticleTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setArticleImage: (state, action: PayloadAction<string>) => {
      state.image = action.payload;
    },
    setArticleIntroduction: (state, action: PayloadAction<string>) => {
      state.introduction = action.payload;
    },
    addSection: (state, action: PayloadAction<string>) => {
      if (!action.payload) {
        state.sections.push({title: '', body:'', sections: []});
      } else {
        const section = findSection(state, action.payload);
        section.sections.push({title: '', body: '', sections: []});
      }
    },
    saveSection: (state, action: PayloadAction<{parent: string, newTitle: string, body: string}>) => {
      const { newTitle, body, parent } = action.payload;
      const section = findSection(state, parent);
      section.title = newTitle;
      section.body = body;
    },
    deleteSection: (state, action: PayloadAction<{parent: string, title: string}>) => {
      const { parent, title } = action.payload;
      const section = findSection(state, parent, true);
      section.sections = section.sections.filter((s) => s.title !== title);
    },
    moveSection: (state, action: PayloadAction<{parent: string, title: string, direction: string}>) => {
      const { parent, title, direction } = action.payload;
      const section = findSection(state, parent === title ? '' : parent, true);
      const index = section.sections.findIndex((s) => s.title === title );
      const dirIndex = direction === 'up' ? -1 : 1;
      if ((index <= 0 && dirIndex === -1) || (index === section.sections.length-1 && dirIndex === 1)) return;
      [section.sections[index+dirIndex], section.sections[index]] = [section.sections[index], section.sections[index+dirIndex]];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      loadArticle.fulfilled,
      (state, action: PayloadAction<{ document: Article | null }>) => {
        state.title = action.payload.document?.title || '';
        state.introduction = action.payload.document?.introduction || '';
        state.image = action.payload.document?.image || '';
        Object.assign(state.sections, action.payload.document?.sections);
      }
    );
  },
});

export const { setArticleTitle, setArticleImage, setArticleIntroduction, addSection, saveSection, deleteSection, moveSection } = slice.actions;

export default slice.reducer;

export const getArticleTitle = (state) => state.article.title;
export const getArticleIntroduction = (state) => state.article.introduction;
export const getArticleImage = (state) => state.article.image;
export const getArticleSections = (state) => state.article.sections;
