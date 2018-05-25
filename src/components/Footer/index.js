import React from 'react';
import { translate, Trans } from 'react-i18next';

import style from './style.css';

const Footer = () => (
  <footer>
    <ul>
      <li>
        <Trans>Created by <a href="mailto:jeff.avallone@gmail.com">Jeff Avallone</a></Trans>
      </li>
      <li>
        <Trans i18nKey="Generated images licensed">
          Generated images licensed: <a rel="license external noopener noreferrer" target="_blank" href="http://creativecommons.org/licenses/by/3.0/">
            <img
              alt="Creative Commons CC-BY-3.0 License"
              src="https://licensebuttons.net/l/by/3.0/80x15.png" />
          </a>
        </Trans>
      </li>
      <li>
        <a href="/privacy.html"><Trans>Privacy Policy</Trans></a>
      </li>
    </ul>
    <div className={ style.buildId }>{ process.env.BUILD_ID }</div>
  </footer>
);

export default translate()(Footer);
export { Footer };
