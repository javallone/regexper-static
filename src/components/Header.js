import React from 'react';

import GithubIcon from 'feather-icons/dist/icons/github.svg';

const Header = () => (
  <header id="main" data-banner={ process.env.BANNER }>
    <h1>
      <a href="/">Regexper</a>
    </h1>

    <ul className="inline">
      <li><a href="https://github.com/javallone/regexper-static">
        <GithubIcon/>Source on GitHub
      </a></li>
    </ul>
  </header>
);

export default Header;
