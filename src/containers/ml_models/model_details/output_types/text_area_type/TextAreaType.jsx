import React from 'react';
import { TextArea, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import styles from '../../ModelDetails.module.scss';

function TextAreaComponent(props) {
const { component_name, component_value } = props;
const originalText = component_value
  .replace(/\\n/g, '\n') // Unescape new lines
  .replace(/\\t/g, '\t') // Unescape tabs
   .replace(/\\"/g, '"'); // Unescape double quotes
    return (
    <div>
        <TextArea
            labelText={component_name}
            size={ETextSize.LG}
            value={originalText}
            className={styles.TextClass}
        />
    </div>
    );
}

export default TextAreaComponent;
