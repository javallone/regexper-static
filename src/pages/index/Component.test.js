import React from 'react';
import { shallow } from 'enzyme';

import Component from './Component';

describe('Index page component', () => {
  test('rendering', () => {
    const component = shallow(
      <Component/>
    );
    expect(component).toMatchSnapshot();
  });
});
