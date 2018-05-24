import React from 'react';
import { shallow } from 'enzyme';

import { Component } from './Component';

describe('Privacy policy page component', () => {
  test('rendering', () => {
    const component = shallow(
      <Component/>
    );
    expect(component).toMatchSnapshot();
  });
});
