import React from 'react';
import renderer from 'react-test-renderer';

import PageTemplate from './PageTemplate';

const env = { ...process.env };

afterEach(() => {
  process.env = env;
});

beforeEach(() => {
  process.env = {
    ...process.env,
    BANNER: 'testing',
    BUILD_ID: 'test-id'
  };
});

test('PageTemplate rendering', () => {
  const component = renderer.create(
    <PageTemplate>
      <p>Content</p>
    </PageTemplate>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('PageTemplate rendering with title', () => {
  const component = renderer.create(
    <PageTemplate title="Example">
      <p>Content</p>
    </PageTemplate>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
