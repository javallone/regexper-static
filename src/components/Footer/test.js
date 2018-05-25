import React from 'react';
import { shallow } from 'enzyme';

import { Footer } from 'components/Footer';

describe('Footer', () => {
  beforeEach(() => {
    process.env.BUILD_ID = 'example build id';
  });

  test('rendering', () => {
    const component = shallow(
      <Footer/>
    );
    expect(component).toMatchSnapshot();
  });
});
