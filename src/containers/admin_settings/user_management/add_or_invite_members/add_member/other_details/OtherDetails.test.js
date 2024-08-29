import React from 'react';
import { shallow } from 'enzyme';
import OtherDetails from './OtherDetails';
import { BrowserRouter as Router } from 'react-router-dom';

describe('OtherDetails', () => {
    it('renders correctly without info', () => {
        const wrapper = shallow(<Router><OtherDetails /></Router>);
        expect(wrapper).toEqual({});
    });

    it('rendered correctly Snapshot', () => {
        const wrapper = shallow(<Router><OtherDetails /></Router>);
        expect(wrapper).toMatchSnapshot();
    });
});



