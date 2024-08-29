import React from 'react';
import { shallow } from 'enzyme';
import AddMemberBasicDetails from './AddMemberBasicDetails';
import { BrowserRouter as Router } from 'react-router-dom';

describe('AddMemberBasicDetails', () => {
    it('renders correctly without info', () => {
        const wrapper = shallow(<Router><AddMemberBasicDetails /></Router>);
        expect(wrapper).toEqual({});
    });

    it('rendered correctly Snapshot', () => {
        const wrapper = shallow(<Router><AddMemberBasicDetails /></Router>);
        expect(wrapper).toMatchSnapshot();
    });
});



