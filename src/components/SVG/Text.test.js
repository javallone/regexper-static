import React from 'react';
import { mount } from 'enzyme';

import Text from './Text';

const originalGetBBox = window.Element.prototype.getBBox;

describe('Text', () => {
  beforeEach(() => {
    window.Element.prototype.getBBox = function() {
      return { x: 10, y: 10 };
    };
  });

  afterEach(() => {
    window.Element.prototype.getBBox = originalGetBBox;
  });

  test('rendering', async () => {
    const component = mount(
      <Text>Test content</Text>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });

  test('rendering with quotes', async () => {
    const component = mount(
      <Text quoted>Test content</Text>
    );
    await component.instance().doReflow();
    component.update();
    expect(component).toMatchSnapshot();
  });
});
