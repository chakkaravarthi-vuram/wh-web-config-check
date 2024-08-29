/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { MODULE_TYPES } from '../../utils/Constants';
import jsUtility from '../../utils/jsUtility';

export const getModuleIdByModuleType = (metaData, moduleType, stepRequired = true, isDesignElements = false) => {
  const { moduleId, stepId, dashboardId, pageId } = metaData;
  const data = {};

  if (moduleType === MODULE_TYPES.DATA_LIST) {
    data.data_list_id = moduleId;
  } else if (moduleType === MODULE_TYPES.FLOW) {
    data.flow_id = moduleId;
    if (stepRequired) data.step_id = stepId;
  } else if (moduleType === MODULE_TYPES.TASK) {
    data.task_metadata_id = moduleId;
  } else if (moduleType === MODULE_TYPES.SUMMARY) {
    if (isDesignElements) {
      if (!jsUtility.isEmpty(metaData.dataListId)) {
        data.data_list_id = metaData.dataListId;
      } else if (!jsUtility.isEmpty(metaData.flowId)) {
        data.flow_id = metaData.flowId;
      }
    } else {
    data.dashboard_id = dashboardId;
    data.page_id = pageId;
    if (!jsUtility.isEmpty(metaData.dataListId)) {
      data.data_list_id = metaData.dataListId;
    } else if (!jsUtility.isEmpty(metaData.flowId)) {
      data.flow_id = metaData.flowId;
    }
    }
  }

  return data;
};

export const flattenObj = (obj) => {
  const result = {};
  for (const i in obj) {
    if (typeof obj[i] === 'object' && !Array.isArray(obj[i])) {
      const temp = flattenObj(obj[i]);
      for (const j in temp) {
        result[j] = temp[j];
      }
    } else result[i] = obj[i];
  }
  console.log('flax', result);
  return result;
};

