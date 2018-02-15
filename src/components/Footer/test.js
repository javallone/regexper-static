import React from 'react';
import { shallow } from 'enzyme';

import { Footer } from 'components/Footer';

describe('Footer', () => {
  test('rendering', () => {
    const component = shallow(
      <Footer/>
    );
    expect(component).toMatchSnapshot();
  });
});
