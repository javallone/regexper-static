jest.mock('components/SVG');

import React from 'react';
import { shallow } from 'enzyme';

import { App } from 'components/App';
import renderImage from 'components/SVG';
import { translate } from '__mocks__/i18n';

describe('App', () => {
  test('rendering', () => {
    renderImage.mockReturnValue('Testing image');
    const component = shallow(
      <App t={ translate }/>
    );
    expect(component).toMatchSnapshot();
  });
});