export const FORM_SAMPLE_DATA = {
  'd73e3e4e-7aa6-4a27-a5cc-3a8d9e7b2228': {
      fieldName: 'gfhfg',
      referenceName: 'gfhfg',
      fieldType: 'singleline',
      fieldUUID: 'd73e3e4e-7aa6-4a27-a5cc-3a8d9e7b2228',
      fieldListType: 'direct',
      isSave: false,
      required: false,
      readOnly: false,
      validations: {},
      isFieldShowWhenRule: false,
      fieldId: '65f67fe98458d4cdb04c4e3e',
      formCount: 2,
  },
  'a4b4cc15-0b65-4ce0-86ae-7e708f48ad1b': {
      fieldName: 'Number',
      referenceName: 'number',
      fieldType: 'number',
      fieldUUID: 'a4b4cc15-0b65-4ce0-86ae-7e708f48ad1b',
      fieldListType: 'direct',
      isDigitFormatted: true,
      isSave: false,
      required: false,
      readOnly: false,
      validations: {
          dontAllowZero: false,
          allowDecimal: false,
      },
      isFieldShowWhenRule: false,
      fieldId: '65f67fe98458d4cdb04c4e33',
      formCount: 2,
  },
  'a4b4cc15-0b65-4ce0-86ae-7e708f48ad1c': {
    fieldName: 'Number 001',
    referenceName: 'number',
    fieldType: 'number',
    fieldUUID: 'a4b4cc15-0b65-4ce0-86ae-7e708f48ad1c',
    fieldListType: 'direct',
    isDigitFormatted: true,
    isSave: false,
    required: false,
    readOnly: false,
    validations: {
        dontAllowZero: false,
        allowDecimal: false,
    },
    isFieldShowWhenRule: false,
    fieldId: '65f67fe98458d4cdb04c4e33',
    formCount: 2,
},
  '2c72211a-8063-4546-9143-3648af0545c0': {
      fieldName: 'Checkbox',
      referenceName: 'checkbox',
      fieldType: 'checkbox',
      fieldUUID: '2c72211a-8063-4546-9143-3648af0545c0',
      fieldListType: 'direct',
      choiceValues: [
          {
              label: 'A',
              value: 'A',
          },
          {
              label: 'S',
              value: 'S',
          },
          {
              label: 'D',
              value: 'D',
          },
      ],
      choiceValueTypes: 'text',
      isSave: false,
      required: false,
      readOnly: false,
      validations: {},
      isFieldShowWhenRule: false,
      fieldId: '65f67fe98458d4cdb04c4e3f',
      formCount: 2,
  },
  'e3ebb842-b548-47c9-a72e-f629417f190d': {
      fieldName: 'Dropdown',
      referenceName: 'dropdown',
      fieldType: 'dropdown',
      fieldUUID: 'e3ebb842-b548-47c9-a72e-f629417f190d',
      fieldListType: 'direct',
      choiceValues: [
          {
              label: 'AS',
              value: 'AS',
          },
          {
              label: 'DF',
              value: 'DF',
          },
          {
              label: 'ZX',
              value: 'ZX',
          },
      ],
      choiceValueTypes: 'text',
      isSave: false,
      required: false,
      readOnly: false,
      validations: {},
      isFieldShowWhenRule: false,
      fieldId: '65f67fe98458d4cdb04c4e40',
      formCount: 2,
  },
  '94840450-ee58-4f43-a3ee-021d69565347': {
      fieldName: 'Yes No',
      referenceName: 'yes_no',
      fieldType: 'yesorno',
      fieldUUID: '94840450-ee58-4f43-a3ee-021d69565347',
      fieldListType: 'direct',
      isSave: false,
      required: false,
      readOnly: false,
      validations: {},
      isFieldShowWhenRule: false,
      fieldId: '65f67fe98458d4cdb04c4e41',
      formCount: 2,
  },
  'b162d101-1f85-47c6-bc05-242032959b91': {
      fieldName: 'Single',
      referenceName: 'single_02',
      fieldType: 'singleline',
      fieldUUID: 'b162d101-1f85-47c6-bc05-242032959b91',
      tableUUID: 'd6f6e99b-6d86-416e-ad2c-6b617edf65ef',
      table_reference_name: 'table_03',
      fieldListType: 'table',
      isSave: false,
      required: false,
      readOnly: true,
      validations: {},
      isFieldShowWhenRule: false,
      hideFieldIfNull: false,
      width: 'auto',
      fieldId: '65f67fe98458d4cdb04c4e3d',
      formCount: 2,
  },
  'b9b5a152-b4db-4fae-8538-c25b73bc6d57': {
      fieldName: 'Radio',
      referenceName: 'radio_02',
      fieldType: 'radiobutton',
      fieldUUID: 'b9b5a152-b4db-4fae-8538-c25b73bc6d57',
      fieldListType: 'direct',
      choiceValues: [
          {
              label: 'qw',
              value: 'qw',
          },
          {
              label: 'we',
              value: 'we',
          },
          {
              label: 'er',
              value: 'er',
          },
      ],
      choiceValueTypes: 'text',
      isSave: false,
      required: false,
      readOnly: false,
      validations: {},
      isFieldShowWhenRule: false,
      fieldId: '65f67fe98458d4cdb04c4e3c',
      formCount: 2,
  },
};

