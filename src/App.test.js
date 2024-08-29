import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
jest.mock('apollo-boost');

test('App component has been rendered correctly', () => {
  const wrapper = shallow(<App />);
  expect(wrapper).toMatchSnapshot();
});