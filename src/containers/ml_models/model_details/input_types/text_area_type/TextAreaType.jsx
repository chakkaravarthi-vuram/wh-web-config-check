import React from 'react';
import { TextArea, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { ML_MODEL_STRINGS } from '../../../MLModels.strings';

function TextAreaComponent(props) {
    const { component_name, component_value, isTryIt, requestBody, onInputChange, isRequired, errorBody, component } = props;
    const { t } = useTranslation();
    const { PLACE_HOLDERS } = ML_MODEL_STRINGS(t).MODEL_DETAILS;
    const inputValue = isTryIt ? requestBody?.text || '' : component_value;
    const errorMessage = isTryIt ? errorBody && errorBody?.errorList?.[component?.key] : '';

    return (
        <div>
            <TextArea
                labelText={component_name}
                size={ETextSize.LG}
                value={inputValue}
                onChange={(event) => {
                    onInputChange(event.target.value, component);
                }}
                required={isRequired}
                errorMessage={errorMessage}
                placeholder={PLACE_HOLDERS.TYPE_YOUR_TEXT_HERE}
            />
        </div>
    );
}

export default TextAreaComponent;
