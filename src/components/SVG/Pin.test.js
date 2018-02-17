import React from 'react';
import { mount } from 'enzyme';

import Pin from './Pin';

describe('Pin', () => {
  test('rendering', async () => {
    const component = mount(
      <Pin/>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });
});