export const FORM_DATA = [
  {
    section_name: 'Basic Details',
    section_order: 1,
    is_section_show_when_rule: false,
    no_of_columns: 4,
    section_uuid: '5ca62473-9ebc-41b6-9144-7bf818a878ae',
    layout: [
      {
        node_uuid: '87073935-0aff-437e-a598-e00dbe1a3168',
        type: 'container',
        order: 1,
        children: [
          {
            node_uuid: 'e120f1c4-6ecd-4d13-b1b2-0dade378cfd2',
            type: 'column',
            order: 1,
            width: 1,
            children: [
              {
                node_uuid: 'c0158027-f9b8-4e75-8bcb-c2b99aaace6a',
                type: 'field',
                order: 1,
                field_uuid: 'd73e3e4e-7aa6-4a27-a5cc-3a8d9e7b2228',
                children: [],
              },
            ],
          },
          {
            node_uuid: '29175d41-835b-43f9-a6b7-afe00c696b70',
            type: 'column',
            order: 2,
            width: 1,
            children: [
              {
                node_uuid: '29175d41-833b-43f9-a6b7-afe00c696b70',
                type: 'box',
                order: 1,
                no_of_columns: 2,
                bg_color: '#F4ECF7',
                image_url: 'https://images.unsplash.com/photo-1543713181-a6e21349e2b5?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                children: [
                  {
                    node_uuid: '87073935-0aff-437e-a598-e00dbe1a3168',
                    type: 'container',
                    order: 1,
                    children: [
                      {
                        node_uuid: '29175d41-835b-43f9-a6b7-afe00c696b70',
                        type: 'column',
                        order: 1,
                        width: 1,
                        children: [
                          {
                            node_uuid: '29175d41-833b-43f9-a6b7-afe00c696b70',
                            type: 'field',
                            field_uuid: 'a4b4cc15-0b65-4ce0-86ae-7e708f48ad1b',
                            children: [],
                            order: 1,
                          },
                        ],
                      },
                      {
                        node_uuid: '29175d41-835b-42f9-a6b7-afe00c696b70',
                        type: 'column',
                        order: 2,
                        width: 1,
                        children: [],
                      },
                    ],
                  },
                  {
                    node_uuid: '87073935-0aff-437e-a598-e00dbe1a3168',
                    type: 'container',
                    order: 2,
                    children: [
                      {
                        node_uuid: '29175d41-835b-43f9-a6b7-afe00c696b70',
                        type: 'column',
                        order: 1,
                        width: 1,
                        children: [
                          {
                            node_uuid: '29175d41-833b-43f9-a6b7-afe00c696b70',
                            type: 'field',
                            field_uuid: 'a4b4cc15-0b65-4ce0-86ae-7e708f48ad1c',
                            children: [],
                            order: 1,
                          },
                        ],
                      },
                      {
                        node_uuid: '29175d41-835b-43f9-a6b7-afe00c696b70',
                        type: 'column',
                        order: 2,
                        width: 1,
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            node_uuid: '29175d41-835b-43f9-a6b7-afe00c696b70',
            type: 'column',
            order: 3,
            width: 1,
            children: [
              {
                node_uuid: 'ef20cbdf-90ff-4e77-a194-590b2286624b',
                type: 'field',
                order: 1,
                field_uuid: 'a4b4cc15-0b65-4ce0-86ae-7e708f48ad1b',
                children: [],
              },
            ],
          },
          {
            node_uuid: '0e8ccd27-9949-43a6-b7ef-3afef61268bb',
            type: 'column',
            order: 4,
            width: 1,
            children: [
              {
                node_uuid: '920d2176-9848-42c1-8b62-c6ac88d75062',
                type: 'field',
                order: 1,
                field_uuid: '2c72211a-8063-4546-9143-3648af0545c0',
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
   {
    section_name: 'Section 2',
    section_order: 2,
    is_section_show_when_rule: false,
    no_of_columns: 4,
    section_uuid: '5ca62473-9ebc-42b6-9144-7bf818a878ae',
    layout: [
      {
        node_uuid: '5bcb5dcf-bccd-4ef0-8083-551f39b01bb2',
        type: 'container',
        order: 1,
        children: [
          {
            node_uuid: '62260fb5-17fc-425a-bde0-9f675e6aeefc',
            type: 'column',
            order: 1,
            width: 1,
            children: [
              {
                node_uuid: 'ce75c9ac-99a9-42ca-91fe-7f7a75f5d8a2',
                type: 'field',
                order: 1,
                field_uuid: '94840450-ee58-4f43-a3ee-021d69565347',
                children: [],
              },
            ],
          },
          {
            node_uuid: 'a6781977-7179-4c65-98b5-9f81be1d1018',
            type: 'column',
            order: 2,
            width: 1,
            children: [
              {
                node_uuid: 'f8c06a29-6360-43e7-9b69-6fe83811cdbd',
                type: 'field',
                order: 1,
                field_uuid: 'b162d101-1f85-47c6-bc05-242032959b91',
                children: [],
              },
            ],
          },
          {
            node_uuid: '73ea3c46-e774-408b-b404-5efeb6b31e96',
            type: 'column',
            order: 3,
            width: 1,
            children: [
              {
                node_uuid: '72a11fda-060f-4070-b01a-e43b60b2b75b',
                type: 'field',
                order: 1,
                field_uuid: 'b9b5a152-b4db-4fae-8538-c25b73bc6d57',
                children: [],
              },
            ],
          },
          {
            node_uuid: '43ea3c46-e774-408b-b404-5efeb6b31e96',
            type: 'column',
            order: 4,
            width: 1,
            children: [],
          },
        ],
      },
    ],
  },
];
