import React from 'react';
import { shallow } from 'enzyme';

import { Header } from './index';

const env = { ...process.env };

afterEach(() => {
  process.env = env;
});

beforeEach(() => {
  process.env = {
    ...process.env,
    BANNER: 'testing'
  };
});

test('Header rendering', () => {
  const component = shallow(
    <Header>
      <p>Content</p>
    </Header>
  );
  expect(component).toMatchSnapshot();
});
