import React, { useEffect, useState } from 'react';
import { cloneDeep, isEmpty, get } from 'utils/jsUtility';
import gClasses from 'scss/Typography.module.scss';
import { getModifiedRequestBody } from 'containers/integration/add_integration/events/add_event/request_body/RequestBody.utils';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import NestedDropdown from '../../../../../../components/nested_dropdown/NestedDropdown';
import { getDataNotFound } from '../RowComponents.utils';
import { ROW_COMPONENT_STRINGS } from '../RowComponents.strings';

function ResponseBodyMapping(props) {
  const {
    currentRow,
    onChangeHandler,
    id,
    path,
    errorMessage,
    isChildMapping,
    additionalRowComponentProps,
  } = props;

  const {
    responseBody,
    keyObject: { key, keyType },
  } = additionalRowComponentProps;

  const { RESPONSE_BODY } = ROW_COMPONENT_STRINGS();

  const [responseKeyOptionList, setResponseKeyOptionList] = useState([]);
  const [filteredResponseKeyOptionList, setFilteredResponseKeyOptionList] =
    useState([]);
  const [keySearchValue, setKeySearchValue] = useState([]);
  const [backButtonDetails, setBackButtonDetails] = useState({});

  const getResponseBodyMapping = (
    responseBodyParam = [],
    parentObject = {},
  ) => {
    const responseBody = cloneDeep(responseBodyParam);

    return responseBody?.map((eachResponseRow) => {
      const currentValue = isEmpty(parentObject)
        ? eachResponseRow?.label
        : `${parentObject?.value}.${eachResponseRow?.label}`;
      const rowObject = {
        ...eachResponseRow,
        value: currentValue,
        parent_label: parentObject?.label,
      };

      if (rowObject?.child_rows?.length) {
        rowObject.is_expand = true;
        rowObject.expand_count = rowObject?.child_rows?.length;
        rowObject.child_rows = getResponseBodyMapping(
          rowObject?.child_rows,
          rowObject,
        );
      }

      return rowObject;
    });
  };

  useEffect(() => {
    const modifiedResponseBody = getModifiedRequestBody(responseBody);
    setResponseKeyOptionList(getResponseBodyMapping(modifiedResponseBody));
  }, []);

  const dropdownClearHandler = () => {
    const modifiedResponseBody = getModifiedRequestBody(responseBody);
    setResponseKeyOptionList(getResponseBodyMapping(modifiedResponseBody));
    setBackButtonDetails({});
    setKeySearchValue(EMPTY_STRING);
  };

  const expandButtonClick = (e, option) => {
    e?.stopPropagation();
    const list = backButtonDetails.list || [];
    setBackButtonDetails({
      label: option?.label,
      list: [...list, responseKeyOptionList],
    });
    setResponseKeyOptionList(option?.child_rows);
    setKeySearchValue(EMPTY_STRING);
  };

  const onOptionClickHandler = (option, callback) => {
    if (isChildMapping && option?.is_expand) {
      expandButtonClick(null, option);
    } else {
      onChangeHandler(option);

      if (callback) callback();
      setKeySearchValue(EMPTY_STRING);
    }
  };

  const onBackBtnClick = () => {
    const { list = [] } = cloneDeep(backButtonDetails);
    const listLength = list?.length;

    if (!listLength) return;

    if (listLength === 1) {
      setResponseKeyOptionList(list[0]);
      setBackButtonDetails({});
    } else {
      const prevList = cloneDeep(list[listLength - 1]);
      setResponseKeyOptionList(prevList);
      const parentLabel = get(prevList, [0, 'parent_label'], EMPTY_STRING);
      setBackButtonDetails({
        label: parentLabel,
        list: list?.slice(0, listLength - 1),
      });
    }
    setKeySearchValue(EMPTY_STRING);
  };

  const handleSearchChange = (event) => {
    const {
      target: { value = EMPTY_STRING },
    } = event;

    if (!isEmpty(responseKeyOptionList)) {
      const filteredList = responseKeyOptionList?.filter((field) => {
        const loweredLabel = field?.label?.toLowerCase();
        const loweredValue = value?.toLowerCase();
        return loweredLabel?.includes(loweredValue);
      });

      if (isEmpty(filteredList)) {
        setFilteredResponseKeyOptionList(getDataNotFound());
      } else {
        setFilteredResponseKeyOptionList(filteredList);
      }
    }

    setKeySearchValue(value);
  };

  const keySelectedOption = {
    label: currentRow?.[key],
    value: currentRow?.[key],
    type: currentRow?.[keyType],
  };

  return (
    <div>
      <NestedDropdown
        id={id}
        placeholder={RESPONSE_BODY.PLACEHOLDER}
        searchBarPlaceholder={RESPONSE_BODY.SEARCH_PLACEHOLDER}
        optionList={
          !isEmpty(keySearchValue)
            ? filteredResponseKeyOptionList
            : responseKeyOptionList
        }
        selectedOption={keySelectedOption}
        isExactPopperWidth
        searchValue={keySearchValue}
        outerClassName={gClasses.MR16}
        onBackBtnClick={onBackBtnClick}
        backButtonDetails={backButtonDetails}
        dropdownClearHandler={dropdownClearHandler}
        onChange={(_, option, callback) =>
          onOptionClickHandler(option, callback)
        }
        expandButtonClick={(e, option) => expandButtonClick(e, option)}
        handleSearchChange={(e) => handleSearchChange(e)}
        errorMessage={errorMessage}
        hideMessage={!errorMessage}
        mappingIndex={path}
        valueKey="value"
        enableSearch
      />
    </div>
  );
}

export default ResponseBodyMapping;
