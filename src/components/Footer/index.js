import React from 'react';
import { translate, Trans } from 'react-i18next';

const Footer = () => (
  <footer>
    <ul className="inline with-separator">
      <li>
        <Trans>Created by <a href="mailto:jeff.avallone@gmail.com">Jeff Avallone</a></Trans>
      </li>
      <li>
        <Trans i18nKey="Generated images licensed">
          Generated images licensed: <a rel="license" href="http://creativecommons.org/licenses/by/3.0/">
            <img
              alt="Creative Commons CC-BY-3.0 License"
              src="https://licensebuttons.net/l/by/3.0/80x15.png" />
          </a>
        </Trans>
      </li>
    </ul>
  </footer>
);

export default translate()(Footer);
export { Footer };
