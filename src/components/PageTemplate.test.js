import React from 'react';
import renderer from 'react-test-renderer';

import PageTemplate from './PageTemplate';

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
