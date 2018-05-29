import React from 'react';
import { shallow } from 'enzyme';

import { InstallPrompt } from 'components/InstallPrompt';
import { translate } from '__mocks__/i18n';

describe('InstallPrompt', () => {
  test('rendering', () => {
    const component = shallow(
      <InstallPrompt t={ translate }/>
    );
    expect(component).toMatchSnapshot();
  });
});
