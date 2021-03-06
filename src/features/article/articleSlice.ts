import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article, ArticleQuickFact, ArticleSection } from '../../types';
import { loadArticle, loadList } from '../../utils/loaders';
import { setDocumentTypeIndex } from '../general/generalSlice';

function findSection(
  state,
  parent: string,
  returnParent = false
): ArticleSection {
  const parents = parent.split('---');
  let section = state.sections.find(
    (s: ArticleSection) => s.title === parents[0]
  );
  const index = returnParent ? parents.length - 1 : parents.length;
  if (index === 0 && returnParent) return state;
  for (let i = 1; i < index; i++) {
    section = section.sections.find(
      (s: ArticleSection) => s.title === parents[i]
    );
  }
  return section;
}

interface InitialState extends Article {
  openEditors: number;
}

const initialState: InitialState = {
  title: '',
  introduction: '',
  image: '',
  sections: [],
  quickFacts: [],
  openEditors: 0,
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
    saveArticleIntroduction: (state, action: PayloadAction<string>) => {
      state.introduction = action.payload;
    },
    addSection: (state, action: PayloadAction<string>) => {
      if (!action.payload) {
        state.sections.push({ title: '', body: '', sections: [] });
      } else {
        const section = findSection(state, action.payload);
        section.sections.push({ title: '', body: '', sections: [] });
      }
      state.openEditors += 1;
    },
    saveSection: (
      state,
      action: PayloadAction<{ parent: string; newTitle: string; body: string }>
    ) => {
      const { newTitle, body, parent } = action.payload;
      const section = findSection(state, parent);
      section.title = newTitle;
      section.body = body;
      state.openEditors -= 1;
    },
    deleteSection: (
      state,
      action: PayloadAction<{ parent: string; title: string }>
    ) => {
      const { parent, title } = action.payload;
      const section = findSection(state, parent, true);
      section.sections = section.sections.filter((s) => s.title !== title);
    },
    moveSection: (
      state,
      action: PayloadAction<{
        parent: string;
        title: string;
        direction: string;
      }>
    ) => {
      const { parent, title, direction } = action.payload;
      const section = findSection(state, parent === title ? '' : parent, true);
      const index = section.sections.findIndex((s) => s.title === title);
      const dirIndex = direction === 'up' ? -1 : 1;
      if (
        (index <= 0 && dirIndex === -1) ||
        (index === section.sections.length - 1 && dirIndex === 1)
      )
        return;
      [section.sections[index + dirIndex], section.sections[index]] = [
        section.sections[index],
        section.sections[index + dirIndex],
      ];
    },
    addQuickFact: (state) => {
      state.quickFacts.push({ title: '', body: '' });
      state.openEditors += 1;
    },
    saveQuickFact: (
      state,
      action: PayloadAction<{ oldTitle: string; quickFact: ArticleQuickFact }>
    ) => {
      const { oldTitle, quickFact } = action.payload;
      const fact = state.quickFacts.find((f) => f.title === oldTitle);
      if (!fact) return;
      fact.title = quickFact.title;
      fact.body = quickFact.body;
      state.openEditors -= 1;
    },
    deleteQuickFact: (state, action: PayloadAction<string>) => {
      const fact = state.quickFacts.find((f) => f.title === action.payload);
      if (!fact) return;
      state.quickFacts = state.quickFacts.filter(
        (f) => f.title !== action.payload
      );
    },
    moveQuickFact: (
      state,
      action: PayloadAction<{ direction: string; title: string }>
    ) => {
      const { title, direction } = action.payload;
      const index = state.quickFacts.findIndex((f) => f.title === title);
      const dirIndex = direction === 'up' ? -1 : 1;
      if (
        (index <= 0 && dirIndex === -1) ||
        (index === state.quickFacts.length - 1 && dirIndex === 1)
      )
        return;
      [state.quickFacts[index + dirIndex], state.quickFacts[index]] = [
        state.quickFacts[index],
        state.quickFacts[index + dirIndex],
      ];
    },
    incrementOpenEditors: (state) => {
      state.openEditors += 1;
    },
    decrementOpenEditors: (state) => {
      state.openEditors -= 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loadArticle.fulfilled,
      (state, action: PayloadAction<Article | null>) => {
        state.title = action.payload?.title || '';
        state.introduction = action.payload?.introduction || '';
        state.image = action.payload?.image || '';
        state.sections = [];
        state.quickFacts = [];
        Object.assign(state.sections, action.payload?.sections || []);
        Object.assign(state.quickFacts, action.payload?.quickFacts || []);
        state.openEditors = action.payload?.title ? 0 : 1;
      }
    )
    .addCase(loadList.fulfilled, (state) => { state = initialState })
    .addCase(setDocumentTypeIndex, (state) => { state = initialState });
  },
});

export const {
  setArticleTitle,
  setArticleImage,
  saveArticleIntroduction,
  addSection,
  saveSection,
  deleteSection,
  moveSection,
  addQuickFact,
  saveQuickFact,
  deleteQuickFact,
  moveQuickFact,
  incrementOpenEditors,
  decrementOpenEditors,
} = slice.actions;

export default slice.reducer;

export const getArticleTitle = (state) => state.article.title;
export const getArticleIntroduction = (state) => state.article.introduction;
export const getArticleImage = (state) => state.article.image;
export const getArticleSections = (state) => state.article.sections;
export const getArticleQuickFacts = (state) => state.article.quickFacts;
export const getOpenEditorsTotal = (state) => state.article.openEditors;
export const getArticle = (state) => state.article;
