import React from 'react';
import { shallow } from 'enzyme';

import { translate } from 'i18n';
import { Component } from './Component';

describe('404 page component', () => {
  test('rendering', () => {
    const component = shallow(
      <Component t={ translate }/>
    );
    expect(component).toMatchSnapshot();
  });
});
