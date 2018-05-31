jest.mock('components/SVG');

import React from 'react';
import { shallow } from 'enzyme';

import { LocaleSwitcher } from 'components/LocaleSwitcher';
import { translate } from '__mocks__/i18n';

describe('LocaleSwitcher', () => {
  test('rendering', () => {
    const component = shallow(
      <LocaleSwitcher t={ translate }/>
    );
    expect(component).toMatchSnapshot();
  });
});
