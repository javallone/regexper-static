import React from 'react';
import renderer from 'react-test-renderer';

import Message from './Message';

test('Message rendering', () => {
  const component = renderer.create(
    <Message heading="Testing">
      <p>Message content</p>
    </Message>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Message rendering with icon', () => {
  const Icon = () => 'Sample icon SVG';
  const component = renderer.create(
    <Message heading="Testing" icon={ Icon }>
      <p>Message content</p>
    </Message>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
