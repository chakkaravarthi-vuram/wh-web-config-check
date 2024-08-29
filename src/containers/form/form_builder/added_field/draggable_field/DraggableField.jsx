import React from 'react';
import { useDrag } from 'react-dnd';
import { Text } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { FORM_LAYOUT_TYPE } from '../../../Form.string';
import { RESPONSE_FIELD_KEYS } from '../../../../../utils/constants/form/form.constant';
import styles from '../AddedField.module.scss';
import ThreeDotsGridIcon from '../../../../../assets/icons/page_components/ThreeDotsGridIcon';
import { FIELD_TYPES } from '../../../sections/field_configuration/FieldConfiguration.strings';
import { HYPHEN } from '../../../../../utils/strings/CommonStrings';

function DraggableField(props) {
  const {
    fieldData,
    fieldData: { id, fieldType, fieldName },
    icon,
    fieldTypeName,
  } = props;
  const isTableField = fieldType === FIELD_TYPES.TABLE;

  const [, drag] = useDrag({
    type: isTableField
      ? FORM_LAYOUT_TYPE.EXISTING_TABLE
      : FORM_LAYOUT_TYPE.EXISTING_FIELD,
    canDrag: true,
    item: {
      type: FORM_LAYOUT_TYPE.EXISTING_FIELD,
      [RESPONSE_FIELD_KEYS.FIELD_TYPE]: fieldType,
      data: fieldData,
    },
  });

  const fieldDisplayName = `${fieldName || HYPHEN} (${fieldTypeName})`;

  return (
    <div
      ref={(node) => drag(node)}
      key={id}
      id={id}
      className={styles.FieldsData}
    >
      <div className={styles.IconClass}>
        <ThreeDotsGridIcon />
        {icon}
      </div>
      <Text
        content={fieldDisplayName}
        className={gClasses.Ellipsis}
        title={fieldDisplayName}
      />
    </div>
  );
}

export default DraggableField;
