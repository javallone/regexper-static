import React from 'react';
import { translate, Trans } from 'react-i18next';

import style from './style.css';
import GithubIcon from 'feather-icons/dist/icons/github.svg';

import LocaleSwitcher from 'components/LocaleSwitcher';

const Header = () => (
  <header className={ style.header } data-banner={ process.env.BANNER }>
    <h1>
      <a href="/">Regexper</a>
    </h1>

    <ul>
      <li><a href="https://github.com/javallone/regexper-static" rel="external noopener noreferrer" target="_blank">
        <GithubIcon/><Trans>Source on GitHub</Trans>
      </a></li>
      <li>
        <a href="/privacy.html"><Trans>Privacy Policy</Trans></a>
      </li>
      <li><LocaleSwitcher /></li>
    </ul>
  </header>
);

export default translate()(Header);
export { Header };
