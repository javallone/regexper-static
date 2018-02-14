import React from 'react';
import { shallow } from 'enzyme';

import { Footer } from 'components/Footer';

describe('Footer', () => {
  test('rendering', () => {
    const component = shallow(
      <Footer>
        <p>Content</p>
      </Footer>
    );
    expect(component).toMatchSnapshot();
  });
});
