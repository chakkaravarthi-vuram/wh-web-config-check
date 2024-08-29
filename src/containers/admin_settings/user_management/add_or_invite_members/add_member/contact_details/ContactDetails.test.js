import React from 'react';
import { shallow } from 'enzyme';
import ContactDetails from './ContactDetails';
import { BrowserRouter as Router } from 'react-router-dom';

describe('ContactDetails', () => {
    it('renders correctly without info', () => {
        const wrapper = shallow(<Router><ContactDetails /></Router>);
        expect(wrapper).toEqual({});
    });

    it('rendered correctly Snapshot', () => {
        const wrapper = shallow(<Router><ContactDetails /></Router>);
        expect(wrapper).toMatchSnapshot();
    });
});



