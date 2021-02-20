import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { stringify } from 'postcss';
import { Article } from '../../types';
import { loadArticle } from '../../utils/loaders';

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
    addSection: (state) => {
      state.sections.push({title: '', body:'', subsections: []});
    },
    addSubsection: (state, action: PayloadAction<string>) => {
      const parents = action.payload.split('---');
      let section = state.sections.find((s) => s.title == parents[0]);
      for (let i = 1; i < parents.length; i++) {
        section = section?.subsections.find((s) => s.title == parents[i]);
      }
      if (!section) return;
      section.subsections.push({title: '', body: '', subsections: []});
    },
    saveSection: (state, action: PayloadAction<{title: string, newTitle: string, body: string}>) => {
      const { title, newTitle, body } = action.payload;
      const section = state.sections.find((s) => s.title === title);
      if (!section || (title !== newTitle && state.sections.find((s) => s.title === newTitle))) return;
      section.title = newTitle;
      section.body = body;
    },
    saveSubsection: (state, action: PayloadAction<{title: string, parent: string, newTitle: string, body: string}>) => {
      const { title, newTitle, body } = action.payload;
      const parents = action.payload.parent.split('---');
      let section = state.sections.find((s) => s.title == parents[0]);
      for (let i = 1; i < parents.length-1; i++) {
        section = section?.subsections.find((s) => s.title == parents[i]);
      }
      if (!section) return;
      const subsection = section.subsections.find((s) => s.title === title);
      if (!subsection) return;
      subsection.title = newTitle;
      subsection.body = body;
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

export const { setArticleTitle, setArticleImage, setArticleIntroduction, addSection, addSubsection, saveSection, saveSubsection } = slice.actions;

export default slice.reducer;

export const getArticleTitle = (state) => state.article.title;
export const getArticleIntroduction = (state) => state.article.introduction;
export const getArticleImage = (state) => state.article.image;
export const getArticleSections = (state) => state.article.sections;
