import React from 'react';
import { shallow, render } from 'enzyme';

import Message from 'components/Message';

describe('Message', () => {
  test('rendering', () => {
    const component = shallow(
      <Message heading="Testing" className="testing">
        <p>Message content</p>
      </Message>
    );
    expect(component).toMatchSnapshot();
  });

  test('rendering with icon', () => {
    const Icon = () => 'Sample icon SVG';
    const component = render(
      <Message heading="Testing" icon={ Icon }>
        <p>Message content</p>
      </Message>
    );
    expect(component).toMatchSnapshot();
  });

  test('rendering with type', () => {
    const component = render(
      <Message heading="Testing" type="error">
        <p>Message content</p>
      </Message>
    );
    expect(component).toMatchSnapshot();
  });
});
