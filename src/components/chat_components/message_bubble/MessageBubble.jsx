import React from 'react';
import cx from 'classnames/bind';
import urlRegex from 'url-regex-safe';
import gClasses from 'scss/Typography.module.scss';
import UserImage from 'components/user_image/UserImage';
import { getFullName } from 'utils/generatorUtils';
import { isValidEmail } from 'utils/UtilityFunctions';
import styles from './MessageBubble.module.scss';

const isValidUrl = (urlString) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

function TextValue({ text }) {
  const regex = new RegExp(urlRegex({ strict: false, exact: false }).source, 'ig');
  const results = text.match(regex);
  if (!results) return text;
  return (
    <span>
      {
        results.map((result) => {
          const data = text.split(result);
          let link = result;
          let isLink = true;
          if (result) {
            if (
              (result.match(new RegExp(urlRegex({ strict: true, exact: true }).source)) && !isValidUrl(result)) ||
              (!result.match(new RegExp(urlRegex({ strict: true, exact: true }).source)))
            ) {
              link = `http://${result}`;
            }
          }
          if (result && isValidEmail(result)) isLink = false;
          return (
            <>
              <span>{data[0]}</span>
              {
                isLink ? (
                  <a href={link} target="_blank" rel="noreferrer">{result}</a>
                ) : (
                  <span>{result}</span>
                )
              }
              <span>{data[1]}</span>
            </>
          );
        })
      }
    </span>
  );
}

function MessageBubble(props) {
  const {
    displayOnlyMessage,
    first_name,
    last_name,
    text,
    time,
    profilePic,
  } = props;

  const fullName = getFullName(first_name, last_name);
  return (
    <>
      {!displayOnlyMessage && (
        <div className={cx(gClasses.CenterV, gClasses.MB5, gClasses.PT5)}>
          <UserImage
            className={styles.UserImage}
            firstName={first_name}
            lastName={last_name}
            src={profilePic}
          />
          <div className={cx(gClasses.ML5, gClasses.OverflowHidden)}>
            <div className={cx(gClasses.FTwo12GrayV3, gClasses.FontWeight600, gClasses.Ellipsis)} title={fullName}>
              {fullName}
            </div>
            <div className={cx(gClasses.FTwo10GrayV53)}>{time}</div>
          </div>
        </div>
      )}
      <div
        className={cx(
          gClasses.FTwo12GrayV3,
          gClasses.FontWeight500,
          gClasses.MB5,
          gClasses.ML32,
          gClasses.WordBreakBreakWord,
          styles.wrapText,
        )}
      >
        <TextValue text={text} />
      </div>
    </>
  );
}

export default MessageBubble;
