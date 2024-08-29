import React from 'react';
import EditIconNew from 'assets/icons/form_fields/EditIconNew';
import { ARIA_ROLES, BS, INPUT_TYPES } from 'utils/UIConstants';
import { ICON_ARIA_LABELS } from 'utils/strings/CommonStrings';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import CloseIconNewSmall from 'assets/icons/CloseIconNewSmall';
import PasswordEyeOpen from 'assets/icons/PasswordEyeNew';
import gClasses from 'scss/Typography.module.scss';
import { TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './MaskedInput.module.scss';

function MaskedInput(props) {
    const { isEdit, value, toggleEdit, label, className, isRequired,
        id, onChangeHandler, errorMessage, enablePreview, isPreviewEnabled, hasSavedValue, readOnly, labelClassName } = props;
    const displayMasked = hasSavedValue && !isEdit;
        return (
        <div className={BS.D_FLEX}>
            <TextInput
                labelText={label}
                onChange={onChangeHandler}
                id={id}
                type={!displayMasked && !isPreviewEnabled ? INPUT_TYPES.PASSWORD : null}
                value={(displayMasked || readOnly) ? '********' : value}
                errorMessage={errorMessage}
                readOnly={displayMasked || readOnly}
                className={className}
                required={isRequired}
                labelClassName={labelClassName}
                suffixIcon={!(displayMasked || readOnly) && (
                    <PasswordEyeOpen
                        className={gClasses.CursorPointer}
                        tabIndex={0}
                        onClick={enablePreview}
                        onKeyPress={(e) => keydownOrKeypessEnterHandle(e) && enablePreview()}
                        role={ARIA_ROLES.SWITCH}
                        onEyeClick={isPreviewEnabled}
                    />
                )}
                // hide title to be added in ui library
            />
            {
                hasSavedValue && !readOnly && (
                    <div className={styles.IconContainer}>
                        {
                            isEdit ? (
                                <CloseIconNewSmall
                                    ariaLabel={ICON_ARIA_LABELS.CANCEL}
                                    tabIndex={0}
                                    role={ARIA_ROLES.BUTTON}
                                    onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && toggleEdit(false)}
                                    className={styles.CloseIcon}
                                    onClick={() => toggleEdit(false)}
                                />
                            ) : (
                                <EditIconNew
                                    ariaLabel={ICON_ARIA_LABELS.EDIT}
                                    tabIndex={0}
                                    role={ARIA_ROLES.BUTTON}
                                    onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && toggleEdit(true)}
                                    className={styles.EditIcon}
                                    onClick={() => toggleEdit(true)}
                                />
                            )
                        }
                    </div>
                )
            }
        </div>
    );
}

export default MaskedInput;
