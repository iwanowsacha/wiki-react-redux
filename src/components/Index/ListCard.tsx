import React from 'react';
import { useDispatch } from 'react-redux';
import { loadList } from '../../utils/loaders';

type ListCardProps = {
  title: string;
};

export default function ListCard(props: ListCardProps) {
  const { title } = props;
  const dispatch = useDispatch();

  const handleOpenList = () =>
    dispatch(loadList(title));

  return (
    <li>
      <button
        onClick={handleOpenList}
        className="m-4 uppercase text-primary whitespace-no-wrap truncate hover:text-hover text-base"
      >
        {title}
      </button>
    </li>
  );
}
