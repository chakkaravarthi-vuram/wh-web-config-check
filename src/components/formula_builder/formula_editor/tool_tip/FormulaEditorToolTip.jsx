import { TOKENS } from 'components/formula_builder/formula_tokenizer_utils/constants';
import React from 'react';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { find, isEmpty } from '../../../../utils/jsUtility';
import styles from './FormulaEditorToolTip.module.scss';

function FormulaEditorToolTip(props) {
  const {
         attributes = {},
         lstFunction = [],
         functionDetails = {},
         } = props;

  const getErrorTooltip = () => {
        const { error = EMPTY_STRING } = attributes;
        if (error) {
            return <div className={styles.ErrorToolTip}>{error}</div>;
        }
        return null;
  };

  const getToolTipBasedOnTokenType = () => {
      const { type = EMPTY_STRING } = attributes;
      switch (type) {
          case TOKENS.KEYWORD:
            const fnId = attributes?.info;
            const fnDetail = (isEmpty(functionDetails)) ? find(lstFunction, (fn) => fn.name === fnId) : functionDetails;
            if (!isEmpty(fnDetail) && fnDetail !== -1) {
                return (
                    <div className={styles.FunctionTooltip}>
                        {getErrorTooltip()}
                        <div className={styles.Syntax}>
                            <div className={styles.Expression}>{fnDetail.expression}</div>
                            <div>{' => '}</div>
                            <div className={styles.ReturnType}>{fnDetail.output.type}</div>
                        </div>
                        <div className={styles.Definition}>{fnDetail.definition}</div>
                        <div>Example :</div>
                        <div className={styles.Example}>{fnDetail.example}</div>
                    </div>
                );
            }
            break;
          default:
              return getErrorTooltip();
      }
      return getErrorTooltip();
  };
  return getToolTipBasedOnTokenType();
}

export default FormulaEditorToolTip;
