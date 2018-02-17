jest.mock('components/SVG');

import React from 'react';
import { shallow } from 'enzyme';

import App from 'components/App';
import renderImage from 'components/SVG';

describe('App', () => {
  test('rendering', () => {
    renderImage.mockReturnValue('Testing image');
    const component = shallow(
      <App/>
    );
    expect(component).toMatchSnapshot();
  });
});
