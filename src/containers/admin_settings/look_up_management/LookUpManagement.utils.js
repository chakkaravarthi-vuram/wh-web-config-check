export const getAddLookupPostData = (addLookupStateData) => {
  const postData = {};
  console.log('addNewLookup', addLookupStateData);
  const { lookup_name, lookup_type, lookup_value } = addLookupStateData;
  postData.lookup_name = lookup_name;
  postData.lookup_type = lookup_type;
  postData.lookup_value = lookup_value
    .filter(Boolean)
    .map((lu_value) => lu_value.trim());
  if (new Set(postData.lookup_value).size !== postData.lookup_value.length) {
    postData.lookup_value = [...new Set(postData.lookup_value)];
  }
  return postData;
};

export default getAddLookupPostData;
