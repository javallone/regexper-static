import React from 'react';
import { mount } from 'enzyme';

import Image from './Image';

import SVGElement from '__mocks__/SVGElement';

describe('Image', () => {
  test('rendering', async () => {
    const component = mount(
      <Image>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
      </Image>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });
});
