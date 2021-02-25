import { basename } from 'path';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilePickerButton from '../../components/FilePickerButton';
import { getArticleImage, setArticleImage } from './articleSlice';

type ArticleImageProps = {
  title: string;
  isArticleEditing: boolean;
};

export default function ArticleImage(props: ArticleImageProps) {
  const { title, isArticleEditing } = props;
  const dispatch = useDispatch();
  const image = useSelector(getArticleImage);
  const selectedImage =
    basename(image) === image ? `../src/articles/${title}/${image}` : image;

  const handleImageChange = (path: string) => {
    dispatch(setArticleImage(path));
  };

  return (
    <>
      <img
        src={selectedImage}
        alt=""
        className="rounded mx-auto"
        style={{ maxWidth: 300, height: 'auto' }}
      />
      {isArticleEditing && (
        <FilePickerButton fileTypes="img/*" onFileChange={handleImageChange}>
          <button className="rounded mt-2 w-full p-2 text-primary bg-secondary">
            BROWSE IMAGE
          </button>
        </FilePickerButton>
      )}
    </>
  );
}
