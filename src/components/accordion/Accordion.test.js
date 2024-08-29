import React from 'react';
import { shallow } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import Accordion from './Accordion';

const props = {
  headerText:'test',
  onHeaderClick:()=>null
}

test('App component has been rendered correctly', () => {
  const wrapper = shallow(<Router><Accordion {...props} /></Router>);
  expect(wrapper).toMatchSnapshot();
});