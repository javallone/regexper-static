import React from 'react';
import { mount } from 'enzyme';

import Loop from './Loop';

import SVGElement from '__mocks__/SVGElement';

const originalGetBBox = window.Element.prototype.getBBox;

describe('Loop', () => {
  beforeEach(() => {
    window.Element.prototype.getBBox = function() {
      return { width: 100, height: 10 };
    };
  });

  afterEach(() => {
    window.Element.prototype.getBBox = originalGetBBox;
  });

  test('rendering', async () => {
    const component = mount(
      <Loop>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
      </Loop>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });

  test('rendering with skip path', async () => {
    const component = mount(
      <Loop skip>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
      </Loop>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });

  test('rendering with repeat path', async () => {
    const component = mount(
      <Loop repeat>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
      </Loop>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });

  test('rendering with repeat path and label', async () => {
    const component = mount(
      <Loop repeat label="Test label">
        <SVGElement bbox={{ width: 100, height: 100 }}/>
      </Loop>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });

  test('rendering with skip and repeat paths', async () => {
    const component = mount(
      <Loop skip repeat>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
      </Loop>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });

  test('rendering with greedy skip and repeat paths', async () => {
    const component = mount(
      <Loop greedy skip repeat>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
      </Loop>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });
});
