import React from 'react';
import { shallow } from 'enzyme';

import { Form } from 'components/Form';
import { translate } from '__mocks__/i18n';

const syntaxes = {
  js: 'Javascript',
  pcre: 'PCRE'
};

describe('Form', () => {
  test('rendering', () => {
    const component = shallow(
      <Form t={ translate } syntaxes={ syntaxes }/>
    );
    expect(component).toMatchSnapshot();
  });

  test('rendering with download URLs', () => {
    const downloadUrls = [
      { url: '#svg', filename: 'image.svg', type: 'image/svg+xml', label: 'Download SVG' },
      { url: '#png', filename: 'image.png', type: 'image/png', label: 'Download PNG' }
    ];
    const component = shallow(
      <Form t={ translate } syntaxes={ syntaxes } downloadUrls={ downloadUrls }/>
    );
    expect(component).toMatchSnapshot();
  });

  test('rendering with permalink URL', () => {
    const permalinkUrl = '#permalink';
    const component = shallow(
      <Form t={ translate } syntaxes={ syntaxes } permalinkUrl={ permalinkUrl }/>
    );
    expect(component).toMatchSnapshot();
  });

  test('changing expression input', () => {
    const component = shallow(
      <Form t={ translate } syntaxes={ syntaxes }/>
    );
    const eventObj = {
      target: { name: 'expr', value: 'Testing value' }
    };
    component.find('[name="expr"]').simulate('change', eventObj);

    expect(component.state('expr')).toEqual('Testing value');
  });

  test('changing syntax input', () => {
    const component = shallow(
      <Form t={ translate } syntaxes={ syntaxes }/>
    );
    const eventObj = {
      target: { name: 'syntax', value: 'Testing value' }
    };
    component.find('[name="syntax"]').simulate('change', eventObj);

    expect(component.state('syntax')).toEqual('Testing value');
  });

  test('setting expression and syntax via props', () => {
    const component = shallow(
      <Form t={ translate } syntaxes={ syntaxes }/>
    );
    expect(component.state()).toEqual(expect.objectContaining({
      expr: undefined,
      syntax: 'js'
    }));
    component.setProps({ expr: 'Testing expression' });
    expect(component.state()).toEqual(expect.objectContaining({
      expr: 'Testing expression',
      syntax: 'js'
    }));
    component.setProps({ syntax: 'testing syntax' });
    expect(component.state()).toEqual(expect.objectContaining({
      expr: 'Testing expression',
      syntax: 'testing syntax'
    }));
  });

  describe('submitting expression', () => {
    test('submitting form', () => {
      const onSubmit = jest.fn();
      const component = shallow(
        <Form t={ translate } syntaxes={ syntaxes } onSubmit={ onSubmit }/>
      );
      const eventObj = { preventDefault: jest.fn() };
      component.setState({ syntax: 'test', expr: 'Test expression' });
      component.find('form').simulate('submit', eventObj);

      expect(eventObj.preventDefault).toHaveBeenCalled();
      expect(onSubmit).toHaveBeenCalledWith({
        expr: 'Test expression',
        syntax: 'test'
      });
    });

    test('submitting form with Shift+Enter', () => {
      const component = shallow(
        <Form t={ translate } syntaxes={ syntaxes } onSubmit={ Function.prototype }/>
      );
      const form = component.instance();
      const eventObj = {
        preventDefault: Function.prototype,
        charCode: 13,
        shiftKey: true
      };
      jest.spyOn(form, 'handleSubmit');
      component.find('textarea').simulate('keypress', eventObj);

      expect(form.handleSubmit).toHaveBeenCalled();
    });

    test('not submitting with just Enter', () => {
      const component = shallow(
        <Form t={ translate } syntaxes={ syntaxes } onSubmit={ Function.protoytpe }/>
      );
      const form = component.instance();
      const eventObj = {
        preventDefault: Function.prototype,
        charCode: 13,
        shiftKey: false
      };
      jest.spyOn(form, 'handleSubmit');
      component.find('textarea').simulate('keypress', eventObj);

      expect(form.handleSubmit).not.toHaveBeenCalled();
    });
  });
});
