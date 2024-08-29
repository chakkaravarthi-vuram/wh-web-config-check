  export const removeModifiedFlag = (modifiedData) =>
  modifiedData?.map((data) => {
    delete data?.isModified;
    return data;
  }) || [];
