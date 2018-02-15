import React from 'react';
import { shallow } from 'enzyme';

import { Header } from 'components/Header';

const env = { ...process.env };

describe('Header', () => {
  afterEach(() => {
    process.env = env;
  });

  beforeEach(() => {
    process.env = {
      ...process.env,
      BANNER: 'testing'
    };
  });

  test('rendering', () => {
    const component = shallow(
      <Header/>
    );
    expect(component).toMatchSnapshot();
  });
});
