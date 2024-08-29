import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import jsUtility from '../../../../../utils/jsUtility';
import SelectedColumnCard from './SelectedColumnCard';
import styles from '../ConfigPanel.module.scss';

function SelectedColumns(props) {
  const {
    selectedColumn,
    setSelectedColumn,
    setEditModelIndex,
    sorting,
    setSorting,
    onSave,
  } = props;

  const findField = useCallback(
    (field) => {
      const card = selectedColumn.find((data) => `${data.field}` === field);
      return {
        card,
        index: selectedColumn.indexOf(card),
      };
    },
    [selectedColumn],
  );

  const moveField = useCallback(
    (field, atIndex, isCallSave = false) => {
      const { card, index } = findField(field);
      const cloneCategory = jsUtility.cloneDeep(selectedColumn);
      cloneCategory.splice(index, 1);
      cloneCategory.splice(atIndex, 0, card);
      setSelectedColumn(cloneCategory);
      if (isCallSave) {
        onSave({ cloneCategory: cloneCategory });
        setSelectedColumn(selectedColumn);
      }
    },
    [findField, selectedColumn, setSelectedColumn],
  );

  const onEditSelectedColumn = (field) => {
    const { index } = findField(field);
    if (index > -1) {
      setEditModelIndex(index);
    }
  };

  const onRemoveSelectedColumn = (field) => {
    const { card, index } = findField(field);
    if (index > -1) {
      const cloneCategory = jsUtility.cloneDeep(selectedColumn);
      cloneCategory.splice(index, 1);
      setSelectedColumn(cloneCategory);
      const cloneSorting = jsUtility.cloneDeep(sorting);
      if (card.field === cloneSorting.field) {
        cloneSorting.field = '';
        setSorting(cloneSorting);
      }
      onSave({ columnList: cloneCategory, sorting: cloneSorting });
    }
  };

  return (
    <ul className={styles.SelectedColumn}>
      {selectedColumn.map((data) => (
        <SelectedColumnCard
          key={data.field}
          data={data}
          findField={findField}
          moveField={moveField}
          onEdit={onEditSelectedColumn}
          onRemove={onRemoveSelectedColumn}
        />
      ))}
    </ul>
  );
}

SelectedColumns.propTypes = {
  selectedColumn: PropTypes.arrayOf(PropTypes.object),
  setSelectedColumn: PropTypes.func,
  setEditModelIndex: PropTypes.func,
  sorting: PropTypes.object,
  setSorting: PropTypes.func,
  onSave: PropTypes.func,
};

export default SelectedColumns;
