jest.mock('raven-js');

import React from 'react';
import { shallow } from 'enzyme';
import Raven from 'raven-js';

import { RavenError } from 'components/RavenError';
import translate from '__mocks__/translate';

const testError = { error: 'test error' };
const testDetails = { details: 'test details' };

describe('RavenError', () => {
  test('rendering', () => {
    const component = shallow(
      <RavenError
        error={ testError }
        details={ testDetails }
        t={ translate }/>
    );
    expect(component).toMatchSnapshot();
  });

  test('captures exception', () => {
    shallow(
      <RavenError
        error={ testError }
        details={ testDetails }
        t={ translate }/>
    );
    expect(Raven.captureException).toHaveBeenCalledWith(testError, testDetails);
  });

  describe('error reporting', () => {
    test('clicking to fill out a report when an event has been logged', () => {
      Raven.lastEventId.mockReturnValue(1);
      const component = shallow(
        <RavenError
          error={ testError }
          details={ testDetails }
          t={ translate }/>
      );
      const eventObj = { preventDefault: jest.fn() };
      component.find('a').simulate('click', eventObj);

      expect(eventObj.preventDefault).toHaveBeenCalled();
      expect(Raven.showReportDialog).toHaveBeenCalled();
    });

    test('clicking to fill out a report when an event has not been logged', () => {
      Raven.lastEventId.mockReturnValue(false);
      const component = shallow(
        <RavenError
          error={ testError }
          details={ testDetails }
          t={ translate }/>
      );
      const eventObj = { preventDefault: jest.fn() };
      component.find('a').simulate('click', eventObj);

      expect(eventObj.preventDefault).toHaveBeenCalled();
      expect(Raven.showReportDialog).not.toHaveBeenCalled();
    });
  });
});
