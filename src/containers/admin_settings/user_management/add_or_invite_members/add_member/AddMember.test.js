import React from 'react';
import { shallow } from 'enzyme';
import AddMember from './AddMember';
import { BrowserRouter as Router } from 'react-router-dom';

describe('AddMember', () => {
    it('renders correctly without info', () => {
        const wrapper = shallow(<Router><AddMember /></Router>);
        expect(wrapper).toEqual({});
    });

    it('rendered correctly Snapshot', () => {
        const wrapper = shallow(<Router><AddMember /></Router>);
        expect(wrapper).toMatchSnapshot();
    });
});



