function ConditionalWrapper({ condition, wrapper, children }) {
  return (
    condition ? wrapper(children) : children);
}
export default ConditionalWrapper;
ConditionalWrapper.defaultProps = {};
ConditionalWrapper.propTypes = {};
