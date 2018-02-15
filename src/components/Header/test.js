import React from 'react';
import { shallow } from 'enzyme';

import { Header } from 'components/Header';

describe('Header', () => {
  beforeEach(() => {
    process.env.BANNER = 'testing';
  });

  test('rendering', () => {
    const component = shallow(
      <Header/>
    );
    expect(component).toMatchSnapshot();
  });
});
