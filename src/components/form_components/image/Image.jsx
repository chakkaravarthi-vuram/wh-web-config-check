import React, { useState } from 'react';
import propTypes from 'prop-types';
import cx from 'classnames/bind';
import { BS } from '../../../utils/UIConstants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function Image(props) {
  const [isImageRendered, setImageStatus] = useState(false);
  const imageLoadHandler = () => {
    setImageStatus(true);
  };
  const { id, src, key, alt, onClick, style, className, testId, title, ariaHidden } = props;
  return (
    <img
      id={id}
      src={src}
      key={key}
      onLoad={imageLoadHandler}
      className={cx(
        className,
        { [BS.VISIBLE]: !!isImageRendered },
        { [BS.INVISIBLE]: !isImageRendered },
      )}
      alt={alt}
      onClick={onClick}
      style={style}
      role="presentation"
      data-test={testId}
      title={title}
      aria-hidden={ariaHidden}
    />
  );
}

export default Image;
// if (props.getImageStatus) {
//   props.getImageStatus(true);
// }
// if (props.imageLoadHandler) {
//   props.imageLoadHandler(false);
// }
Image.defaultProps = {
  id: EMPTY_STRING,
  alt: EMPTY_STRING,
  className: EMPTY_STRING,
  onClick: null,
  style: {},
  src: EMPTY_STRING,
  testId: EMPTY_STRING,
  title: null,
};

Image.propTypes = {
  id: propTypes.string,
  alt: propTypes.string,
  src: propTypes.string,
  className: propTypes.string,
  style: propTypes.shape({
    position: propTypes.string,
  }),
  onClick: propTypes.func,
  testId: propTypes.string,
  title: propTypes.string,
};
