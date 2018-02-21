import React from 'react';
import { mount } from 'enzyme';

import VerticalLayout from './VerticalLayout';

import SVGElement from '__mocks__/SVGElement';

describe('VerticalLayout', () => {
  test('rendering', async () => {
    const component = mount(
      <VerticalLayout>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
      </VerticalLayout>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });

  test('rendering with connectors', async () => {
    const component = mount(
      <VerticalLayout withConnectors>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
      </VerticalLayout>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });

  test('rendering with connectors (no sides)', async () => {
    const component = mount(
      <VerticalLayout withConnectors>
        <SVGElement bbox={{ width: 100, height: 10 }}/>
        <SVGElement bbox={{ width: 100, height: 10 }}/>
      </VerticalLayout>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });
});
