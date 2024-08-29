export const POLICY_LIST = [
    {
      type: 'condition',
      policy_uuid: '56747f58-649b-4163-86b3-40418d3bfe23',
      access_to: {
        user_team: {
          users: [
            {
              _id: '642d1590dff2680007a93de4',
              username: 'snekam+dev@workhall.com',
              email: 'snekam+dev@workhall.com',
              is_active: true,
              user_type: 3,
              first_name: 'Sneka',
              last_name: 'M',
            },
            {
              _id: '642aab1f591be000074302ea',
              username: 'snekam_normal',
              first_name: 'Sneka',
              last_name: 'M',
              email: 'snekam+normal@workhall.com',
              is_active: true,
              user_type: 2,
            },
          ],
        },
      },
      policy: {
        expression_uuid: '56747f58-649b-4163-86b3-40418d3bfe23',
        logical_operator: 'and',
        conditions: [
          {
            condition_type: 'direct',
            condition_uuid: '9715dc47-9e01-431d-b0c1-f07a100f319e',
            l_field: '636ff779-b9b6-4a34-a72a-02d224732394',
            operator: 'stringEqualsTo',
            r_value: '1',
          },
        ],
      },
    },
    {
      type: 'user_field',
      policy_uuid: '3cbce0ec-3160-4606-a027-350f77bd6e1b',
      access_to: {
        field_uuids: [
          {
            key: '',
          },
        ],
      },
    },
  ];
