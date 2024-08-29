import React from 'react';
import cx from 'classnames/bind';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import { isEmpty } from 'utils/jsUtility';
import gClasses from 'scss/Typography.module.scss';
import styles from './TestBedConfirmationScreen.module.scss';
import { getDevRoutePath } from '../../../utils/UtilityFunctions';

export const CONTENT_TYPE = Object.freeze({
  FAQ: 1,
  POINTS: 2,
});

function TestBedConfirmationScreen(props) {
  let buttonsDiv = null;
  const { onGoBackClickHandler, primaryCtaClicked, strings, contentType } = props;
  const { CONTENT } = strings;
  const getQuestionare = () =>
    CONTENT.map((faq) => (
      <div className={styles.FaqDiv} key={faq.ID}>
        <h2 className={cx(gClasses.FontWeight600, styles.FaqQuestion)}>{faq.QUESTION}</h2>
        <p className={styles.FaqAnswer}>{faq.ANSWER}</p>
        {faq.ID === '2' && <div className={styles.FaqAnswer}>{faq.TRIGGER_INFO}</div>}
      </div>
    ));

  const getListedPoints = () =>
    CONTENT.map((data) => {
      let listOfPoints = null;
      if (!isEmpty(data.POINTS)) {
        listOfPoints = (
           <ul className={styles.ContentPoints}>
              {
                data.POINTS.map((text) => (
                <li
                  key={`${data.ID}-${text.ID}`}
                  className={cx(styles.FaqAnswer, gClasses.PB5)}
                >
                 {text.TEXT}
                </li>
              ))
             }
           </ul>
         );
      }
      const title = data.IS_DYNAMIC_LINK ? (
          <a href={getDevRoutePath(data.URI)} className={styles.Link}>
            <h2 className={cx(styles.FaqQuestion)}>{data.TITLE}</h2>
          </a>
      ) : <h2 className={cx(styles.FaqQuestion)}>{data.TITLE}</h2>;
      return (
        <div className={styles.FaqDiv} key={data.ID}>
          {title}
          {listOfPoints}
        </div>
      );
    });
  const getContent = () => {
    if (contentType === 1) {
      return getQuestionare();
    }
    return getListedPoints();
    };

  buttonsDiv = (
    <div>
      {(strings.BUTTON.SECONDARY) ? (
        <Button
          buttonType={BUTTON_TYPE.SECONDARY}
          onClick={onGoBackClickHandler}
          className={gClasses.MR30}
        >
          {strings.BUTTON.SECONDARY}
        </Button>
      ) : null}
      {(strings.BUTTON.PRIMARY) ? (
        <Button
        buttonType={BUTTON_TYPE.PRIMARY}
        onClick={primaryCtaClicked}
        >
        {strings.BUTTON.PRIMARY}
        </Button>
      ) : null}
    </div>
  );

  return (
    <div className={styles.ConfirmationDiv}>
      {getContent()}
      {buttonsDiv}
    </div>
  );
}

export default TestBedConfirmationScreen;
