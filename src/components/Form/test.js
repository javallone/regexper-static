import React from 'react';
import { shallow, mount } from 'enzyme';

import { Form } from 'components/Form';
import { translate, I18nWrapper } from '__mocks__/i18n';

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

  describe('submitting expression', () => {
    const build = (props = {}) => {
      const component = mount(
        <I18nWrapper>
          <Form syntaxes={ syntaxes } { ...props }/>
        </I18nWrapper>
      );
      return component;
    };

    test('submitting form', () => {
      const onSubmit = jest.fn();
      const component = build({ onSubmit });
      const eventObj = { preventDefault: jest.fn() };
      component.find(Form).instance().textarea.value = 'Test textarea value';
      component.find('form').simulate('submit', eventObj);

      expect(eventObj.preventDefault).toHaveBeenCalled();
      expect(onSubmit).toHaveBeenCalledWith({
        expr: 'Test textarea value',
        syntax: 'js'
      });
    });

    test('submitting form with Shift+Enter', () => {
      const component = build({ onSubmit: Function.prototype });
      const form = component.find(Form).instance();
      const eventObj = { charCode: 13, shiftKey: true };
      jest.spyOn(form, 'handleSubmit');
      component.find('textarea').simulate('keypress', eventObj);

      expect(form.handleSubmit).toHaveBeenCalled();
    });

    test('not submitting with just Enter', () => {
      const component = build({ onSubmit: Function.prototype });
      const form = component.find(Form).instance();
      const eventObj = { charCode: 13, shiftKey: false };
      jest.spyOn(form, 'handleSubmit');
      component.find('textarea').simulate('keypress', eventObj);

      expect(form.handleSubmit).not.toHaveBeenCalled();
    });
  });
});
