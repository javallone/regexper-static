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

  test('error reporting', () => {
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
});
