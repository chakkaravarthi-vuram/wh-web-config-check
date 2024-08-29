import React from 'react';
import { shallow } from 'enzyme';
import AdminSettings from './AdminSettings';

test('App component has been rendered correctly', () => {
  const wrapper = shallow(<AdminSettings />);
  expect(wrapper).toMatchSnapshot();
});