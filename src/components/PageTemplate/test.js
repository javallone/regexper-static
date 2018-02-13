import React from 'react';
import { shallow } from 'enzyme';

import PageTemplate from './index';

const env = { ...process.env };

afterEach(() => {
  process.env = env;
});

beforeEach(() => {
  process.env = {
    ...process.env,
    BUILD_ID: 'test-id'
  };
});

test('PageTemplate rendering', () => {
  const component = shallow(
    <PageTemplate>
      <p>Content</p>
    </PageTemplate>
  );
  expect(component).toMatchSnapshot();
});

test('PageTemplate rendering with title', () => {
  const component = shallow(
    <PageTemplate title="Example">
      <p>Content</p>
    </PageTemplate>
  );
  expect(component).toMatchSnapshot();
});
