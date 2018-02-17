import React from 'react';
import { mount } from 'enzyme';

import Box from './Box';

import SVGElement from '__mocks__/SVGElement';

const originalGetBBox = window.Element.prototype.getBBox;

describe('Box', () => {
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
      <Box>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
      </Box>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });

  test('rendering with content anchors', async () => {
    const component = mount(
      <Box useAnchors>
        <SVGElement bbox={{ width: 100, height: 100 }}/>
      </Box>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });

  test('rendering with label', async () => {
    const component = mount(
      <Box label="Test label">
        <SVGElement bbox={{ width: 100, height: 100 }}/>
      </Box>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });
});
