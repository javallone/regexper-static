import React from 'react';
import { shallow } from 'enzyme';

import { Form } from 'components/Form';
import { translate, I18nWrapper } from '__mocks__/i18n';

const syntaxes = {
  js: 'Javascript',
  pcre: 'PCRE'
};

describe('Form', () => {
  test('rendering', () => {
    const component = shallow(
      <Form t={ translate } syntaxes={ syntaxes }/>
    );
    expect(component).toMatchSnapshot();
  });

  test('rendering with download URLs');

  test('rendering with permalink URL');

  test('submitting form');

  test('submitting form with Shift+Enter');
});
