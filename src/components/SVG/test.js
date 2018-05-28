import React from 'react';
import { shallow } from 'enzyme';

import SVG from 'components/SVG';

describe('SVG', () => {
  test('rendering', async () => {
    const data = {
      type: 'Pin'
    };
    const component = shallow(
      <SVG data={ data }/>
    );
    expect(component).toMatchSnapshot();
  });

  test('rendering 1 child', () => {
    const data = {
      type: 'Image',
      children: [
        {
          type: 'Pin'
        }
      ]
    };
    const component = shallow(
      <SVG data={ data }/>
    );
    expect(component).toMatchSnapshot();
  });

  test('rendering multiple children', () => {
    const data = {
      type: 'HorizontalLayout',
      children: [
        {
          type: 'Pin'
        },
        {
          type: 'Pin'
        }
      ]
    };
    const component = shallow(
      <SVG data={ data }/>
    );
    expect(component).toMatchSnapshot();
  });

  test('rendering a string as a child', () => {
    const data = {
      type: 'Text',
      children: [
        'Sample text'
      ]
    };
    const component = shallow(
      <SVG data={ data }/>
    );
    expect(component).toMatchSnapshot();
  });

  test('passing props to nodes', () => {
    const data = {
      type: 'Text',
      props: {
        theme: 'anchorText'
      },
      children: [
        'Sample text'
      ]
    };
    const component = shallow(
      <SVG data={ data }/>
    );
    expect(component).toMatchSnapshot();
  });

  test('arbitrary markup', () => {
    const data = {
      type: 'Text',
      children: [
        {
          type: 'tspan',
          children: [
            'Sample text'
          ]
        }
      ]
    };
    const component = shallow(
      <SVG data={ data }/>
    );
    expect(component).toMatchSnapshot();
  });
});
