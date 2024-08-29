import React from 'react';
import { apiTeamDetailsById } from './team.apiService';

describe('Team Api Testing', () => {
    it('TeamDetailsById', () => {
        const id = '5f0807239dbf8b5f2fe1710d';
        const resData = apiTeamDetailsById(id)
            .then((res) => {
                console.log('Data****', res);
                expect(res.data.success).toEqual(true);
            });
        console.log('test Response Data : ', resData);
    });
});