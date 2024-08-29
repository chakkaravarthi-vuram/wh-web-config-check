export const getBasicDetailsSelector = ({ EditFlowReducer }) => {
    const {
        error_list = {},
        flow_name,
        flow_description,
        flow_color,
        initiators,
      } = EditFlowReducer.flowData;
      return {
        flowData: {
          error_list: {
              flow_name: error_list.flow_name,
              flow_description: error_list.flow_description,
              flow_color: error_list.flow_color,
          },
          flow_name,
          flow_description,
          flow_color,
          initiators,
        },
        editFlowInitialLoading: EditFlowReducer.editFlowInitialLoading,
        server_error: EditFlowReducer.server_error,
      };
};
