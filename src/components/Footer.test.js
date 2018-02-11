import React from 'react';
import { shallow } from 'enzyme';

import Footer from './Footer';

test('Footer rendering', () => {
  const component = shallow(
    <Footer>
      <p>Content</p>
    </Footer>
  );
  expect(component).toMatchSnapshot();
});
