import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFilterType, setFilterType } from '../tags/tagsSlice';
import ModalContainer from '../../../components/ModalContainer';
import RadioButton from '../../../components/RadioButton';
import CustomTagFilter from './CustomTagFilter';

export default function FilterOptions() {
  const dispatch = useDispatch();
  const filterType = useSelector(getFilterType);

  const handleFilterTypeChange = (value: string) => {
    dispatch(setFilterType(value));
  };

  return (
    <ModalContainer className="border-2" title="Filter">
      <div id="filterRadio" className="p-2">
        <h1 className="mb-2 underline text-secondary">Filter options</h1>
        <RadioButton
          onChange={handleFilterTypeChange}
          group="options"
          title="Has one of selected"
          value="any"
          checked={filterType === 'any'}
        />
        <RadioButton
          onChange={handleFilterTypeChange}
          group="options"
          title="Has all selected"
          value="all"
          checked={filterType === 'all'}
        />
        <RadioButton
          onChange={handleFilterTypeChange}
          group="options"
          title="Has none of selected"
          value="none"
          checked={filterType === 'none'}
        />
        <RadioButton
          onChange={handleFilterTypeChange}
          group="options"
          title="Custom"
          value="custom"
          checked={filterType === 'custom'}
        />
      </div>
      {filterType === 'custom' && <CustomTagFilter />}
    </ModalContainer>
  );
}
