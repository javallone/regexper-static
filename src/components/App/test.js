import React from 'react';
import { shallow } from 'enzyme';

import App from 'components/App';

describe('App', () => {
  test('rendering', () => {
    const component = shallow(
      <App/>
    );
    expect(component).toMatchSnapshot();
  });
});
