import React from 'react';
import { shallow } from 'enzyme';

import App from 'components/App';

test('Message rendering', () => {
  const component = shallow(
    <App/>
  );
  expect(component).toMatchSnapshot();
});
