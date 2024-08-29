import React, { useState } from 'react';
import cx from 'classnames/bind';
import { BorderRadiusVariant, ETextSize, Size, Text, TextInput, Variant } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import styles from './FormFieldsList.module.scss';
import { BS } from '../../../../utils/UIConstants';
import gClasses from '../../../../scss/Typography.module.scss';
import { FORM_FIELD_LIST_STRINGS } from './FormFieldsList.strings';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { isEmpty } from '../../../../utils/jsUtility';
import NoSearchDataFoundIcon from '../../../../assets/icons/NoSearchDataFoundIcon';
import DraggableFieldIcon from './draggable_field_icon/DraggableFieldIcon';
import { FORM_TYPE } from '../../Form.string';

function FormFieldsList() {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState(EMPTY_STRING);
    const [fieldList, setFieldList] = useState(FORM_FIELD_LIST_STRINGS(t).FIELD_LIST);

    const searchFieldList = (searchValue) => {
      if (searchValue) {
        const searchedFieldList = {};
        setSearchText(searchValue);
        Object.keys(FORM_FIELD_LIST_STRINGS(t).FIELD_LIST).forEach((category) => {
          if (category?.toLowerCase().includes(searchValue.toLowerCase())) {
            searchedFieldList[category] = FORM_FIELD_LIST_STRINGS(t).FIELD_LIST[category];
          } else {
            FORM_FIELD_LIST_STRINGS(t).FIELD_LIST[category]?.forEach((field) => {
              console.log('searchedFieldList forEach',
                field,
                searchValue,
                searchedFieldList,
                category,
                field?.elementName?.toLowerCase().includes(searchValue.toLowerCase()),
                field?.elementDesc?.toLowerCase().includes(searchValue.toLowerCase()),
                field?.type?.toLowerCase().includes(searchValue.toLowerCase()));
              if (
                  field?.elementName?.toLowerCase().includes(searchValue.toLowerCase()) ||
                  field?.elementDesc?.toLowerCase().includes(searchValue.toLowerCase()) ||
                  field?.type?.toLowerCase().includes(searchValue.toLowerCase())
                ) {
                  console.log('searchedFieldList after', searchedFieldList, category);
                if (!isEmpty(searchedFieldList?.[category])) {
                  searchedFieldList?.[category]?.push(field);
                } else {
                  searchedFieldList[category] = [field];
                }
              }
            });
          }
        });
        console.log('searchedFieldList final', searchedFieldList);
        setFieldList(searchedFieldList);
      } else {
        setSearchText(EMPTY_STRING);
        setFieldList(FORM_FIELD_LIST_STRINGS(t).FIELD_LIST);
      }
    };

    return (
        <div className={cx(styles.ComponentDnd)}>
                <TextInput
                  id={FORM_FIELD_LIST_STRINGS(t).SEARCH.ID}
                  className={cx(gClasses.MX24, styles.SearchField)}
                  size={Size.lg}
                  value={searchText}
                  isLoading={false}
                  placeholder={FORM_FIELD_LIST_STRINGS(t).SEARCH.PLACEHOLDER}
                  onChange={(e) => {
                    searchFieldList(e?.target?.value);
                  }}
                  variant={Variant.border}
                  borderRadiusType={BorderRadiusVariant.rounded}
                />
              <div
                className={cx(styles.ElementGrid, BS.FLEX_COLUMN, gClasses.MT16)}
              >
                {Object?.keys(fieldList)?.map((category, index) => (
                  <div className={index !== 0 && gClasses.MT16} key={category}>
                    <Text
                      content={category}
                      size={ETextSize.XS}
                      className={cx(gClasses.FTwo12GrayV86, gClasses.FontWeight500)}
                    />
                    <div className={cx(gClasses.DisplayFlex, styles.FieldIcons, gClasses.MT8)}>
                      {fieldList?.[category]?.map((field) => (
                        <DraggableFieldIcon
                          field={field}
                          formType={FORM_TYPE.CREATION_FORM}
                        />
                    ))}
                    </div>
                  </div>
                ))}
                {isEmpty(fieldList) && (
                  <div className={cx(gClasses.CenterV, gClasses.FlexDirectionColumn, gClasses.H100)}>
                    <div>
                      <NoSearchDataFoundIcon />
                      <Text
                        size={ETextSize.SM}
                        className={gClasses.MT24}
                        content={FORM_FIELD_LIST_STRINGS(t).SEARCH.NO_FIELDS_ON_SEARCH}
                        fontClass={cx(gClasses.FontWeight500, gClasses.BlackV12)}
                      />
                      <Text
                        size={ETextSize.XS}
                        className={gClasses.MT16}
                        fontClass={gClasses.FTwo12BlackV21}
                        content={FORM_FIELD_LIST_STRINGS(t).SEARCH.TRY_SEARCHING}
                      />
                    </div>
                  </div>
                )}
              </div>
        </div>
    );
}

export default FormFieldsList;
