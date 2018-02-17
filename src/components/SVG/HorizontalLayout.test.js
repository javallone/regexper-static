import React from 'react';
import { mount } from 'enzyme';

import HorizontalLayout from './HorizontalLayout';

import SVGElement from '__mocks__/SVGElement';

describe('HorizontalLayout', () => {
  test('rendering', async () => {
    const component = mount(
      <HorizontalLayout>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
      </HorizontalLayout>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });

  test('rendering with connectors', async () => {
    const component = mount(
      <HorizontalLayout withConnectors>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
      </HorizontalLayout>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });
});
