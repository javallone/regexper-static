jest.mock('components/SVG');

import React from 'react';
import { shallow } from 'enzyme';

import { App } from 'components/App';
import { translate } from '__mocks__/i18n';

describe('App', () => {
  test('rendering', () => {
    const component = shallow(
      <App t={ translate }/>
    );
    expect(component).toMatchSnapshot();
  });
});
