import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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

export const { setArticleTitle, setArticleImage } = slice.actions;

export default slice.reducer;

export const getArticleTitle = (state) => state.article.title;
export const getArticleIntroduction = (state) => state.article.introduction;
export const getArticleImage = (state) => state.article.image;
export const getArticleSections = (state) => state.article.sections;
