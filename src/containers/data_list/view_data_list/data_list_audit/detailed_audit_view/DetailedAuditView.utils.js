export const constructDeletedRow = (auditData, activeForm) => {
  const tempArray = [];
  if (auditData.action === 'create') {
    return;
  }
  Object.keys(auditData).forEach((key) => {
    if ('table_name' in auditData[key]) {
      const tableUuid = key;
      const tableData = auditData[tableUuid].table_data;
      tableData.forEach((eachRow) => {
        if ('row_index' in eachRow) {
          tempArray.push({ tabelUuid: key, rowIndex: eachRow.row_index });
        }
        return null;
      });
    }
    return null;
  });
  tempArray.forEach((data) => {
    activeForm[data.tabelUuid].splice(data.rowIndex, {});
    return null;
  });
};
