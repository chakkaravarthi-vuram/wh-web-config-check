import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FIELD_LIST_TYPE, INITIAL_PAGE, MAX_PAGINATION_SIZE, MULTIPLE_RULE_CONDTION_ALLOWED_FIELDS } from 'utils/constants/form.constant';
import jsUtils from 'utils/jsUtility';
import { externalFieldsClear } from '../redux/actions/Visibility.Action';

function useRuleCondition(props) {
  const {
    onGetAllFieldsByFilter,
    moduleProps = {},
    l_field,
    externalFieldsDropdownData,
    expectedFieldPagination = {},
  } = props;
  const dispatch = useDispatch();

  const pagination_data = jsUtils.get(externalFieldsDropdownData, ['pagination_data'], []);
  const externalFieldsPaginationDetails = jsUtils.get(externalFieldsDropdownData, ['pagination_details', 0], {});

  const [selectedFieldUUID, setSelectedFieldUUID] = useState(l_field || '');

  useEffect(() => {
    if (selectedFieldUUID !== l_field) {
      setSelectedFieldUUID(l_field);
    }
    return () => dispatch(externalFieldsClear());
  }, [l_field]);

  const getAllFieldsByFilterApi = (isPaginated = false, isSearch = false, searchText = '', page_ = null, callback = null) => {
    const paginationData = {
      // search: '',
      page: (
        page_ || (jsUtils.nullCheck(externalFieldsPaginationDetails, 'page') && isPaginated
          ? externalFieldsPaginationDetails.page + 1
          : INITIAL_PAGE)),
      size: MAX_PAGINATION_SIZE,
      // sort_field: '',
      sort_by: 1,
      ...moduleProps,
      field_list_type: FIELD_LIST_TYPE.DIRECT,
      allowed_field_types: MULTIPLE_RULE_CONDTION_ALLOWED_FIELDS,
      include_property_picker: 1,
      ...expectedFieldPagination,
    };
    if (isSearch && searchText) {
      paginationData.search = searchText;
    }
    if (onGetAllFieldsByFilter) {
      onGetAllFieldsByFilter(
        paginationData,
        undefined,
        undefined,
        undefined,
        undefined,
        callback,
        );
    }
  };

  const onLoadMoreCallHandler = () => {
    console.log('df234234dsfsdf32', externalFieldsPaginationDetails, pagination_data.length);
    if (externalFieldsPaginationDetails && externalFieldsPaginationDetails && pagination_data) {
      if (externalFieldsPaginationDetails.total_count > pagination_data.length) {
        // const page = jsUtils.get(externalFieldsPaginationDetails, ['page'], 0) + 1;
        getAllFieldsByFilterApi(true);
      }
    }
  };

  const onSearchHandler = (searchText, page) => {
    let isSearch = true;
    if (!searchText) isSearch = false;
    getAllFieldsByFilterApi(true, isSearch, searchText, page || INITIAL_PAGE);
  };

  return {
    onLoadMoreCallHandler,
    getAllFieldsByFilterApi,
    onSearchHandler,
  };
}

export default useRuleCondition;
